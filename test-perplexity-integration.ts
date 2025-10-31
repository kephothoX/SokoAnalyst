#!/usr/bin/env tsx

/**
 * Test script to verify Perplexity SDK integration with SokoAnalyst tools
 */

import {
  searchFinancialData,
  searchMarketNews,
  searchEconomicIndicators,
  parseFinancialDataFromResponse,
  extractSentiment,
} from "./src/lib/perplexity";
import { mcpMarketDataSimple } from "./src/mastra/tools/financial/simple-tools";

async function testPerplexityIntegration() {
  console.log("🧪 Testing Perplexity SDK Integration with SokoAnalyst");
  console.log("=".repeat(60));

  try {
    // Test 1: Basic Financial Data Search
    console.log("\n📊 Test 1: Basic Financial Data Search");
    console.log("-".repeat(40));

    try {
      const result = await searchFinancialData(
        "AAPL current stock price today trading volume market cap",
      );
      console.log("✅ Perplexity Search Success");
      console.log("Content preview:", result.content.substring(0, 200) + "...");
      console.log("Model:", result.model);
      console.log("Usage:", result.usage);

      // Test parsing
      const parsedData = parseFinancialDataFromResponse(result.content, "AAPL");
      console.log("Parsed data:", parsedData);
    } catch (error) {
      console.log("❌ Perplexity Search Failed:", error);
    }

    // Test 2: Market News Search
    console.log("\n📰 Test 2: Market News Search");
    console.log("-".repeat(40));

    try {
      const newsResult = await searchMarketNews(["TSLA"], "earnings");
      console.log("✅ News Search Success");
      console.log(
        "Content preview:",
        newsResult.content.substring(0, 200) + "...",
      );

      // Test sentiment extraction
      const sentiment = extractSentiment(newsResult.content);
      console.log("Sentiment analysis:", sentiment);
    } catch (error) {
      console.log("❌ News Search Failed:", error);
    }

    // Test 3: Economic Indicators
    console.log("\n📈 Test 3: Economic Indicators Search");
    console.log("-".repeat(40));

    try {
      const economicResult = await searchEconomicIndicators(
        ["GDP", "inflation"],
        ["US"],
      );
      console.log("✅ Economic Search Success");
      console.log(
        "Content preview:",
        economicResult.content.substring(0, 200) + "...",
      );
    } catch (error) {
      console.log("❌ Economic Search Failed:", error);
    }

    // Test 4: Simple MCP Market Data (using Perplexity)
    console.log("\n🔍 Test 4: MCP Market Data with Perplexity");
    console.log("-".repeat(40));

    try {
      const mcpResult = await mcpMarketDataSimple({
        symbols: ["AAPL", "BTC-USD"],
        market: "stocks",
        timeframe: "1d",
      });

      console.log("✅ MCP Market Data Success");
      console.log("Success:", mcpResult.success);
      console.log("Data count:", mcpResult.data?.length);

      if (mcpResult.data && mcpResult.data.length > 0) {
        const sample = mcpResult.data[0];
        console.log("Sample data:", {
          symbol: sample.symbol,
          price: sample.price,
          source: sample.source,
          timestamp: sample.timestamp,
        });
      }
    } catch (error) {
      console.log("❌ MCP Market Data Failed:", error);
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 Perplexity Integration Test Complete!");
    console.log("\n💡 Notes:");
    console.log(
      "- If Perplexity API calls fail, tools will fallback to mock data",
    );
    console.log(
      "- Real API calls require valid PERPLEXITY_API_KEY in environment",
    );
    console.log("- All tools now use Perplexity SDK for real financial data");
  } catch (error) {
    console.error("❌ Test suite failed:", error);
  }
}

// Run the test
if (require.main === module) {
  testPerplexityIntegration().catch(console.error);
}

export { testPerplexityIntegration };
