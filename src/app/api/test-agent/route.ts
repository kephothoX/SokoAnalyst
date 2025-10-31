import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing SokoAnalyst agent...");

    // Try to get the agent directly
    try {
      const agent = await mastra.getAgent("sokoAnalyst");
      if (!agent) {
        return NextResponse.json(
          {
            error: "SokoAnalyst agent not found",
            message: "Agent may not be properly registered",
          },
          { status: 404 },
        );
      }

      console.log("✅ SokoAnalyst agent found");
      console.log("Agent name:", agent.name);
      console.log("Available tools:", Object.keys(agent.tools || {}));
    } catch (agentError) {
      console.error("❌ Error accessing agent:", agentError);

      // Fallback: try to import agent directly
      try {
        const { sokoAnalyst } = await import(
          "@/mastra/agents/sokoAnalyst-simple"
        );
        console.log("✅ SokoAnalyst imported directly");
        console.log("Agent name:", sokoAnalyst.name);
        console.log("Available tools:", Object.keys(sokoAnalyst.tools || {}));

        // Use the directly imported agent for testing
        const agent = sokoAnalyst;
      } catch (importError) {
        return NextResponse.json(
          {
            error: "Failed to access SokoAnalyst agent",
            details:
              importError instanceof Error
                ? importError.message
                : String(importError),
          },
          { status: 500 },
        );
      }
    }

    // Get the agent (either from mastra or direct import)
    let agent;
    try {
      agent = await mastra.getAgent("sokoAnalyst");
    } catch {
      const { sokoAnalyst } = await import(
        "@/mastra/agents/sokoAnalyst-simple"
      );
      agent = sokoAnalyst;
    }

    if (!agent) {
      return NextResponse.json(
        {
          error: "SokoAnalyst agent not available",
        },
        { status: 404 },
      );
    }

    // Try to run the agent with a simple query
    try {
      const result = await agent.generate(
        "Hello, can you introduce yourself as SokoAnalyst and briefly describe your capabilities?",
      );
      console.log("✅ Agent response received");

      return NextResponse.json({
        success: true,
        agent: {
          name: agent.name,
          tools: Object.keys(agent.tools || {}),
          toolCount: Object.keys(agent.tools || {}).length,
        },
        response: result,
        message: "SokoAnalyst is working correctly",
      });
    } catch (modelError) {
      console.error("❌ Model execution error:", modelError);
      return NextResponse.json(
        {
          success: false,
          agent: {
            name: agent.name,
            tools: Object.keys(agent.tools || {}),
            toolCount: Object.keys(agent.tools || {}).length,
          },
          error: "Model execution failed",
          details:
            modelError instanceof Error
              ? modelError.message
              : String(modelError),
          suggestion:
            "Check if Ollama is running at the configured endpoint or verify model availability",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("❌ Agent test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Agent test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
