#!/usr/bin/env tsx

/**
 * SokoAnalyst Demo Script
 *
 * This script demonstrates how to use the SokoAnalyst agent
 * following the same pattern as the reference repository.
 */

import "dotenv/config";
import { sokoAnalyst } from "../src/mastra/agents/sokoAnalyst-simple";

async function runSokoAnalystDemo() {
  console.log("🚀 SokoAnalyst Demo - Elite Financial Markets Intelligence");
  console.log("=".repeat(60));

  try {
    // Example 1: Market Analysis Query
    console.log("\n📊 Example 1: Market Analysis");
    console.log("-".repeat(30));

    const marketAnalysis = await sokoAnalyst.generate(
      "Analyze the current Bitcoin market conditions and provide actionable trading recommendations for a moderate risk tolerance investor.",
    );

    console.log("Query: Bitcoin market analysis");
    console.log("Response:", marketAnalysis.text);
    console.log("Tool Calls:", marketAnalysis.toolCalls?.length || 0);

    // Example 2: Technical Analysis
    console.log("\n📈 Example 2: Technical Analysis");
    console.log("-".repeat(30));

    const technicalAnalysis = await sokoAnalyst.generate(
      "Perform technical analysis on AAPL stock using RSI, MACD, and Bollinger Bands. What are the key signals?",
    );

    console.log("Query: AAPL technical analysis");
    console.log("Response:", technicalAnalysis.text);

    // Example 3: Portfolio Optimization
    console.log("\n💼 Example 3: Portfolio Analysis");
    console.log("-".repeat(30));

    const portfolioAnalysis = await sokoAnalyst.generate(
      "I have a portfolio with 60% stocks (AAPL, GOOGL, MSFT), 30% crypto (BTC, ETH), and 10% cash. Analyze the risk and suggest optimizations.",
    );

    console.log("Query: Portfolio optimization");
    console.log("Response:", portfolioAnalysis.text);

    // Example 4: Market Sentiment
    console.log("\n🧠 Example 4: Market Sentiment");
    console.log("-".repeat(30));

    const sentimentAnalysis = await sokoAnalyst.generate(
      "What's the current market sentiment for Tesla (TSLA)? Include news analysis and social media sentiment.",
    );

    console.log("Query: TSLA sentiment analysis");
    console.log("Response:", sentimentAnalysis.text);

    // Example 5: Economic Indicators
    console.log("\n🌍 Example 5: Economic Analysis");
    console.log("-".repeat(30));

    const economicAnalysis = await sokoAnalyst.generate(
      "Analyze the latest US economic indicators (GDP, CPI, unemployment) and their impact on the stock market.",
    );

    console.log("Query: Economic indicators analysis");
    console.log("Response:", economicAnalysis.text);
  } catch (error) {
    console.error("❌ Demo failed:", error);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ SokoAnalyst Demo Complete!");
}

// Run the demo
if (require.main === module) {
  runSokoAnalystDemo().catch(console.error);
}

export { runSokoAnalystDemo };
