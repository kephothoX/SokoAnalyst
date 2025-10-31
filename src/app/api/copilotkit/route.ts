import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { MastraAgent } from "@ag-ui/mastra";
import { NextRequest } from "next/server";
import { mastra } from "@/mastra";

// 1. You can use any service adapter here for multi-agent support.
const serviceAdapter = new ExperimentalEmptyAdapter();

// 2. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
  try {
    console.log("🔍 CopilotKit API called");

    // Log request details for debugging
    const url = new URL(req.url);
    console.log("📍 Request URL:", url.pathname);

    // 3. Create the CopilotRuntime instance and utilize the Mastra AG-UI
    //    integration to get the remote agents. Cache this for performance.
    const agents = MastraAgent.getLocalAgents({ mastra });
    console.log("🤖 Available agents:", Object.keys(agents));

    // Log agent tools for debugging
    if (agents.sokoAnalyst) {
      console.log("🛠️ SokoAnalyst agent found");
      // Note: tools property may not be directly accessible in this context
    }

    const runtime = new CopilotRuntime({
      agents,
    });

    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });

    console.log("✅ CopilotKit runtime configured successfully");

    // Add response logging
    const response = await handleRequest(req);
    console.log("📤 CopilotKit response status:", response.status);

    return response;
  } catch (error) {
    console.error("❌ CopilotKit API error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
