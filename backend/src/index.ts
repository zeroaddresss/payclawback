import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "./config";
import { initBlockchain, setupEventListeners, eventBus } from "./services/blockchain";
import healthRoutes from "./routes/health";
import escrowRoutes from "./routes/escrow";
import type { EscrowEvent } from "./types";
import type { ServerWebSocket } from "bun";

const app = new Hono();

// CORS middleware - allow all origins
app.use("*", cors());

// Mount routes
app.route("/", healthRoutes);
app.route("/", escrowRoutes);

// Track connected WebSocket clients
const clients = new Set<ServerWebSocket<unknown>>();

// Initialize blockchain services
if (config.privateKey && config.contractAddress) {
  initBlockchain();
  setupEventListeners();

  // Broadcast events to all connected WebSocket clients
  eventBus.on("escrow-event", (event: EscrowEvent) => {
    const message = JSON.stringify(event);
    for (const ws of clients) {
      try {
        ws.send(message);
      } catch {
        clients.delete(ws);
      }
    }
  });
} else {
  console.warn(
    "PRIVATE_KEY or CONTRACT_ADDRESS not set. Blockchain features disabled."
  );
}

// Start the server using Bun.serve
const server = Bun.serve({
  port: config.port,
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/ws") {
      if (server.upgrade(req)) {
        return undefined;
      }
      return new Response("WebSocket upgrade failed", { status: 500 });
    }
    return app.fetch(req, { ip: server.requestIP(req) });
  },
  websocket: {
    message(ws, msg) {
      // Handle incoming messages from clients (e.g., ping/pong)
      if (msg === "ping") {
        ws.send("pong");
      }
    },
    open(ws) {
      clients.add(ws);
      console.log(`WebSocket client connected (total: ${clients.size})`);
    },
    close(ws) {
      clients.delete(ws);
      console.log(`WebSocket client disconnected (total: ${clients.size})`);
    },
  },
});

console.log(`USDC Escrow API running on http://localhost:${server.port}`);
