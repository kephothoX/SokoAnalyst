import { Perplexity } from "@perplexity-ai/perplexity_ai";

// Initialize Perplexity client
const perplexity = new Perplexity({
  apiKey:
    process.env.PERPLEXITY_API_KEY || "pplx-******************************",
});

export interface PerplexitySearchResult {
  content: string;
  citations: string[];
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Search for financial market data using Perplexity
export async function searchFinancialData(
  query: string,
): Promise<PerplexitySearchResult> {
  try {
    const response = await perplexity.chat.completions.create({
      model: "sonar-reasoning",
      messages: [
        {
          role: "system",
          content:
            "You are SokoAnalyst, an elite financial intelligence system. Use advanced reasoning to analyze financial markets with precision. Provide:\n\n1. **Data Analysis**: Current prices, volumes, market cap, and key metrics\n2. **Reasoning Process**: Step-by-step analysis of market conditions\n3. **Context**: Historical perspective and market dynamics\n4. **Risk Assessment**: Potential risks and opportunities\n5. **Actionable Insights**: Clear, professional recommendations\n\nAlways cite sources and provide specific numbers with proper context. Use professional financial terminology and maintain analytical rigor.",
        },
        {
          role: "user",
          content: `Analyze the following financial query with detailed reasoning: ${query}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.2,
      top_p: 0.9,
    });

    const choice = response.choices[0];
    if (!choice?.message?.content) {
      throw new Error("No content received from Perplexity");
    }

    // Handle different content types
    const content =
      typeof choice.message.content === "string"
        ? choice.message.content
        : JSON.stringify(choice.message.content);

    return {
      content,
      citations: [], // Citations might not be available in this API version
      model: response.model || "llama-3.1-sonar-small-128k-online",
      usage: response.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
  } catch (error) {
    console.error("Perplexity search failed:", error);
    throw new Error(
      `Failed to search financial data: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

// Search for market news and sentiment
export async function searchMarketNews(
  symbols: string[],
  newsType: string = "general",
): Promise<PerplexitySearchResult> {
  const symbolsStr = symbols.join(", ");
  const query = `Latest ${newsType} news and market sentiment for ${symbolsStr}. Include current market sentiment, recent news headlines, and analyst opinions. Provide specific sentiment scores if available.`;

  return await searchFinancialData(query);
}

// Search for economic indicators
export async function searchEconomicIndicators(
  indicators: string[],
  countries: string[] = ["US"],
): Promise<PerplexitySearchResult> {
  const indicatorsStr = indicators.join(", ");
  const countriesStr = countries.join(", ");
  const query = `Latest economic indicators for ${countriesStr}: ${indicatorsStr}. Include current values, previous values, changes, and release dates. Provide specific numbers and percentages.`;

  return await searchFinancialData(query);
}

// Parse financial data from Perplexity response
export function parseFinancialDataFromResponse(
  content: string,
  symbol: string,
) {
  // Extract price information using regex patterns
  const priceMatch = content.match(/\$?(\d+\.?\d*)/);
  const changeMatch = content.match(/([+-]?\d+\.?\d*)\s*\(/);
  const percentMatch = content.match(/([+-]?\d+\.?\d*)%/);
  const volumeMatch = content.match(/volume[:\s]+(\d+\.?\d*[KMB]?)/i);

  const price = priceMatch ? parseFloat(priceMatch[1]) : null;
  const change = changeMatch ? parseFloat(changeMatch[1]) : null;
  const changePercent = percentMatch ? parseFloat(percentMatch[1]) : null;
  const volume = volumeMatch ? parseVolumeString(volumeMatch[1]) : null;

  return {
    symbol,
    price,
    change,
    changePercent,
    volume,
    timestamp: Date.now(),
    source: "Perplexity",
    rawContent: content,
  };
}

// Parse volume strings like "1.2M", "500K", "2.5B"
function parseVolumeString(volumeStr: string): number {
  const num = parseFloat(volumeStr);
  const unit = volumeStr.toUpperCase();

  if (unit.includes("K")) return num * 1000;
  if (unit.includes("M")) return num * 1000000;
  if (unit.includes("B")) return num * 1000000000;
  return num;
}

// Extract sentiment from text
export function extractSentiment(content: string): {
  sentiment: string;
  score: number;
  confidence: number;
} {
  const lowerContent = content.toLowerCase();

  // Positive indicators
  const positiveWords = [
    "bullish",
    "positive",
    "optimistic",
    "growth",
    "gains",
    "rally",
    "surge",
    "strong",
    "outperform",
  ];
  const positiveCount = positiveWords.filter((word) =>
    lowerContent.includes(word),
  ).length;

  // Negative indicators
  const negativeWords = [
    "bearish",
    "negative",
    "pessimistic",
    "decline",
    "losses",
    "crash",
    "weak",
    "underperform",
  ];
  const negativeCount = negativeWords.filter((word) =>
    lowerContent.includes(word),
  ).length;

  // Calculate sentiment score (-1 to 1)
  const totalWords = positiveCount + negativeCount;
  const score =
    totalWords > 0 ? (positiveCount - negativeCount) / totalWords : 0;

  // Determine sentiment category
  let sentiment = "neutral";
  if (score > 0.2) sentiment = "bullish";
  else if (score < -0.2) sentiment = "bearish";

  // Calculate confidence based on number of sentiment indicators found
  const confidence = Math.min(totalWords / 5, 1); // Max confidence when 5+ indicators found

  return { sentiment, score, confidence };
}

// Enhanced reasoning-based financial analysis
export async function analyzeMarketWithReasoning(
  symbols: string[],
  analysisType:
    | "technical"
    | "fundamental"
    | "sentiment"
    | "comprehensive" = "comprehensive",
): Promise<PerplexitySearchResult> {
  const symbolsStr = symbols.join(", ");

  const analysisPrompts = {
    technical: `Perform detailed technical analysis for ${symbolsStr}. Include:
    - Current price action and trend analysis
    - Key support and resistance levels
    - Technical indicators (RSI, MACD, Moving Averages)
    - Chart patterns and breakout potential
    - Volume analysis and momentum indicators
    - Short-term and medium-term outlook`,

    fundamental: `Conduct comprehensive fundamental analysis for ${symbolsStr}. Include:
    - Financial health and key metrics (P/E, EPS, Revenue growth)
    - Business model and competitive advantages
    - Industry trends and market position
    - Recent earnings and guidance
    - Valuation assessment and fair value estimation
    - Long-term growth prospects`,

    sentiment: `Analyze current market sentiment for ${symbolsStr}. Include:
    - News sentiment and media coverage analysis
    - Social media sentiment and retail investor behavior
    - Institutional sentiment and smart money flows
    - Options flow and derivatives positioning
    - Fear & Greed indicators
    - Contrarian signals and sentiment extremes`,

    comprehensive: `Provide comprehensive multi-dimensional analysis for ${symbolsStr}. Include:
    - Technical analysis with key levels and indicators
    - Fundamental valuation and business assessment
    - Market sentiment and positioning analysis
    - Risk-reward assessment and scenario planning
    - Correlation analysis with broader markets
    - Actionable investment thesis with specific entry/exit levels`,
  };

  try {
    const response = await perplexity.chat.completions.create({
      model: "sonar-reasoning",
      messages: [
        {
          role: "system",
          content: `You are SokoAnalyst, an elite institutional-grade financial intelligence system. 
          
          Your analysis methodology:
          1. **Data Gathering**: Collect real-time market data and news
          2. **Multi-Factor Analysis**: Combine technical, fundamental, and sentiment factors
          3. **Risk Assessment**: Identify key risks and probability-weighted scenarios
          4. **Reasoning Chain**: Show your analytical process step-by-step
          5. **Professional Conclusions**: Provide clear, actionable insights
          
          Format your response with:
          - Executive Summary
          - Detailed Analysis with reasoning
          - Risk Factors
          - Investment Thesis
          - Specific Recommendations
          
          Use institutional-quality analysis with proper financial terminology.`,
        },
        {
          role: "user",
          content: analysisPrompts[analysisType],
        },
      ],
      max_tokens: 3000,
      temperature: 0.15,
      top_p: 0.85,
    });

    const choice = response.choices[0];
    if (!choice?.message?.content) {
      throw new Error("No content received from Perplexity reasoning analysis");
    }

    const content =
      typeof choice.message.content === "string"
        ? choice.message.content
        : JSON.stringify(choice.message.content);

    return {
      content,
      citations: extractCitations(content),
      model: response.model || "sonar-reasoning",
      usage: response.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
  } catch (error) {
    console.error("Perplexity reasoning analysis failed:", error);
    throw new Error(
      `Failed to perform reasoning analysis: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

// Enhanced market intelligence with reasoning
export async function getMarketIntelligence(
  query: string,
  context:
    | "trading"
    | "investment"
    | "risk_management"
    | "research" = "research",
): Promise<PerplexitySearchResult> {
  const contextPrompts = {
    trading:
      "Focus on short-term trading opportunities, entry/exit points, and risk management for active trading.",
    investment:
      "Provide long-term investment analysis, value assessment, and portfolio allocation recommendations.",
    risk_management:
      "Emphasize risk factors, scenario analysis, stress testing, and hedging strategies.",
    research:
      "Deliver comprehensive research-grade analysis with detailed methodology and supporting evidence.",
  };

  const enhancedQuery = `${query}

Context: ${contextPrompts[context]}

Please provide institutional-grade analysis with:
1. Key findings and implications
2. Supporting data and evidence
3. Risk assessment and scenarios
4. Actionable recommendations
5. Confidence levels and limitations`;

  return await searchFinancialData(enhancedQuery);
}

// Extract citations from content
function extractCitations(content: string): string[] {
  const citations: string[] = [];

  // Look for common citation patterns
  const urlPattern = /https?:\/\/[^\s]+/g;
  const sourcePattern = /(?:Source|According to|Via|From):\s*([^\n]+)/gi;
  const companyPattern =
    /\b(?:Bloomberg|Reuters|CNBC|Yahoo Finance|MarketWatch|WSJ|Financial Times)\b/gi;

  const urls = content.match(urlPattern) || [];
  const sources = content.match(sourcePattern) || [];
  const companies = content.match(companyPattern) || [];

  citations.push(...urls);
  citations.push(...sources);
  citations.push(...companies);

  // Remove duplicates and return unique citations
  return [...new Set(citations)].slice(0, 10); // Limit to 10 citations
}

// Enhanced sentiment analysis with reasoning
export function analyzeAdvancedSentiment(content: string): {
  sentiment: string;
  score: number;
  confidence: number;
  reasoning: string;
  factors: {
    technical: number;
    fundamental: number;
    news: number;
    social: number;
  };
} {
  const lowerContent = content.toLowerCase();

  // Enhanced sentiment indicators
  const bullishIndicators = [
    "bullish",
    "positive",
    "optimistic",
    "growth",
    "gains",
    "rally",
    "surge",
    "strong",
    "outperform",
    "upgrade",
    "beat expectations",
    "momentum",
    "breakout",
    "accumulation",
    "institutional buying",
  ];

  const bearishIndicators = [
    "bearish",
    "negative",
    "pessimistic",
    "decline",
    "losses",
    "crash",
    "weak",
    "underperform",
    "downgrade",
    "miss expectations",
    "selling pressure",
    "breakdown",
    "distribution",
    "institutional selling",
  ];

  const technicalBullish = [
    "breakout",
    "momentum",
    "support",
    "uptrend",
    "golden cross",
  ];
  const technicalBearish = [
    "breakdown",
    "resistance",
    "downtrend",
    "death cross",
  ];

  const fundamentalBullish = [
    "earnings beat",
    "revenue growth",
    "margin expansion",
    "guidance raise",
  ];
  const fundamentalBearish = [
    "earnings miss",
    "revenue decline",
    "margin compression",
    "guidance cut",
  ];

  // Calculate factor scores
  const technicalScore = calculateFactorScore(
    lowerContent,
    technicalBullish,
    technicalBearish,
  );
  const fundamentalScore = calculateFactorScore(
    lowerContent,
    fundamentalBullish,
    fundamentalBearish,
  );
  const newsScore = calculateFactorScore(
    lowerContent,
    bullishIndicators,
    bearishIndicators,
  );
  const socialScore = extractSocialSentiment(lowerContent);

  // Weighted overall score
  const overallScore =
    technicalScore * 0.3 +
    fundamentalScore * 0.3 +
    newsScore * 0.25 +
    socialScore * 0.15;

  let sentiment = "neutral";
  if (overallScore > 0.3) sentiment = "bullish";
  else if (overallScore < -0.3) sentiment = "bearish";
  else if (overallScore > 0.1) sentiment = "slightly bullish";
  else if (overallScore < -0.1) sentiment = "slightly bearish";

  const confidence = Math.min(Math.abs(overallScore) * 2, 1);

  const reasoning = generateSentimentReasoning(sentiment, {
    technical: technicalScore,
    fundamental: fundamentalScore,
    news: newsScore,
    social: socialScore,
  });

  return {
    sentiment,
    score: overallScore,
    confidence,
    reasoning,
    factors: {
      technical: technicalScore,
      fundamental: fundamentalScore,
      news: newsScore,
      social: socialScore,
    },
  };
}

function calculateFactorScore(
  content: string,
  positive: string[],
  negative: string[],
): number {
  const positiveCount = positive.filter((word) =>
    content.includes(word),
  ).length;
  const negativeCount = negative.filter((word) =>
    content.includes(word),
  ).length;
  const total = positiveCount + negativeCount;

  return total > 0 ? (positiveCount - negativeCount) / total : 0;
}

function extractSocialSentiment(content: string): number {
  const socialPositive = [
    "retail buying",
    "social media buzz",
    "trending",
    "viral",
  ];
  const socialNegative = [
    "retail selling",
    "social media negative",
    "fear",
    "panic",
  ];

  return calculateFactorScore(content, socialPositive, socialNegative);
}

function generateSentimentReasoning(sentiment: string, factors: any): string {
  const strongestFactor = Object.entries(factors).reduce((a, b) =>
    Math.abs(a[1] as number) > Math.abs(b[1] as number) ? a : b,
  );

  return `Sentiment analysis shows ${sentiment} outlook. Primary driver: ${strongestFactor[0]} factors (${(strongestFactor[1] as number) > 0 ? "+" : ""}${((strongestFactor[1] as number) * 100).toFixed(1)}%). Technical: ${(factors.technical * 100).toFixed(1)}%, Fundamental: ${(factors.fundamental * 100).toFixed(1)}%, News: ${(factors.news * 100).toFixed(1)}%, Social: ${(factors.social * 100).toFixed(1)}%.`;
}

export default perplexity;
