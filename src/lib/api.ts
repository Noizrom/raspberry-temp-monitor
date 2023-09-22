// This Thing works in any deployment environment. do not touch
var SERVER = "http://localhost";
var PORT = "8000";

if (import.meta.env.PROD) {
  SERVER = location.hostname;
  PORT = location.port;
}

// get if https or http
const PROTOCOL = location.protocol;
// set if using ws or wss
const WS_PROTOCOL = PROTOCOL === "https:" ? "wss:" : "ws:";

console.table({
  Server: SERVER,
  Port: PORT,
  Protocol: PROTOCOL,
  "WS Protocol": WS_PROTOCOL,
});

const get_websocket_url = (endpoint: string) => {
  // end point should start with a /
  return `${WS_PROTOCOL}//${SERVER.replace(PROTOCOL, "")}:${PORT}${endpoint}`;
};
// ==================== API ====================

export interface DataResponse {
  successful: boolean;
  result?: number;
  error?: string;
}

export function connect_websocket(
  endpoint: string,
  newvalue_callback?: (data: number) => void,
  connected?: () => void,
  disconnected?: () => void,
  onerror?: (error: string) => void,
  disconnect?: () => void
) {
  var socket = new WebSocket(get_websocket_url(endpoint));

  socket.onopen = () => {
    connected && connected();
  };

  socket.onclose = () => {
    disconnected && disconnected();
    // try to reconnect every 5 seconds
    setTimeout(() => {
      return connect_websocket(
        endpoint,
        newvalue_callback,
        connected,
        disconnected
      );
    }, 5000);
  };

  socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data) as DataResponse;
    // console.log({ data });
    if (data.successful) {
      newvalue_callback && newvalue_callback(data.result || 0);
    } else {
      onerror && onerror(data.error || "Unknown Error");
    }
  };

  return () => {
    socket.close();
  };
}
