import type { IAgentRuntime, Route } from "@elizaos/core";

const ELIZA_BASE_URL = process.env.ELIZA_URL ?? "http://localhost:3000";

async function passThrough(res: any, r: Response) {
  // Try to forward status + JSON cleanly even if the host framework differs.
  const ct = r.headers.get("content-type") || "";
  const body = ct.includes("application/json") ? await r.json().catch(() => ({})) : await r.text();
  if (typeof res.status === "function" && typeof res.json === "function") {
    if (typeof body === "string") {
      res.status(r.status).send(body);
    } else {
      res.status(r.status).json(body);
    }
  } else if (typeof res.json === "function") {
    res.json({ status: r.status, body });
  } else if (typeof res.send === "function") {
    res.send(typeof body === "string" ? body : JSON.stringify(body));
  }
}

export const routes: Route[] = [
  {
    name: "webchat-create-session",
    type: "POST",
    path: "/webchat/session",
    public: true,
    handler: async (req: any, res: any, _runtime: IAgentRuntime) => {
      const { agentId, userId, metadata } = await (typeof req.json === "function" ? req.json() : Promise.resolve({}));
      const r = await fetch(`${ELIZA_BASE_URL}/api/messaging/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, userId, metadata })
      });
      await passThrough(res, r);
    }
  },
  {
    name: "webchat-send",
    type: "POST",
    path: "/webchat/send",
    public: true,
    handler: async (req: any, res: any, _runtime: IAgentRuntime) => {
      const { sessionId, content, attachments, metadata } = await (typeof req.json === "function" ? req.json() : Promise.resolve({}));
      const r = await fetch(`${ELIZA_BASE_URL}/api/messaging/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, attachments, metadata })
      });
      await passThrough(res, r);
    }
  },
  {
    name: "webchat-history",
    type: "GET",
    path: "/webchat/history/:sessionId",
    public: true,
    handler: async (req: any, res: any, _runtime: IAgentRuntime) => {
      const sessionId = req?.params?.sessionId ?? (req?.query?.sessionId ?? "");
      const r = await fetch(`${ELIZA_BASE_URL}/api/messaging/sessions/${sessionId}/messages`, {
        method: "GET"
      });
      await passThrough(res, r);
    }
  }
];
