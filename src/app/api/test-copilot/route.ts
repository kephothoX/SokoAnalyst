import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";

export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Testing CopilotKit integration...");

    // Test if Mastra is properly configured
    const agents = mastra.getAgents();
    console.log("🤖 Available agents:", Object.keys(agents));

    // Test if sokoAnalyst agent exists
    const sokoAgent = agents.sokoAnalyst;
    if (!sokoAgent) {
      return NextResponse.json(
        {
          error: "SokoAnalyst agent not found",
          availableAgents: Object.keys(agents),
        },
        { status: 500 },
      );
    }

    console.log("✅ SokoAnalyst agent found");
    console.log("🛠️ Agent tools:", Object.keys(sokoAgent.tools || {}));

    // Test a simple agent call
    try {
      console.log("🔍 Testing agent generation...");

      const testResult = await sokoAgent.generateVNext(
        "Hello, provide a brief market overview for AAPL and TSLA.",
      );

      console.log("✅ Agent generation result:", {
        hasText: !!testResult.text,
        textLength: testResult.text?.length || 0,
        textPreview: testResult.text?.substring(0, 100) || "No text",
        fullResult: testResult,
      });

      return NextResponse.json({
        success: true,
        message: "CopilotKit integration test successful",
        agentResponse: testResult.text || "No response generated",
        agentResponseLength: testResult.text?.length || 0,
        fullResult: testResult,
        availableAgents: Object.keys(agents),
        agentTools: Object.keys(sokoAgent.tools || {}),
        timestamp: new Date().toISOString(),
      });
    } catch (agentError) {
      console.error("❌ Agent test failed:", agentError);
      console.error("❌ Error details:", {
        name: agentError instanceof Error ? agentError.name : "Unknown",
        message:
          agentError instanceof Error ? agentError.message : String(agentError),
        stack: agentError instanceof Error ? agentError.stack : "No stack",
      });

      // Return a mock response for testing dashboard functionality
      const mockResponse = `## Market Overview - AAPL & TSLA

**Executive Summary:**
Current market conditions show mixed signals with AAPL demonstrating resilience in the tech sector while TSLA faces volatility from EV market dynamics.

**Key Insights:**
• AAPL: Strong fundamentals with services revenue growth, trading near resistance levels
• TSLA: High volatility due to production updates and competitive EV landscape
• Market sentiment: Cautiously optimistic with focus on earnings quality
• Risk factors: Interest rate sensitivity and sector rotation patterns

**Actionable Recommendations:**
• AAPL: Consider position sizing around $175-180 support levels
• TSLA: Monitor $200 psychological level for breakout confirmation
• Portfolio allocation: Maintain diversification across growth and value sectors
• Risk management: Implement stop-loss strategies given current volatility

*Analysis powered by SokoAnalyst AI reasoning with institutional-grade insights.*`;

      return NextResponse.json(
        {
          success: true,
          message:
            "CopilotKit integration test (mock response due to connection issue)",
          agentResponse: mockResponse,
          agentResponseLength: mockResponse.length,
          connectionError:
            agentError instanceof Error
              ? agentError.message
              : String(agentError),
          availableAgents: Object.keys(agents),
          agentTools: Object.keys(sokoAgent.tools || {}),
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("❌ CopilotKit test failed:", error);
    return NextResponse.json(
      {
        error: "CopilotKit test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🔍 Testing CopilotKit POST with message:", body.message);

    const agents = mastra.getAgents();
    const sokoAgent = agents.sokoAnalyst;

    if (!sokoAgent) {
      return NextResponse.json(
        {
          error: "SokoAnalyst agent not found",
        },
        { status: 500 },
      );
    }

    // Test agent with user message
    const result = await sokoAgent.generateVNext(
      body.message || "Provide a brief market overview",
    );

    return NextResponse.json({
      success: true,
      response: result.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ CopilotKit POST test failed:", error);
    return NextResponse.json(
      {
        error: "POST test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
