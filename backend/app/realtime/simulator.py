import asyncio
import random
import logging
from datetime import datetime
from app.database.mock_data import db
from app.realtime.websocket_manager import ws_manager
from app.ml.fuel_model import fuel_engine

logger = logging.getLogger("simulator")

class RealtimeFleetSimulator:
    def __init__(self):
        self.is_running = False
        self.step_counter = 0

    async def start(self):
        self.is_running = True
        logger.info("Real-time Maritime Fleet Simulator started.")
        while self.is_running:
            try:
                await self.tick()
                await asyncio.sleep(4.0) # Tick interval 4 seconds
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in fleet simulator tick: {e}")
                await asyncio.sleep(4.0)

    async def tick(self):
        self.step_counter += 1
        now_str = datetime.utcnow().strftime("%d %b %Y, %H:%M:%S UTC")
        
        # 1. Update vessel live positions and engine telemetry
        vessel_updates = []
        for vessel in db.vessels:
            if vessel["status"] == "On Route":
                # Nudge latitude/longitude along general bearing
                bearing_rad = (vessel["heading_deg"] * 3.14159) / 180.0
                step_dist = 0.008 # degrees step
                vessel["current_lat"] += step_dist * 0.7 * (1 if vessel["heading_deg"] < 180 else -1)
                vessel["current_lng"] += step_dist * 1.2 * (1 if 0 <= vessel["heading_deg"] <= 180 else -1)
                
                # Small speed & RPM jitter
                vessel["speed_knots"] = round(vessel["opt_speed_knots"] + random.uniform(-0.3, 0.4), 1)
                rpm_jitter = random.randint(-2, 2)
                engine_rpm = 78 + rpm_jitter
                
                # Predict new dynamic fuel flow rate
                pred = fuel_engine.predict_fuel_consumption(
                    vessel_dwt=vessel["dwt"],
                    speed_knots=vessel["speed_knots"],
                    draft_m=vessel["draft_m"],
                    cargo_tonnes=vessel["dwt"] * 0.8,
                    wind_speed_knots=18.0 if "Cyclone" in vessel["weather_enroute"] else 12.0,
                    wave_height_m=4.5 if "Cyclone" in vessel["weather_enroute"] else 1.8
                )
                vessel["fuel_flow_mt_day"] = pred["fuel_mt_day"]
                vessel["ghg_emissions_day"] = round(pred["fuel_mt_day"] * 3.15, 1)
                
                vessel_update = {
                    "vessel_id": vessel["id"],
                    "vessel_name": vessel["name"],
                    "lat": round(vessel["current_lat"], 4),
                    "lng": round(vessel["current_lng"], 4),
                    "speed_knots": vessel["speed_knots"],
                    "heading_deg": vessel["heading_deg"],
                    "fuel_flow_mt_day": vessel["fuel_flow_mt_day"],
                    "ghg_emissions_day": vessel["ghg_emissions_day"],
                    "engine_rpm": engine_rpm,
                    "engine_temp_c": round(82.0 + random.uniform(-1.0, 1.5), 1),
                    "exhaust_temp_c": round(430.0 + random.uniform(-4.0, 6.0), 1),
                    "oil_pressure_bar": round(4.2 + random.uniform(-0.1, 0.1), 2),
                    "wind_speed_knots": 18 if "Cyclone" in vessel["weather_enroute"] else 12,
                    "wave_height_m": 4.5 if "Cyclone" in vessel["weather_enroute"] else 1.6,
                    "timestamp": now_str
                }
                vessel_updates.append(vessel_update)
                
        # 2. Broadcast live WebSocket message
        msg = {
            "type": "FLEET_TELEMETRY_UPDATE",
            "timestamp": now_str,
            "step": self.step_counter,
            "vessels": vessel_updates,
            "active_vessels_count": len([v for v in db.vessels if v["status"] == "On Route"]),
            "active_alerts_count": len([a for a in db.alerts if not a.get("acknowledged", False)])
        }
        await ws_manager.broadcast(msg, channel="fleet")
        await ws_manager.broadcast(msg, channel="telemetry")

fleet_simulator = RealtimeFleetSimulator()
