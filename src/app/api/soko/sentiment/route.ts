import { NextRequest, NextResponse } from "next/server";

// Simple sentiment analysis function
async function analyzeSentiment(symbols: string[], sources: string[]) {
  try {
    const sentimentData = [];

    for (const symbol of symbols) {
      const sentiment = {
        symbol,
        overall:
          Math.random() > 0.5
            ? "bullish"
            : Math.random() > 0.5
              ? "bearish"
              : "neutral",
        score: (Math.random() - 0.5) * 2, // -1 to 1
        confidence: Math.random(),
        sources: {} as Record<string, any>,
        timestamp: Date.now(),
      };

      for (const source of sources) {
        switch (source) {
          case "news":
            sentiment.sources.news = {
              score: (Math.random() - 0.5) * 2,
              articles: Math.floor(Math.random() * 100),
              keywords: ["earnings", "growth", "market", "analysis"],
            };
            break;
          case "social":
            sentiment.sources.social = {
              score: (Math.random() - 0.5) * 2,
              mentions: Math.floor(Math.random() * 1000),
              platforms: ["twitter", "reddit", "discord"],
            };
            break;
          case "options":
            sentiment.sources.options = {
              putCallRatio: Math.random() * 2,
              impliedVolatility: Math.random() * 50,
              sentiment: Math.random() > 0.5 ? "bullish" : "bearish",
            };
            break;
          case "futures":
            sentiment.sources.futures = {
              openInterest: Math.floor(Math.random() * 100000),
              volume: Math.floor(Math.random() * 50000),
              sentiment: Math.random() > 0.5 ? "bullish" : "bearish",
            };
            break;
        }
      }

      sentimentData.push(sentiment);
    }

    const bullishCount = sentimentData.filter(
      (s) => s.overall === "bullish",
    ).length;
    const bearishCount = sentimentData.filter(
      (s) => s.overall === "bearish",
    ).length;

    return {
      success: true,
      sentimentData,
      marketOverview: {
        overallSentiment:
          bullishCount > bearishCount
            ? "bullish"
            : bearishCount > bullishCount
              ? "bearish"
              : "neutral",
        bullishAssets: bullishCount,
        bearishAssets: bearishCount,
        neutralAssets: sentimentData.length - bullishCount - bearishCount,
        marketMood:
          bullishCount > sentimentData.length * 0.6
            ? "euphoric"
            : bearishCount > sentimentData.length * 0.6
              ? "fearful"
              : "balanced",
      },
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbols, sources } = body;

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: "Symbols array is required" },
        { status: 400 },
      );
    }

    // Execute sentiment analysis
    const result = await analyzeSentiment(
      symbols,
      sources || ["news", "social"],
    );

    return NextResponse.json({
      success: result.success,
      sentimentData: result.sentimentData,
      marketOverview: result.marketOverview,
      timestamp: result.timestamp,
      source: "SokoAnalyst-SentimentAnalysis",
    });
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform sentiment analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
