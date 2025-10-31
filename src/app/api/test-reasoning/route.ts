import { NextRequest, NextResponse } from "next/server";
import {
  analyzeMarketWithReasoning,
  getMarketIntelligence,
} from "@/lib/perplexity";

export async function GET(request: NextRequest) {
  try {
    console.log("🧠 Testing Perplexity Sonar-Reasoning integration...");

    const { searchParams } = new URL(request.url);
    const testType = searchParams.get("type") || "basic";
    const symbol = searchParams.get("symbol") || "AAPL";

    switch (testType) {
      case "reasoning":
        console.log(`📊 Testing reasoning analysis for ${symbol}...`);
        try {
          const result = await analyzeMarketWithReasoning(
            [symbol],
            "comprehensive",
          );
          return NextResponse.json({
            success: true,
            testType: "Reasoning Analysis",
            symbol,
            model: result.model,
            contentLength: result.content.length,
            hasContent: !!result.content,
            hasCitations: result.citations.length > 0,
            citationCount: result.citations.length,
            usage: result.usage,
            preview: result.content.substring(0, 200) + "...",
            message: "Perplexity Sonar-Reasoning is working correctly",
          });
        } catch (error) {
          return NextResponse.json(
            {
              success: false,
              testType: "Reasoning Analysis",
              error: "Reasoning analysis failed",
              details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
          );
        }

      case "intelligence":
        console.log("🎯 Testing market intelligence...");
        try {
          const result = await getMarketIntelligence(
            `Current market conditions and outlook for ${symbol}`,
            "research",
          );
          return NextResponse.json({
            success: true,
            testType: "Market Intelligence",
            symbol,
            model: result.model,
            contentLength: result.content.length,
            hasContent: !!result.content,
            hasCitations: result.citations.length > 0,
            citationCount: result.citations.length,
            usage: result.usage,
            preview: result.content.substring(0, 200) + "...",
            message: "Market Intelligence is working correctly",
          });
        } catch (error) {
          return NextResponse.json(
            {
              success: false,
              testType: "Market Intelligence",
              error: "Market intelligence failed",
              details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
          );
        }

      default:
        return NextResponse.json({
          success: true,
          message: "Perplexity Sonar-Reasoning Test Endpoint",
          availableTests: [
            {
              type: "reasoning",
              url: "/api/test-reasoning?type=reasoning&symbol=AAPL",
              description: "Test comprehensive market analysis with reasoning",
            },
            {
              type: "intelligence",
              url: "/api/test-reasoning?type=intelligence&symbol=TSLA",
              description: "Test market intelligence with contextual analysis",
            },
          ],
          usage:
            "Add ?type=reasoning or ?type=intelligence to test specific features",
        });
    }
  } catch (error) {
    console.error("❌ Reasoning test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Reasoning test failed",
        details: error instanceof Error ? error.message : String(error),
        suggestion: "Check PERPLEXITY_API_KEY environment variable",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      analysisType = "comprehensive",
      context = "research",
    } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    console.log(`🧠 Custom reasoning test: ${query}`);

    // Determine if this is a symbol-based analysis or general intelligence
    const symbolMatch = query.match(/\b[A-Z]{1,5}(-USD)?\b/g);

    if (symbolMatch && analysisType !== "general") {
      // Use reasoning analysis for symbol-based queries
      const result = await analyzeMarketWithReasoning(
        symbolMatch,
        analysisType,
      );
      return NextResponse.json({
        success: true,
        testType: "Custom Reasoning Analysis",
        query,
        symbols: symbolMatch,
        analysisType,
        result: {
          model: result.model,
          contentLength: result.content.length,
          citationCount: result.citations.length,
          usage: result.usage,
          content: result.content,
          citations: result.citations,
        },
      });
    } else {
      // Use general market intelligence
      const result = await getMarketIntelligence(query, context);
      return NextResponse.json({
        success: true,
        testType: "Custom Market Intelligence",
        query,
        context,
        result: {
          model: result.model,
          contentLength: result.content.length,
          citationCount: result.citations.length,
          usage: result.usage,
          content: result.content,
          citations: result.citations,
        },
      });
    }
  } catch (error) {
    console.error("❌ Custom reasoning test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Custom reasoning test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
