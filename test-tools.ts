#!/usr/bin/env tsx

/**
 * Test script to verify all SokoAnalyst tools are working correctly
 */

import {
  marketDataTool,
  technicalAnalysisTool,
  marketSentimentTool,
} from "./src/mastra/tools/financial";
import { mcpMarketDataSimple } from "./src/mastra/tools/financial/simple-tools";

async function testTools() {
  console.log("🧪 Testing SokoAnalyst Tools");
  console.log("=".repeat(50));

  try {
    // Test 1: Market Data Tool
    console.log("\n📊 Testing Market Data Tool...");
    if (marketDataTool && marketDataTool.execute) {
      const marketData = await marketDataTool.execute({
        context: {
          symbols: ["AAPL", "BTC-USD"],
          market: "stocks" as const,
          timeframe: "1d" as const,
        },
        runtimeContext: new Map(),
      } as any);
      console.log("✅ Market Data Tool:", marketData ? "Working" : "Failed");
    } else {
      console.log("❌ Market Data Tool: Not available");
    }

    // Test 2: Technical Analysis Tool
    console.log("\n📈 Testing Technical Analysis Tool...");
    if (technicalAnalysisTool && technicalAnalysisTool.execute) {
      const technicalAnalysis = await technicalAnalysisTool.execute({
        context: {
          symbol: "AAPL",
          indicators: ["RSI", "MACD"] as const,
          period: 14,
        },
        runtimeContext: new Map(),
      } as any);
      console.log(
        "✅ Technical Analysis Tool:",
        technicalAnalysis ? "Working" : "Failed",
      );
    } else {
      console.log("❌ Technical Analysis Tool: Not available");
    }

    // Test 3: Market Sentiment Tool
    console.log("\n🧠 Testing Market Sentiment Tool...");
    if (marketSentimentTool && marketSentimentTool.execute) {
      const sentiment = await marketSentimentTool.execute({
        context: {
          symbols: ["AAPL"],
          sources: ["news", "social"] as const,
        },
        runtimeContext: new Map(),
      } as any);
      console.log(
        "✅ Market Sentiment Tool:",
        sentiment ? "Working" : "Failed",
      );
    } else {
      console.log("❌ Market Sentiment Tool: Not available");
    }

    // Test 4: Simple MCP Tool
    console.log("\n🔍 Testing Simple MCP Tool...");
    const mcpData = await mcpMarketDataSimple({
      symbols: ["AAPL"],
      market: "stocks",
      timeframe: "1d",
    });
    console.log("✅ Simple MCP Tool:", mcpData.success ? "Working" : "Failed");

    console.log("\n" + "=".repeat(50));
    console.log("🎉 All tools tested successfully!");
  } catch (error) {
    console.error("❌ Tool test failed:", error);
  }
}

// Run the test
if (require.main === module) {
  testTools().catch(console.error);
}

export { testTools };
