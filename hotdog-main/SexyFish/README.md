# @yourscope/sexyfish

**SexyFish** is an ElizaOS plugin that exposes **web chat endpoints** for your site to talk to an Eliza agent via the built‑in Sessions API.  
It proxies three routes:

- `POST /webchat/session` – create a session (`agentId`, `userId`, optional `metadata`)
- `POST /webchat/send` – send a message (`sessionId`, `content`, optional `attachments`, `metadata`)
- `GET  /webchat/history/:sessionId` – get message history

It relies on your Eliza server (default `http://localhost:3000`) and uses the existing Socket.IO channel for real‑time updates.

## Install (local file)
```bash
# from your Eliza project root
bun add file:../SexyFish
# or with npm:
npm install ../SexyFish
```

## Build
```bash
cd SexyFish
npm install
npm run build
```

## Register the plugin
Add `@yourscope/sexyfish` to your project or character config (plugins list). Example:

```json
{
  "plugins": ["@yourscope/sexyfish"]
}
```

Make sure your Eliza server is running. If it's not at `http://localhost:3000`, set:
```bash
export ELIZA_URL="https://your-eliza.example.com"
```

## Test the routes

**Create session**
```bash
curl -s -X POST $ELIZA_URL/webchat/session \
  -H 'Content-Type: application/json' \
  -d '{"agentId":"<AGENT_ID>","userId":"web-user-1","metadata":{"platform":"web"}}'
```

**Send message**
```bash
curl -s -X POST $ELIZA_URL/webchat/send \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"<SESSION_ID>","content":"Hello from SexyFish!"}'
```

**Get history**
```bash
curl -s $ELIZA_URL/webchat/history/<SESSION_ID>
```

## Frontend quick start (fetch + Socket.IO)
```ts
const API_BASE = "/webchat";
const ELIZA_URL = process.env.NEXT_PUBLIC_ELIZA_URL ?? "http://localhost:3000";

export async function createSession(agentId: string, userId: string) {
  const r = await fetch(`${API_BASE}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentId, userId, metadata: { platform: "web" } })
  });
  return r.json();
}

export async function sendMessage(sessionId: string, content: string) {
  const r = await fetch(`${API_BASE}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, content })
  });
  return r.json();
}

// Real-time (Socket.IO)
import { io } from "socket.io-client";
export function connectRealtime(sessionId: string, agentId: string, onMsg: (m:any)=>void) {
  const socket = io(ELIZA_URL);
  socket.emit("join", { roomId: sessionId, agentId });
  socket.on("messageBroadcast", onMsg);
  return () => socket.disconnect();
}
```

## Notes
- If your site is on a different origin than the Eliza server, use a proxy route in your app or enable CORS on the Eliza server.
- For production, consider setting `public: false` on routes and enforcing auth (bearer token/cookie) in `handler`.
- Attachments are supported via the `attachments` array in `/webchat/send` payload.

MIT © You
