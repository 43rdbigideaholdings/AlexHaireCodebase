import type { Plugin } from "@elizaos/core";
import { routes } from "./routes";

const sexyFishPlugin: Plugin = {
  name: "@yourscope/sexyfish",
  description: "Expose web chat endpoints (session, send, history) for site UIs via Eliza Sessions API.",
  routes
  // You can also add `services: [WebchatService]` and `events: { ... }` here later.
};

export default sexyFishPlugin;
