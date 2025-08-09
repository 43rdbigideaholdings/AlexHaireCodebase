import { Service, type IAgentRuntime } from "@elizaos/core";

/**
 * Optional background service for analytics or relaying.
 * Not wired into the plugin by default; add to `services: [WebchatService]` in index.ts to enable.
 */
export class WebchatService extends Service {
  static serviceType = "WEBCHAT";
  capabilityDescription = "Collects basic analytics for web chat usage.";

  static async start(runtime: IAgentRuntime): Promise<Service> {
    const svc = new WebchatService(runtime);
    // Initialize timers, queues, or external connections here.
    return svc;
  }

  async stop(): Promise<void> {
    // Clean up resources here.
  }
}
