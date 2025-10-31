import { NextRequest, NextResponse } from "next/server";
import { sokoAnalyst } from "@/mastra/agents/sokoAnalyst-simple";

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing SokoAnalyst tools directly...");

    const { searchParams } = new URL(request.url);
    const toolName = searchParams.get("tool") || "marketDataTool";
    const symbols = searchParams.get("symbols")?.split(",") || ["AAPL"];

    console.log(
      `🛠️ Testing tool: ${toolName} with symbols: ${symbols.join(", ")}`,
    );

    const tools = sokoAnalyst.tools as any;
    const tool = tools?.[toolName];
    if (!tool || !tool.execute) {
      return NextResponse.json(
        {
          error: `Tool '${toolName}' not found or not executable`,
          availableTools: Object.keys(tools || {}),
        },
        { status: 404 },
      );
    }

    // Test different tools with appropriate parameters
    let testParams: any = {};

    switch (toolName) {
      case "marketDataTool":
        testParams = {
          context: {
            symbols,
            market: "stocks",
            timeframe: "1d",
          },
          runtimeContext: new Map(),
        };
        break;

      case "perplexity_reasoning_analysis":
        testParams = {
          context: {
            symbols,
            analysisType: "comprehensive",
          },
          runtimeContext: new Map(),
        };
        break;

      case "market_intelligence":
        testParams = {
          context: {
            query: `Current market analysis for ${symbols.join(", ")}`,
            context: "research",
          },
          runtimeContext: new Map(),
        };
        break;

      case "technicalAnalysisTool":
        testParams = {
          context: {
            symbol: symbols[0],
            indicators: ["RSI", "MACD"],
            period: 14,
          },
          runtimeContext: new Map(),
        };
        break;

      default:
        testParams = {
          context: { symbols },
          runtimeContext: new Map(),
        };
    }

    console.log(
      `⚡ Executing ${toolName} with params:`,
      JSON.stringify(testParams.context, null, 2),
    );

    const startTime = Date.now();
    const result = await tool.execute(testParams as any);
    const executionTime = Date.now() - startTime;

    console.log(`✅ Tool execution completed in ${executionTime}ms`);
    console.log(
      `📊 Result type: ${typeof result}, success: ${(result as any)?.success}`,
    );

    return NextResponse.json({
      success: true,
      toolName,
      executionTime: `${executionTime}ms`,
      result,
      testParams: testParams.context,
      message: `Tool '${toolName}' executed successfully`,
    });
  } catch (error) {
    console.error("❌ Tool test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Tool test failed",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolName, params } = body;

    if (!toolName) {
      return NextResponse.json(
        { error: "toolName is required" },
        { status: 400 },
      );
    }

    console.log(`🧪 Custom tool test: ${toolName}`);

    const tools = sokoAnalyst.tools as any;
    const tool = tools?.[toolName];
    if (!tool || !tool.execute) {
      return NextResponse.json(
        {
          error: `Tool '${toolName}' not found or not executable`,
          availableTools: Object.keys(tools || {}),
        },
        { status: 404 },
      );
    }

    const testParams = {
      context: params,
      runtimeContext: new Map(),
    };

    console.log(
      `⚡ Executing ${toolName} with custom params:`,
      JSON.stringify(params, null, 2),
    );

    const startTime = Date.now();
    const result = await tool.execute(testParams as any);
    const executionTime = Date.now() - startTime;

    console.log(`✅ Custom tool execution completed in ${executionTime}ms`);

    return NextResponse.json({
      success: true,
      toolName,
      executionTime: `${executionTime}ms`,
      result,
      testParams: params,
      message: `Custom tool '${toolName}' executed successfully`,
    });
  } catch (error) {
    console.error("❌ Custom tool test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Custom tool test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
