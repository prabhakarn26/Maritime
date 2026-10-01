type WebSocketCallback = (data: any) => void;

class RealtimeWebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<WebSocketCallback>> = new Map();
  private reconnectInterval: number = 4000;
  private isExplicitlyClosed: boolean = false;

  constructor() {
    this.connect();
  }

  public connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/fleet`;

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('[WebSocket] Connected to live fleet stream.');
      };

      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const eventType = parsed.type || 'FLEET_TELEMETRY_UPDATE';
          
          // Notify specific listeners
          if (this.listeners.has(eventType)) {
            this.listeners.get(eventType)?.forEach((cb) => cb(parsed));
          }
          // Notify wildcard listeners
          if (this.listeners.has('*')) {
            this.listeners.get('*')?.forEach((cb) => cb(parsed));
          }
        } catch (err) {
          console.error('[WebSocket] Error parsing message:', err);
        }
      };

      this.socket.onclose = () => {
        if (!this.isExplicitlyClosed) {
          setTimeout(() => this.connect(), this.reconnectInterval);
        }
      };

      this.socket.onerror = (error) => {
        console.warn('[WebSocket] Connection warning, retrying in background.');
      };
    } catch (e) {
      console.error('[WebSocket] Failed to initialize WebSocket:', e);
    }
  }

  public subscribe(eventType: string, callback: WebSocketCallback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(callback);

    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  public close() {
    this.isExplicitlyClosed = true;
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const wsService = new RealtimeWebSocketService();
