import json
import logging
from typing import List, Dict, Any
from fastapi import WebSocket

logger = logging.getLogger("websocket")

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.channel_subscribers: Dict[str, List[WebSocket]] = {
            "fleet": [],
            "telemetry": [],
            "alerts": [],
            "system_health": [],
            "optimization": []
        }

    async def connect(self, websocket: WebSocket, channel: str = "fleet"):
        await websocket.accept()
        self.active_connections.append(websocket)
        if channel in self.channel_subscribers:
            self.channel_subscribers[channel].append(websocket)
        logger.info(f"Client connected to channel: {channel}. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        for ch_list in self.channel_subscribers.values():
            if websocket in ch_list:
                ch_list.remove(websocket)
        logger.info(f"Client disconnected. Remaining: {len(self.active_connections)}")

    async def broadcast(self, message: Dict[str, Any], channel: str = "fleet"):
        data_str = json.dumps(message)
        subscribers = self.channel_subscribers.get(channel, self.active_connections)
        disconnected = []
        for connection in subscribers:
            try:
                await connection.send_text(data_str)
            except Exception as e:
                disconnected.append(connection)
                
        for dead_conn in disconnected:
            self.disconnect(dead_conn)

ws_manager = ConnectionManager()
