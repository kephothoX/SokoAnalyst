import { NextRequest, NextResponse } from "next/server";
import { mcpMarketDataSimple } from "@/mastra/tools/financial/simple-tools";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbols, market = "mixed", timeframe = "1d" } = body;

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json(
        { success: false, error: "Symbols array is required" },
        { status: 400 },
      );
    }

    // Use the MCP market data tool with Perplexity integration
    const result = await mcpMarketDataSimple({
      symbols,
      market: market === "mixed" ? "stocks" : market, // Default to stocks for mixed
      timeframe,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Market data API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
