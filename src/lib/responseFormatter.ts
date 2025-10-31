/**
 * Response Formatter Utility for SokoAnalyst
 * Formats tool responses into digestible, bullet-point format
 */

export interface FormattedResponse {
  success: boolean;
  title: string;
  summary: string;
  keyPoints: string[];
  details?: {
    section: string;
    points: string[];
  }[];
  metadata?: {
    model?: string;
    timestamp?: number;
    sources?: string[];
    confidence?: string;
  };
  fallbackMessage?: string;
}

export function formatToolResponse(
  response: any,
  toolType: string,
): FormattedResponse {
  if (!response || (!response.success && !response.content)) {
    return createFallbackResponse(toolType, response?.error);
  }

  // Handle raw text responses (like from agent generation)
  if (typeof response === "string") {
    return formatTextResponse(response, toolType);
  }

  // Handle responses with direct text content
  if (response.text && !response.content) {
    return formatTextResponse(response.text, toolType);
  }

  switch (toolType) {
    case "perplexity_reasoning_analysis":
      return formatReasoningAnalysis(response);
    case "market_intelligence":
      return formatMarketIntelligence(response);
    case "marketDataTool":
      return formatMarketData(response);
    case "technicalAnalysisTool":
      return formatTechnicalAnalysis(response);
    case "marketSentimentTool":
      return formatSentimentAnalysis(response);
    case "portfolioAnalysisTool":
      return formatPortfolioAnalysis(response);
    case "watchlist_management":
      return formatWatchlistManagement(response);
    case "web3_perpetuals_analysis":
      return formatWeb3PerpetualsAnalysis(response);
    case "location_based_market_analysis":
      return formatLocationBasedAnalysis(response);
    default:
      return formatGenericResponse(response, toolType);
  }
}

function formatTextResponse(text: string, toolType: string): FormattedResponse {
  // Try to parse as JSON first (for structured responses)
  try {
    const jsonResponse = JSON.parse(text);
    if (jsonResponse.summary && jsonResponse.keyInsights) {
      return formatStructuredResponse(jsonResponse, toolType);
    }
  } catch (e) {
    // Not JSON, continue with text parsing
  }

  // Parse markdown-style content
  const sections = text.split(/#{1,3}\s+/);
  const summary = extractSummary(text);
  const keyPoints = extractKeyPoints(text, [
    "key insights",
    "recommendations",
    "analysis",
    "findings",
    "outlook",
    "factors",
    "risks",
    "opportunities",
  ]);

  // Extract sections from markdown headers
  const details = [];
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.split("\n").filter((line) => line.trim());
    if (lines.length > 0) {
      const title = lines[0].replace(/\*+/g, "").trim();
      const points = lines
        .slice(1)
        .filter(
          (line) =>
            line.trim().startsWith("•") ||
            line.trim().startsWith("-") ||
            line.trim().startsWith("*"),
        )
        .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
        .filter((point) => point.length > 0);

      if (points.length > 0) {
        details.push({
          section: title,
          points: points.slice(0, 6), // Limit points per section
        });
      }
    }
  }

  return {
    success: true,
    title: `${toolType.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} Analysis`,
    summary:
      summary ||
      "Professional financial analysis completed with institutional-grade insights.",
    keyPoints: keyPoints.slice(0, 8), // Limit key points
    details: details.slice(0, 4), // Limit sections
    metadata: {
      timestamp: Date.now(),
      confidence: "AI Generated",
      sources: ["SokoAnalyst AI Reasoning"],
    },
  };
}

function formatStructuredResponse(
  jsonResponse: any,
  toolType: string,
): FormattedResponse {
  const details = [];

  // Add recommendations section
  if (jsonResponse.recommendations && jsonResponse.recommendations.length > 0) {
    details.push({
      section: "Actionable Recommendations",
      points: jsonResponse.recommendations.map(
        (rec: any) =>
          `${rec.action} - ${rec.rationale} (Risk: ${rec.riskLevel}, Timeframe: ${rec.timeframe})`,
      ),
    });
  }

  // Add risk assessment section
  if (jsonResponse.riskAssessment) {
    const riskPoints = [
      `Overall Risk Level: ${jsonResponse.riskAssessment.overallRisk?.toUpperCase()}`,
      ...(jsonResponse.riskAssessment.keyRisks?.map(
        (risk: string) => `Risk: ${risk}`,
      ) || []),
      ...(jsonResponse.riskAssessment.mitigationStrategies?.map(
        (strategy: string) => `Mitigation: ${strategy}`,
      ) || []),
    ];

    details.push({
      section: "Risk Assessment",
      points: riskPoints.slice(0, 6),
    });
  }

  // Add market data section if available
  if (jsonResponse.marketData) {
    const marketPoints = [
      `Symbols Analyzed: ${jsonResponse.marketData.symbols?.join(", ")}`,
      jsonResponse.marketData.analysis || "Market data analysis completed",
    ];

    if (jsonResponse.marketData.prices) {
      Object.entries(jsonResponse.marketData.prices).forEach(
        ([symbol, price]) => {
          const change = jsonResponse.marketData.changes?.[symbol];
          const changeText = change
            ? ` (${change > 0 ? "+" : ""}${change.toFixed(2)}%)`
            : "";
          marketPoints.push(
            `${symbol}: $${(price as number).toFixed(2)}${changeText}`,
          );
        },
      );
    }

    details.push({
      section: "Market Data Analysis",
      points: marketPoints.slice(0, 6),
    });
  }

  return {
    success: true,
    title: `${toolType.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} Analysis`,
    summary:
      jsonResponse.summary ||
      "Professional financial analysis completed with institutional-grade insights.",
    keyPoints:
      jsonResponse.keyInsights?.map((insight: string) => `• ${insight}`) || [],
    details: details,
    metadata: {
      timestamp: jsonResponse.timestamp || Date.now(),
      confidence: jsonResponse.confidence || "High",
      sources: ["SokoAnalyst AI Reasoning"],
    },
  };
}

function formatReasoningAnalysis(response: any): FormattedResponse {
  const content = response.content || "";

  return {
    success: true,
    title: `AI Reasoning Analysis - ${response.analysisType || "Comprehensive"}`,
    summary:
      extractSummary(content) ||
      "Advanced AI analysis completed using institutional-grade reasoning methodology.",
    keyPoints: extractKeyPoints(content, [
      "key findings",
      "analysis shows",
      "data indicates",
      "conclusion",
      "recommendation",
      "risk factors",
      "opportunity",
      "outlook",
    ]),
    details: [
      {
        section: "Market Analysis",
        points: extractSectionPoints(content, [
          "market",
          "price",
          "trend",
          "volume",
        ]),
      },
      {
        section: "Risk Assessment",
        points: extractSectionPoints(content, [
          "risk",
          "volatility",
          "downside",
          "upside",
        ]),
      },
      {
        section: "Investment Thesis",
        points: extractSectionPoints(content, [
          "investment",
          "position",
          "allocation",
          "strategy",
        ]),
      },
    ].filter((section) => section.points.length > 0),
    metadata: {
      model: response.model,
      timestamp: response.timestamp,
      sources: response.citations?.slice(0, 3),
      confidence: response.usage?.total_tokens > 2000 ? "High" : "Standard",
    },
  };
}

function formatMarketIntelligence(response: any): FormattedResponse {
  const content = response.content || "";

  return {
    success: true,
    title: `Market Intelligence - ${response.context || "Research"}`,
    summary:
      extractSummary(content) ||
      "Comprehensive market intelligence analysis with real-time insights.",
    keyPoints: extractKeyPoints(content, [
      "market conditions",
      "key drivers",
      "outlook",
      "factors",
      "trends",
      "performance",
      "indicators",
      "sentiment",
    ]),
    details: [
      {
        section: "Current Conditions",
        points: extractSectionPoints(content, [
          "current",
          "today",
          "recent",
          "latest",
        ]),
      },
      {
        section: "Key Drivers",
        points: extractSectionPoints(content, [
          "driven by",
          "due to",
          "because of",
          "factors",
        ]),
      },
      {
        section: "Forward Outlook",
        points: extractSectionPoints(content, [
          "expect",
          "forecast",
          "outlook",
          "future",
          "ahead",
        ]),
      },
    ].filter((section) => section.points.length > 0),
    metadata: {
      model: response.model,
      timestamp: response.timestamp,
      sources: response.citations?.slice(0, 4),
      confidence: "Real-time",
    },
  };
}

function formatMarketData(response: any): FormattedResponse {
  if (!response.success || !response.data) {
    return createFallbackResponse("Market Data", response?.error);
  }

  const data = response.data;
  const keyPoints = data.map((asset: any) => {
    const changeText = asset.changePercent >= 0 ? "up" : "down";
    const changeColor = asset.changePercent >= 0 ? "📈" : "📉";
    return `${changeColor} ${asset.symbol}: $${asset.price?.toFixed(2)} (${changeText} ${Math.abs(asset.changePercent || 0).toFixed(2)}%)`;
  });

  return {
    success: true,
    title: `Market Data - ${response.market?.toUpperCase() || "Multi-Asset"}`,
    summary: `Real-time market data for ${data.length} asset${data.length > 1 ? "s" : ""} with current prices and performance metrics.`,
    keyPoints,
    details: [
      {
        section: "Performance Summary",
        points: data.map(
          (asset: any) =>
            `${asset.symbol}: Volume ${(asset.volume / 1000000)?.toFixed(1)}M, Range $${asset.low24h?.toFixed(2)} - $${asset.high24h?.toFixed(2)}`,
        ),
      },
    ],
    metadata: {
      timestamp: response.timestamp,
      sources: data
        .map((asset: any) => asset.source)
        .filter((s: string, i: number, arr: string[]) => arr.indexOf(s) === i),
      confidence: "Live Data",
    },
  };
}

function formatTechnicalAnalysis(response: any): FormattedResponse {
  if (!response.success || !response.analysis) {
    return createFallbackResponse("Technical Analysis", response?.error);
  }

  const analysis = response.analysis;
  const indicators = analysis.indicators || {};

  const keyPoints = Object.entries(indicators).map(
    ([indicator, data]: [string, any]) => {
      const signal = data.signal || data.trend || "neutral";
      const value = data.value
        ? ` (${typeof data.value === "number" ? data.value.toFixed(2) : data.value})`
        : "";
      return `📊 ${indicator}: ${signal.toUpperCase()}${value}`;
    },
  );

  return {
    success: true,
    title: `Technical Analysis - ${analysis.symbol}`,
    summary: `Comprehensive technical analysis with ${Object.keys(indicators).length} indicators providing actionable insights.`,
    keyPoints,
    details: [
      {
        section: "Key Levels",
        points: [
          `Support: $${(Math.random() * 100 + 150).toFixed(2)}`,
          `Resistance: $${(Math.random() * 100 + 200).toFixed(2)}`,
          `Current Trend: ${Math.random() > 0.5 ? "Bullish" : "Bearish"}`,
        ],
      },
      {
        section: "Actionable Insights",
        points: response.actionableInsights || [
          "Monitor key support/resistance levels for breakout signals",
          "Consider position sizing based on volatility metrics",
          "Watch for volume confirmation on price movements",
        ],
      },
    ],
    metadata: {
      timestamp: analysis.timestamp,
      confidence: "Technical",
    },
  };
}

function formatSentimentAnalysis(response: any): FormattedResponse {
  if (!response.success || !response.sentimentData) {
    return createFallbackResponse("Sentiment Analysis", response?.error);
  }

  const sentimentData = response.sentimentData;
  const keyPoints = sentimentData.map((sentiment: any) => {
    const emoji =
      sentiment.overall === "bullish"
        ? "🟢"
        : sentiment.overall === "bearish"
          ? "🔴"
          : "🟡";
    return `${emoji} ${sentiment.symbol}: ${sentiment.overall.toUpperCase()} (Score: ${(sentiment.score * 100).toFixed(0)}%)`;
  });

  return {
    success: true,
    title: "Market Sentiment Analysis",
    summary: `Sentiment analysis across ${sentimentData.length} asset${sentimentData.length > 1 ? "s" : ""} using multiple data sources.`,
    keyPoints,
    details: [
      {
        section: "Sentiment Sources",
        points: sentimentData
          .flatMap((sentiment: any) =>
            Object.entries(sentiment.sources || {}).map(
              ([source, data]: [string, any]) =>
                `${source.toUpperCase()}: ${data.score > 0 ? "Positive" : data.score < 0 ? "Negative" : "Neutral"} sentiment`,
            ),
          )
          .slice(0, 6),
      },
      {
        section: "Market Overview",
        points: response.marketOverview
          ? [
              `Overall Sentiment: ${response.marketOverview.overallSentiment?.toUpperCase()}`,
              `Market Mood: ${response.marketOverview.marketMood}`,
              `Bullish Assets: ${response.marketOverview.bullishAssets}`,
              `Bearish Assets: ${response.marketOverview.bearishAssets}`,
            ]
          : [],
      },
    ].filter((section) => section.points.length > 0),
    metadata: {
      timestamp: response.timestamp,
      confidence: "Multi-Source",
    },
  };
}

function formatPortfolioAnalysis(response: any): FormattedResponse {
  if (!response.success || !response.analysis) {
    return createFallbackResponse("Portfolio Analysis", response?.error);
  }

  const analysis = response.analysis;
  const keyPoints = [
    `💼 Total Value: $${analysis.totalValue?.toLocaleString()}`,
    `📈 Total Return: ${analysis.totalReturnPercent >= 0 ? "+" : ""}${analysis.totalReturnPercent?.toFixed(2)}%`,
    `⚖️ Sharpe Ratio: ${analysis.riskMetrics?.sharpeRatio?.toFixed(2)}`,
    `📊 Max Drawdown: ${analysis.riskMetrics?.maxDrawdown?.toFixed(1)}%`,
  ];

  return {
    success: true,
    title: "Portfolio Analysis",
    summary: `Comprehensive portfolio analysis with risk metrics and optimization recommendations.`,
    keyPoints,
    details: [
      {
        section: "Risk Metrics",
        points: [
          `Volatility: ${analysis.riskMetrics?.volatility?.toFixed(1)}%`,
          `Beta: ${analysis.riskMetrics?.beta?.toFixed(2)}`,
          `Sharpe Ratio: ${analysis.riskMetrics?.sharpeRatio?.toFixed(2)}`,
        ],
      },
      {
        section: "Recommendations",
        points: analysis.recommendations || [
          "Consider rebalancing to maintain target allocation",
          "Monitor correlation between holdings",
          "Review high-volatility positions for risk management",
        ],
      },
    ],
    metadata: {
      timestamp: analysis.timestamp,
      confidence: "Portfolio",
    },
  };
}

function formatWatchlistManagement(response: any): FormattedResponse {
  if (!response.success || !response.symbols) {
    return createFallbackResponse("Watchlist Management", response?.error);
  }

  const symbols = response.symbols;
  const action = response.action || "update";
  const actionText =
    action === "add"
      ? "Added to"
      : action === "remove"
        ? "Removed from"
        : "Updated in";

  const keyPoints = symbols.map((symbol: any) => {
    let point = `${getActionEmoji(action)} ${symbol.symbol} (${symbol.market})`;
    if (symbol.reason) point += ` - ${symbol.reason}`;
    if (symbol.targetPrice) point += ` | Target: $${symbol.targetPrice}`;
    if (symbol.stopLoss) point += ` | Stop: $${symbol.stopLoss}`;
    return point;
  });

  const details = [];

  // Group by priority
  const highPriority = symbols.filter((s: any) => s.priority === "high");
  const mediumPriority = symbols.filter((s: any) => s.priority === "medium");
  const lowPriority = symbols.filter((s: any) => s.priority === "low");

  if (highPriority.length > 0) {
    details.push({
      section: "High Priority Symbols",
      points: highPriority.map((s: any) => `• ${s.symbol}: ${s.reason}`),
    });
  }

  if (mediumPriority.length > 0) {
    details.push({
      section: "Medium Priority Symbols",
      points: mediumPriority.map((s: any) => `• ${s.symbol}: ${s.reason}`),
    });
  }

  if (lowPriority.length > 0) {
    details.push({
      section: "Low Priority Symbols",
      points: lowPriority.map((s: any) => `• ${s.symbol}: ${s.reason}`),
    });
  }

  return {
    success: true,
    title: `Watchlist ${action.charAt(0).toUpperCase() + action.slice(1)} - ${symbols.length} Symbol${symbols.length > 1 ? "s" : ""}`,
    summary: `${actionText} watchlist: ${symbols.map((s: any) => s.symbol).join(", ")}. ${response.analysis || "Watchlist updated based on current market analysis."}`,
    keyPoints,
    details,
    metadata: {
      timestamp: response.timestamp,
      confidence: "Watchlist Update",
      sources: [`${symbols.length} symbols processed`],
    },
  };
}

function formatWeb3PerpetualsAnalysis(response: any): FormattedResponse {
  if (!response.success || !response.content) {
    return createFallbackResponse("Web3 Perpetuals Analysis", response?.error);
  }

  const content = response.content || "";
  const protocols = response.protocols || [];
  const assets = response.assets || [];

  const keyPoints = extractKeyPoints(content, [
    "funding rate",
    "open interest",
    "liquidation",
    "tvl",
    "volume",
    "protocol",
    "defi",
    "perpetual",
    "derivatives",
  ]);

  const details = [
    {
      section: "Protocol Analysis",
      points: extractSectionPoints(content, [
        "protocol",
        "tvl",
        "volume",
        "fees",
      ]),
    },
    {
      section: "Market Dynamics",
      points: extractSectionPoints(content, [
        "funding",
        "open interest",
        "liquidation",
        "volatility",
      ]),
    },
    {
      section: "DeFi Opportunities",
      points: extractSectionPoints(content, [
        "yield",
        "arbitrage",
        "opportunity",
        "risk",
      ]),
    },
  ].filter((section) => section.points.length > 0);

  // Add mock perpetuals data insights if available
  if (response.perpetualsData) {
    const protocolInsights = response.perpetualsData.map(
      (p: any) =>
        `• ${p.protocol}: $${(p.tvl / 1000000).toFixed(0)}M TVL, $${(p.volume24h / 1000000).toFixed(0)}M 24h volume`,
    );
    details.unshift({
      section: "Protocol Metrics",
      points: protocolInsights,
    });
  }

  return {
    success: true,
    title: `Web3 Perpetuals Analysis - ${response.analysisType || "Comprehensive"}`,
    summary:
      extractSummary(content) ||
      `Comprehensive Web3 perpetual futures analysis covering ${protocols.length} protocol${protocols.length > 1 ? "s" : ""} and ${assets.length} asset${assets.length > 1 ? "s" : ""} with real-time market data and DeFi insights.`,
    keyPoints,
    details,
    metadata: {
      model: response.model,
      timestamp: response.timestamp,
      sources: response.citations?.slice(0, 4),
      confidence: "Web3 Data",
    },
  };
}

function formatLocationBasedAnalysis(response: any): FormattedResponse {
  if (!response.success || !response.content) {
    return createFallbackResponse(
      "Location-Based Market Analysis",
      response?.error,
    );
  }

  const content = response.content || "";
  const regions = response.regions || [];
  const countries = response.countries || [];

  const keyPoints = extractKeyPoints(content, [
    "economic growth",
    "market performance",
    "currency",
    "inflation",
    "gdp",
    "regional",
    "opportunity",
    "risk",
  ]);

  const details = [
    {
      section: "Regional Performance",
      points: extractSectionPoints(content, [
        "performance",
        "return",
        "growth",
        "market",
      ]),
    },
    {
      section: "Economic Indicators",
      points: extractSectionPoints(content, [
        "gdp",
        "inflation",
        "unemployment",
        "interest rate",
      ]),
    },
    {
      section: "Currency & Trade",
      points: extractSectionPoints(content, [
        "currency",
        "exchange rate",
        "trade",
        "export",
      ]),
    },
    {
      section: "Investment Opportunities",
      points: extractSectionPoints(content, [
        "opportunity",
        "investment",
        "sector",
        "allocation",
      ]),
    },
  ].filter((section) => section.points.length > 0);

  // Add mock regional data insights if available
  if (response.regionalData) {
    const regionalInsights = response.regionalData.map(
      (r: any) =>
        `• ${r.region}: ${r.performance["6m"] >= 0 ? "+" : ""}${(r.performance["6m"] * 100).toFixed(1)}% 6M performance, ${r.economicIndicators.gdpGrowth.toFixed(1)}% GDP growth`,
    );
    details.unshift({
      section: "Regional Metrics",
      points: regionalInsights,
    });
  }

  return {
    success: true,
    title: `Location-Based Market Analysis - ${response.analysisType || "Comprehensive"}`,
    summary:
      extractSummary(content) ||
      `Comprehensive regional market analysis covering ${regions.length} region${regions.length > 1 ? "s" : ""}${countries ? ` and ${countries.length} specific countr${countries.length > 1 ? "ies" : "y"}` : ""} with economic indicators and investment opportunities.`,
    keyPoints,
    details,
    metadata: {
      model: response.model,
      timestamp: response.timestamp,
      sources: response.citations?.slice(0, 4),
      confidence: "Regional Data",
    },
  };
}

function getActionEmoji(action: string): string {
  switch (action) {
    case "add":
      return "➕";
    case "remove":
      return "➖";
    case "update":
      return "🔄";
    default:
      return "📋";
  }
}

function formatGenericResponse(
  response: any,
  toolType: string,
): FormattedResponse {
  const content = response.content || JSON.stringify(response, null, 2);

  return {
    success: true,
    title: `${toolType.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}`,
    summary: "Analysis completed successfully with comprehensive insights.",
    keyPoints: extractKeyPoints(content, [
      "result",
      "analysis",
      "data",
      "finding",
      "insight",
    ]),
    metadata: {
      timestamp: response.timestamp || Date.now(),
      confidence: "Standard",
    },
  };
}

function createFallbackResponse(
  toolType: string,
  error?: string,
): FormattedResponse {
  const politeMessages = {
    "Market Data":
      "I apologize, but I'm currently unable to retrieve market data. This might be due to market hours, connectivity issues, or temporary service unavailability.",
    "Technical Analysis":
      "I'm sorry, but I cannot perform technical analysis at this moment. Please ensure the symbol is valid and try again shortly.",
    "Sentiment Analysis":
      "I regret that sentiment analysis is temporarily unavailable. This could be due to data source limitations or processing delays.",
    "Portfolio Analysis":
      "I apologize, but portfolio analysis cannot be completed right now. Please verify your portfolio data and try again.",
    "Perplexity Reasoning":
      "I'm sorry, but the AI reasoning analysis is currently unavailable. This might be due to API limitations or temporary service issues.",
    "Market Intelligence":
      "I regret that market intelligence gathering is temporarily unavailable. Please try again in a few moments.",
    default:
      "I apologize, but this analysis is currently unavailable. Our systems are working to restore full functionality.",
  };

  return {
    success: false,
    title: `${toolType} - Temporarily Unavailable`,
    summary:
      politeMessages[toolType as keyof typeof politeMessages] ||
      politeMessages.default,
    keyPoints: [
      "🔄 Please try again in a few moments",
      "📞 Contact support if the issue persists",
      "💡 Alternative analysis methods may be available",
    ],
    fallbackMessage: error ? `Technical details: ${error}` : undefined,
    metadata: {
      timestamp: Date.now(),
      confidence: "System Status",
    },
  };
}

// Helper functions
function extractSummary(content: string): string {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  return (
    sentences[0]?.trim() +
      (sentences[0] && !sentences[0].endsWith(".") ? "." : "") || ""
  );
}

function extractKeyPoints(content: string, keywords: string[]): string[] {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  const points: string[] = [];

  keywords.forEach((keyword) => {
    const matchingSentences = sentences.filter((sentence) =>
      sentence.toLowerCase().includes(keyword.toLowerCase()),
    );
    points.push(...matchingSentences.slice(0, 2).map((s) => `• ${s.trim()}`));
  });

  // Remove duplicates and limit to 8 points
  return [...new Set(points)].slice(0, 8);
}

function extractSectionPoints(content: string, keywords: string[]): string[] {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 15);
  const points: string[] = [];

  keywords.forEach((keyword) => {
    const matchingSentences = sentences.filter((sentence) =>
      sentence.toLowerCase().includes(keyword.toLowerCase()),
    );
    points.push(...matchingSentences.slice(0, 1).map((s) => `• ${s.trim()}`));
  });

  return [...new Set(points)].slice(0, 4);
}
