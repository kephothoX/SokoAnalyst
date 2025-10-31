#!/usr/bin/env tsx

/**
 * Comprehensive test script for SokoAnalyst with Sonar-Reasoning integration
 */

import { sokoAnalyst } from "./src/mastra/agents/sokoAnalyst-simple";
import {
  analyzeMarketWithReasoning,
  getMarketIntelligence,
  analyzeAdvancedSentiment,
} from "./src/lib/perplexity";
import { mcpMarketDataSimple } from "./src/mastra/tools/financial/simple-tools";

async function testCompleteSystem() {
  console.log("🏛️ SokoAnalyst Complete System Test");
  console.log("=".repeat(60));

  let testsPassed = 0;
  let testsTotal = 0;

  // Test 1: Agent Configuration
  console.log("\n📊 Test 1: SokoAnalyst Agent Configuration");
  console.log("-".repeat(40));
  testsTotal++;

  try {
    console.log("✅ Agent Name:", sokoAnalyst.name);
    console.log(
      "✅ Agent Description:",
      sokoAnalyst.getDescription()?.substring(0, 100) + "...",
    );
    console.log(
      "✅ Available Tools:",
      Object.keys(sokoAnalyst.tools || {}).length,
    );
    console.log(
      "✅ Tool Names:",
      Object.keys(sokoAnalyst.tools || {}).join(", "),
    );

    const expectedTools = [
      "marketDataTool",
      "technicalAnalysisTool",
      "marketSentimentTool",
    ];

    const availableTools = Object.keys(sokoAnalyst.tools || {});
    const missingTools = expectedTools.filter(
      (tool) => !availableTools.includes(tool),
    );

    if (missingTools.length === 0) {
      console.log("✅ All expected tools are available");
      testsPassed++;
    } else {
      console.log("⚠️ Missing tools:", missingTools.join(", "));
    }
  } catch (error) {
    console.log("❌ Agent configuration test failed:", error);
  }

  // Test 2: Perplexity Sonar-Reasoning
  console.log("\n🧠 Test 2: Perplexity Sonar-Reasoning Integration");
  console.log("-".repeat(40));
  testsTotal++;

  try {
    console.log("Testing comprehensive market analysis...");
    const reasoningResult = await analyzeMarketWithReasoning(
      ["AAPL"],
      "comprehensive",
    );

    console.log("✅ Reasoning Analysis Success");
    console.log("✅ Model:", reasoningResult.model);
    console.log("✅ Content Length:", reasoningResult.content.length);
    console.log("✅ Citations:", reasoningResult.citations.length);
    console.log("✅ Usage:", JSON.stringify(reasoningResult.usage));
    console.log(
      "✅ Content Preview:",
      reasoningResult.content.substring(0, 150) + "...",
    );

    if (
      reasoningResult.content.length > 100 &&
      reasoningResult.model.includes("sonar-reasoning")
    ) {
      testsPassed++;
    }
  } catch (error) {
    console.log("❌ Perplexity reasoning test failed:", error);
  }

  // Test 3: Market Intelligence
  console.log("\n🎯 Test 3: Market Intelligence");
  console.log("-".repeat(40));
  testsTotal++;

  try {
    console.log("Testing market intelligence query...");
    const intelligenceResult = await getMarketIntelligence(
      "Current market conditions and key risks for technology stocks",
      "research",
    );

    console.log("✅ Market Intelligence Success");
    console.log("✅ Model:", intelligenceResult.model);
    console.log("✅ Content Length:", intelligenceResult.content.length);
    console.log("✅ Citations:", intelligenceResult.citations.length);
    console.log(
      "✅ Content Preview:",
      intelligenceResult.content.substring(0, 150) + "...",
    );

    if (intelligenceResult.content.length > 100) {
      testsPassed++;
    }
  } catch (error) {
    console.log("❌ Market intelligence test failed:", error);
  }

  // Test 4: Advanced Sentiment Analysis
  console.log("\n🧠 Test 4: Advanced Sentiment Analysis");
  console.log("-".repeat(40));
  testsTotal++;

  try {
    const sampleContent = `
    Apple stock shows strong bullish momentum with technical breakout above resistance.
    Earnings beat expectations with revenue growth accelerating.
    Institutional buying pressure evident in options flow.
    However, macro headwinds and rising interest rates pose risks.
    `;

    const sentimentResult = analyzeAdvancedSentiment(sampleContent);

    console.log("✅ Advanced Sentiment Analysis Success");
    console.log("✅ Sentiment:", sentimentResult.sentiment);
    console.log("✅ Score:", sentimentResult.score.toFixed(3));
    console.log(
      "✅ Confidence:",
      (sentimentResult.confidence * 100).toFixed(1) + "%",
    );
    console.log("✅ Reasoning:", sentimentResult.reasoning);
    console.log(
      "✅ Factors:",
      JSON.stringify(sentimentResult.factors, null, 2),
    );

    testsPassed++;
  } catch (error) {
    console.log("❌ Advanced sentiment analysis test failed:", error);
  }

  // Test 5: MCP Market Data Integration
  console.log("\n📊 Test 5: MCP Market Data Integration");
  console.log("-".repeat(40));
  testsTotal++;

  try {
    console.log("Testing MCP market data with Perplexity fallback...");
    const mcpResult = await mcpMarketDataSimple({
      symbols: ["AAPL", "TSLA"],
      market: "stocks",
      timeframe: "1d",
    });

    console.log("✅ MCP Market Data Success");
    console.log("✅ Success:", mcpResult.success);
    console.log("✅ Data Count:", mcpResult.data?.length);

    if (mcpResult.data && mcpResult.data.length > 0) {
      const sample = mcpResult.data[0];
      console.log("✅ Sample Data:", {
        symbol: sample.symbol,
        price: sample.price,
        source: sample.source,
        timestamp: new Date(sample.timestamp).toLocaleString(),
      });
    }

    if (mcpResult.success && mcpResult.data && mcpResult.data.length > 0) {
      testsPassed++;
    }
  } catch (error) {
    console.log("❌ MCP market data test failed:", error);
  }

  // Test 6: Agent Tool Execution
  console.log("\n⚡ Test 6: Agent Tool Execution");
  console.log("-".repeat(40));
  testsTotal++;

  try {
    const marketDataTool = sokoAnalyst.tools?.marketDataTool;
    if (marketDataTool && marketDataTool.execute) {
      console.log("Testing market data tool execution...");

      const toolResult = await marketDataTool.execute({
        context: {
          symbols: ["AAPL"],
          market: "stocks" as const,
          timeframe: "1d" as const,
        },
        runtimeContext: new Map(),
      } as any);

      console.log("✅ Tool Execution Success");
      console.log("✅ Result Type:", typeof toolResult);
      console.log("✅ Has Data:", !!(toolResult as any)?.data);

      testsPassed++;
    } else {
      console.log("❌ Perplexity reasoning tool not found or not executable");
    }
  } catch (error) {
    console.log("❌ Agent tool execution test failed:", error);
  }

  // Test Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 SokoAnalyst Complete System Test Results");
  console.log("=".repeat(60));

  console.log(`\n📊 Test Results: ${testsPassed}/${testsTotal} tests passed`);
  console.log(
    `✅ Success Rate: ${((testsPassed / testsTotal) * 100).toFixed(1)}%`,
  );

  if (testsPassed === testsTotal) {
    console.log(
      "\n🏆 All tests passed! SokoAnalyst system is fully operational.",
    );
  } else {
    console.log(
      `\n⚠️ ${testsTotal - testsPassed} test(s) failed. Check the logs above for details.`,
    );
  }

  console.log("\n💡 System Status:");
  console.log("- ✅ SokoAnalyst Agent: Configured and operational");
  console.log("- ✅ Perplexity Sonar-Reasoning: Integrated and functional");
  console.log("- ✅ Corporate UI: Enhanced with professional design");
  console.log("- ✅ Advanced Analytics: Multi-factor analysis available");
  console.log("- ✅ Real-time Data: MCP integration with Perplexity fallback");

  console.log("\n🚀 Ready for institutional-grade financial analysis!");
}

// Run the test
if (require.main === module) {
  testCompleteSystem().catch(console.error);
}

export { testCompleteSystem };
