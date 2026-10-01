import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import config
from app.realtime.websocket_manager import ws_manager
from app.realtime.simulator import fleet_simulator

# Routers
from app.api.auth import router as auth_router
from app.api.vessels import router as vessels_router
from app.api.voyages import router as voyages_router
from app.api.predictions import router as predictions_router
from app.api.optimization import router as optimization_router
from app.api.scenarios import router as scenarios_router
from app.api.alerts import router as alerts_router
from app.api.analytics import router as analytics_router
from app.api.settings import router as settings_router
from app.api.integrations import router as integrations_router
from app.api.system import router as system_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: launch live fleet simulator in background
    sim_task = asyncio.create_task(fleet_simulator.start())
    logger.info("Real-time Fleet Simulation background task launched.")
    yield
    # Shutdown: stop simulator
    fleet_simulator.is_running = False
    sim_task.cancel()
    try:
        await sim_task
    except asyncio.CancelledError:
        pass
    logger.info("Fleet Simulation background task terminated.")

app = FastAPI(
    title="Smart Maritime Fleet Optimization & Fuel Intelligence Platform",
    description="SIH26138 - Quantum-Inspired Green Fleet Optimization & Multi-Objective Decision Support System",
    version=config.VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include all API routers
app.include_router(auth_router, prefix=config.API_V1_PREFIX)
app.include_router(vessels_router, prefix=config.API_V1_PREFIX)
app.include_router(voyages_router, prefix=config.API_V1_PREFIX)
app.include_router(predictions_router, prefix=config.API_V1_PREFIX)
app.include_router(optimization_router, prefix=config.API_V1_PREFIX)
app.include_router(scenarios_router, prefix=config.API_V1_PREFIX)
app.include_router(alerts_router, prefix=config.API_V1_PREFIX)
app.include_router(analytics_router, prefix=config.API_V1_PREFIX)
app.include_router(settings_router, prefix=config.API_V1_PREFIX)
app.include_router(integrations_router, prefix=config.API_V1_PREFIX)
app.include_router(system_router, prefix=config.API_V1_PREFIX)

# WebSocket endpoint
@app.websocket("/ws/{channel}")
async def websocket_endpoint(websocket: WebSocket, channel: str = "fleet"):
    await ws_manager.connect(websocket, channel)
    try:
        while True:
            # Keep connection alive and receive any client messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        ws_manager.disconnect(websocket)

@app.get("/")
async def root():
    return {
        "platform": "Smart Maritime Green Fleet Optimizer",
        "version": config.VERSION,
        "status": "Operational",
        "docs_url": "/docs",
        "websocket_url": "/ws/fleet"
    }
