import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import {
  getEscrows,
  getEscrow,
  createEscrow,
  releaseEscrow,
  disputeEscrow,
  resolveDispute,
  claimExpired,
  getStats,
} from "../services/escrow";
import { CreateEscrowRequest } from "../types";

const escrowRoutes = new Hono();

// GET /api/escrows - list escrows with optional filters
escrowRoutes.get("/api/escrows", async (c) => {
  try {
    const stateParam = c.req.query("state");
    const depositor = c.req.query("depositor");
    const beneficiary = c.req.query("beneficiary");

    const filters: {
      state?: number;
      depositor?: string;
      beneficiary?: string;
    } = {};

    if (stateParam !== undefined && stateParam !== null) {
      filters.state = parseInt(stateParam, 10);
    }
    if (depositor) {
      filters.depositor = depositor;
    }
    if (beneficiary) {
      filters.beneficiary = beneficiary;
    }

    const escrows = await getEscrows(filters);
    return c.json({ escrows, count: escrows.length });
  } catch (err: any) {
    console.error("Error listing escrows:", err);
    return c.json({ error: err.message || "Failed to list escrows" }, 500);
  }
});

// GET /api/escrows/:id - get single escrow
escrowRoutes.get("/api/escrows/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id) || id < 0) {
      return c.json({ error: "Invalid escrow ID" }, 400);
    }
    const escrow = await getEscrow(id);
    return c.json(escrow);
  } catch (err: any) {
    console.error("Error getting escrow:", err);
    return c.json({ error: err.message || "Failed to get escrow" }, 500);
  }
});

// POST /api/escrows - create escrow (auth required)
escrowRoutes.post("/api/escrows", authMiddleware, async (c) => {
  try {
    const body = await c.req.json<CreateEscrowRequest>();

    if (!body.beneficiary || !body.amount || !body.description || !body.deadline_hours) {
      return c.json(
        {
          error:
            "Missing required fields: beneficiary, amount, description, deadline_hours",
        },
        400
      );
    }

    const result = await createEscrow(body);
    return c.json(
      {
        message: "Escrow created successfully",
        escrowId: result.escrowId,
        txHash: result.txHash,
      },
      201
    );
  } catch (err: any) {
    console.error("Error creating escrow:", err);
    return c.json({ error: err.message || "Failed to create escrow" }, 500);
  }
});

// POST /api/escrows/:id/release - release escrow (auth required)
escrowRoutes.post("/api/escrows/:id/release", authMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id) || id < 0) {
      return c.json({ error: "Invalid escrow ID" }, 400);
    }
    const result = await releaseEscrow(id);
    return c.json({
      message: "Escrow released successfully",
      txHash: result.txHash,
    });
  } catch (err: any) {
    console.error("Error releasing escrow:", err);
    return c.json({ error: err.message || "Failed to release escrow" }, 500);
  }
});

// POST /api/escrows/:id/dispute - dispute escrow (auth required)
escrowRoutes.post("/api/escrows/:id/dispute", authMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id) || id < 0) {
      return c.json({ error: "Invalid escrow ID" }, 400);
    }
    const result = await disputeEscrow(id);
    return c.json({
      message: "Escrow disputed successfully",
      txHash: result.txHash,
    });
  } catch (err: any) {
    console.error("Error disputing escrow:", err);
    return c.json({ error: err.message || "Failed to dispute escrow" }, 500);
  }
});

// POST /api/escrows/:id/resolve - resolve dispute (auth required)
escrowRoutes.post("/api/escrows/:id/resolve", authMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id) || id < 0) {
      return c.json({ error: "Invalid escrow ID" }, 400);
    }

    const body = await c.req.json<{ release_to_beneficiary: boolean }>();
    if (body.release_to_beneficiary === undefined) {
      return c.json(
        { error: "Missing required field: release_to_beneficiary" },
        400
      );
    }

    const result = await resolveDispute(id, body.release_to_beneficiary);
    return c.json({
      message: "Dispute resolved successfully",
      txHash: result.txHash,
    });
  } catch (err: any) {
    console.error("Error resolving dispute:", err);
    return c.json(
      { error: err.message || "Failed to resolve dispute" },
      500
    );
  }
});

// POST /api/escrows/:id/claim-expired - claim expired escrow (auth required)
escrowRoutes.post("/api/escrows/:id/claim-expired", authMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id) || id < 0) {
      return c.json({ error: "Invalid escrow ID" }, 400);
    }
    const result = await claimExpired(id);
    return c.json({
      message: "Expired escrow claimed",
      txHash: result.txHash,
    });
  } catch (err: any) {
    console.error("Error claiming expired escrow:", err);
    return c.json(
      { error: err.message || "Failed to claim expired escrow" },
      500
    );
  }
});

// GET /api/stats - aggregate stats
escrowRoutes.get("/api/stats", async (c) => {
  try {
    const stats = await getStats();
    return c.json(stats);
  } catch (err: any) {
    console.error("Error getting stats:", err);
    return c.json({ error: err.message || "Failed to get stats" }, 500);
  }
});

export default escrowRoutes;
