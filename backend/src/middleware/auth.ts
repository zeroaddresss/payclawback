import { Context, Next } from "hono";
import { config } from "../config";

export async function authMiddleware(c: Context, next: Next) {
  const apiKey = c.req.header("X-API-Key") || c.req.query("api_key");
  if (apiKey !== config.apiKey) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
}
