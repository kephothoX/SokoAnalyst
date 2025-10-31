import { NextRequest, NextResponse } from "next/server";
import { sokoAnalyst } from "@/mastra/agents/sokoAnalyst-simple";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Execute the SokoAnalyst agent with the query
    try {
      const result = await sokoAnalyst.generate(query, {
        context: context || {},
      });

      return NextResponse.json({
        success: true,
        response: result.text || result,
        toolCalls: result.toolCalls || [],
        timestamp: Date.now(),
        agent: "SokoAnalyst",
      });
    } catch (agentError) {
      console.error("Agent execution error:", agentError);

      // Provide a mock response for testing
      const mockResponse = `## Bitcoin Market Sentiment Analysis

**Executive Summary:**
Based on current market conditions, Bitcoin is showing mixed sentiment with cautious optimism from institutional investors.

**Key Insights:**
- Technical indicators suggest consolidation phase
- On-chain metrics show steady accumulation
- Regulatory clarity improving in major markets
- Institutional adoption continues to grow

**Recommendations:**
- **Action:** Hold with selective accumulation on dips
- **Risk Level:** Medium
- **Timeframe:** 3-6 months
- **Target Range:** $45,000 - $52,000

**Risk Assessment:**
- **Overall Risk:** Medium
- **Key Risks:** Regulatory changes, macro economic shifts
- **Mitigation:** Diversification, position sizing

*Note: This is a mock response for testing purposes.*`;

      return NextResponse.json({
        success: true,
        response: mockResponse,
        toolCalls: [],
        timestamp: Date.now(),
        agent: "SokoAnalyst",
        mock: true,
      });
    }
  } catch (error) {
    console.error("SokoAnalyst agent error:", error);
    return NextResponse.json(
      {
        error: "Failed to process agent request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "status") {
      return NextResponse.json({
        success: true,
        agent: "SokoAnalyst",
        status: "active",
        capabilities: [
          "Real-time market data analysis",
          "Technical indicator calculations",
          "Market sentiment analysis",
          "Portfolio optimization",
          "Risk management assessment",
          "Economic indicator tracking",
          "Cross-asset correlation analysis",
          "Blockchain and DeFi analytics",
        ],
        tools: [
          "mcpMarketDataTool",
          "mcpMarketNewsTool",
          "mcpEconomicIndicatorsTool",
          "technicalAnalysisTool",
          "marketSentimentTool",
          "portfolioAnalysisTool",
          "advancedMarketAnalysisTool",
          "blockchainAnalyticsTool",
          "riskManagementTool",
          "globalMarketsMonitorTool",
        ],
        timestamp: Date.now(),
      });
    }

    return NextResponse.json(
      { error: "Invalid action parameter" },
      { status: 400 },
    );
  } catch (error) {
    console.error("SokoAnalyst status error:", error);
    return NextResponse.json(
      { error: "Failed to get agent status" },
      { status: 500 },
    );
  }
}
