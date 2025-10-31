import { NextRequest, NextResponse } from "next/server";

// Simple portfolio analysis function
async function analyzePortfolio(holdings: any[], benchmarks: string[]) {
  try {
    const portfolioValue = holdings.reduce((total: number, holding: any) => {
      const currentPrice = Math.random() * 1000 + 50;
      return total + holding.quantity * currentPrice;
    }, 0);

    const totalCost = holdings.reduce((total: number, holding: any) => {
      return total + holding.quantity * holding.avgCost;
    }, 0);

    const analysis = {
      totalValue: portfolioValue,
      totalCost,
      totalReturn: portfolioValue - totalCost,
      totalReturnPercent: ((portfolioValue - totalCost) / totalCost) * 100,
      holdings: holdings.map((holding: any) => {
        const currentPrice = Math.random() * 1000 + 50;
        const value = holding.quantity * currentPrice;
        const cost = holding.quantity * holding.avgCost;
        return {
          ...holding,
          currentPrice,
          value,
          cost,
          return: value - cost,
          returnPercent: ((value - cost) / cost) * 100,
          weight: (value / portfolioValue) * 100,
        };
      }),
      riskMetrics: {
        volatility: Math.random() * 30,
        sharpeRatio: Math.random() * 3,
        maxDrawdown: Math.random() * 20,
        beta: Math.random() * 2,
      },
    };

    return {
      success: true,
      analysis,
      benchmarkComparison: benchmarks.map((benchmark) => ({
        symbol: benchmark,
        return: (Math.random() - 0.5) * 20,
        volatility: Math.random() * 25,
        correlation: Math.random(),
      })),
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
    const { holdings, benchmarks } = body;

    if (!holdings || !Array.isArray(holdings)) {
      return NextResponse.json(
        { error: "Holdings array is required" },
        { status: 400 },
      );
    }

    // Execute portfolio analysis
    const result = await analyzePortfolio(
      holdings,
      benchmarks || ["SPY", "BTC-USD"],
    );

    return NextResponse.json({
      success: result.success,
      analysis: result.analysis,
      benchmarkComparison: result.benchmarkComparison,
      timestamp: Date.now(),
      source: "SokoAnalyst-PortfolioAnalysis",
    });
  } catch (error) {
    console.error("Portfolio analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform portfolio analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
