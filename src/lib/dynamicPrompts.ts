/**
 * Dynamic Prompts Generator for SokoAnalyst
 * Generates contextual, intelligent prompts for financial analysis
 */

export interface DynamicPrompt {
  id: string;
  category: string;
  title: string;
  prompt: string;
  description: string;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  tags: string[];
}

// Market symbols for dynamic prompt generation
const POPULAR_SYMBOLS = [
  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
  "GOOGL",
  "AMZN",
  "META",
  "BTC-USD",
  "ETH-USD",
  "SPY",
  "QQQ",
];
const CRYPTO_SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD", "ADA-USD", "DOT-USD"];
const TECH_SYMBOLS = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "META"];
const SECTORS = [
  "technology",
  "healthcare",
  "financial",
  "energy",
  "consumer discretionary",
  "industrials",
];

// Time-based context for dynamic prompts
function getCurrentMarketContext() {
  const hour = new Date().getHours();
  const day = new Date().getDay();
  const isWeekend = day === 0 || day === 6;
  const isMarketHours = hour >= 9 && hour <= 16 && !isWeekend;

  return {
    isMarketHours,
    isWeekend,
    timeOfDay: hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening",
    marketSession: isMarketHours ? "active" : "closed",
  };
}

// Generate random selection helper
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Generate dynamic prompts based on current context
export function generateDynamicPrompts(): DynamicPrompt[] {
  const context = getCurrentMarketContext();
  const randomSymbols = getRandomItems(POPULAR_SYMBOLS, 3);
  const randomCrypto = getRandomItems(CRYPTO_SYMBOLS, 2);
  const randomTech = getRandomItems(TECH_SYMBOLS, 2);
  const randomSector = SECTORS[Math.floor(Math.random() * SECTORS.length)];

  const basePrompts: DynamicPrompt[] = [
    // Market Analysis Prompts
    {
      id: "market-overview",
      category: "Market Analysis",
      title: "Current Market Overview",
      prompt: `Provide a comprehensive analysis of current market conditions. Focus on major indices, sector performance, and key market drivers affecting ${randomSymbols.join(", ")}. Include risk assessment and outlook.`,
      description:
        "Get a complete picture of today's market landscape with AI reasoning",
      icon: "📊",
      difficulty: "beginner",
      estimatedTime: "2-3 min",
      tags: ["market-overview", "indices", "sectors"],
    },
    {
      id: "sector-rotation",
      category: "Market Analysis",
      title: `${randomSector.charAt(0).toUpperCase() + randomSector.slice(1)} Sector Deep Dive`,
      prompt: `Analyze the ${randomSector} sector performance and rotation patterns. Identify leading stocks, sector-specific catalysts, and compare with broader market. Provide investment thesis and risk factors.`,
      description: `Detailed sector analysis with institutional-grade insights`,
      icon: "🏭",
      difficulty: "intermediate",
      estimatedTime: "3-4 min",
      tags: ["sector-analysis", "rotation", "investment-thesis"],
    },
    {
      id: "volatility-analysis",
      category: "Risk Management",
      title: "Market Volatility Assessment",
      prompt: `Analyze current market volatility patterns using VIX, realized volatility, and cross-asset correlations. Assess tail risks and provide hedging strategies for a diversified portfolio.`,
      description:
        "Professional volatility analysis with hedging recommendations",
      icon: "📈",
      difficulty: "advanced",
      estimatedTime: "4-5 min",
      tags: ["volatility", "vix", "risk-management", "hedging"],
    },

    // Technical Analysis Prompts
    {
      id: "technical-breakout",
      category: "Technical Analysis",
      title: `${randomSymbols[0]} Technical Breakout Analysis`,
      prompt: `Perform comprehensive technical analysis on ${randomSymbols[0]}. Identify key support/resistance levels, chart patterns, and momentum indicators. Provide specific entry/exit levels with risk management guidelines.`,
      description:
        "Professional technical analysis with actionable trading levels",
      icon: "📈",
      difficulty: "intermediate",
      estimatedTime: "3-4 min",
      tags: ["technical-analysis", "breakout", "trading-levels"],
    },
    {
      id: "multi-timeframe",
      category: "Technical Analysis",
      title: "Multi-Timeframe Analysis",
      prompt: `Conduct multi-timeframe technical analysis on ${randomTech.join(" and ")}. Analyze daily, weekly, and monthly charts to identify trend alignment and optimal entry points. Include volume analysis and momentum confirmation.`,
      description: "Advanced multi-timeframe technical analysis",
      icon: "⏰",
      difficulty: "advanced",
      estimatedTime: "5-6 min",
      tags: ["multi-timeframe", "trend-analysis", "volume"],
    },

    // Crypto Analysis Prompts
    {
      id: "crypto-correlation",
      category: "Cryptocurrency",
      title: "Crypto Market Correlation Analysis",
      prompt: `Analyze correlation patterns between ${randomCrypto.join(" and ")} and traditional markets. Assess decoupling trends, institutional adoption impact, and regulatory influences on crypto performance.`,
      description: "Advanced crypto-traditional market correlation analysis",
      icon: "₿",
      difficulty: "intermediate",
      estimatedTime: "3-4 min",
      tags: ["cryptocurrency", "correlation", "institutional"],
    },
    {
      id: "defi-analysis",
      category: "Cryptocurrency",
      title: "DeFi Protocol Analysis",
      prompt: `Evaluate the current DeFi landscape focusing on TVL trends, yield farming opportunities, and protocol risks. Analyze major DeFi tokens and their tokenomics. Provide risk-adjusted yield strategies.`,
      description:
        "Comprehensive DeFi ecosystem analysis with yield strategies",
      icon: "🏦",
      difficulty: "advanced",
      estimatedTime: "4-5 min",
      tags: ["defi", "tvl", "yield-farming", "tokenomics"],
    },

    // Sentiment & News Analysis Prompts
    {
      id: "earnings-sentiment",
      category: "Sentiment Analysis",
      title: "Earnings Season Sentiment",
      prompt: `Analyze market sentiment around upcoming earnings for ${randomTech.join(", ")}. Include options flow analysis, analyst revisions, and social media sentiment. Predict potential earnings reactions and volatility.`,
      description:
        "Comprehensive earnings sentiment with options flow analysis",
      icon: "📰",
      difficulty: "intermediate",
      estimatedTime: "3-4 min",
      tags: ["earnings", "sentiment", "options-flow"],
    },
    {
      id: "fed-policy-impact",
      category: "Macro Analysis",
      title: "Federal Reserve Policy Impact",
      prompt: `Assess the impact of current Federal Reserve policy on different asset classes. Analyze interest rate sensitivity across sectors, bond market implications, and currency effects. Provide positioning recommendations.`,
      description: "Macro policy analysis with cross-asset implications",
      icon: "🏛️",
      difficulty: "advanced",
      estimatedTime: "4-5 min",
      tags: ["fed-policy", "interest-rates", "macro", "cross-asset"],
    },

    // Portfolio & Risk Management Prompts
    {
      id: "portfolio-optimization",
      category: "Portfolio Management",
      title: "Portfolio Optimization Strategy",
      prompt: `Design an optimal portfolio allocation strategy for current market conditions. Include asset allocation across equities, bonds, commodities, and alternatives. Provide risk-adjusted return expectations and rebalancing guidelines.`,
      description: "Professional portfolio optimization with risk management",
      icon: "💼",
      difficulty: "advanced",
      estimatedTime: "5-6 min",
      tags: ["portfolio", "optimization", "asset-allocation"],
    },
    {
      id: "risk-parity",
      category: "Risk Management",
      title: "Risk Parity Analysis",
      prompt: `Construct a risk parity portfolio using current market volatilities and correlations. Compare with traditional 60/40 allocation and analyze risk-adjusted performance. Include stress testing scenarios.`,
      description: "Advanced risk parity portfolio construction",
      icon: "⚖️",
      difficulty: "advanced",
      estimatedTime: "5-6 min",
      tags: ["risk-parity", "volatility", "stress-testing"],
    },

    // AI & Quantitative Analysis Prompts
    {
      id: "ai-market-prediction",
      category: "AI Analysis",
      title: "AI-Powered Market Prediction",
      prompt: `Use AI reasoning to predict market movements for the next 1-3 months. Analyze multiple data sources including technical indicators, sentiment data, and macro factors. Provide probability-weighted scenarios with confidence intervals.`,
      description: "Advanced AI-powered market forecasting with probabilities",
      icon: "🤖",
      difficulty: "advanced",
      estimatedTime: "4-5 min",
      tags: ["ai-prediction", "forecasting", "probability"],
    },
    {
      id: "quantitative-screening",
      category: "Quantitative Analysis",
      title: "Quantitative Stock Screening",
      prompt: `Perform quantitative screening to identify undervalued stocks with strong momentum. Use multiple factors including P/E ratios, revenue growth, profit margins, and technical momentum. Rank top opportunities with risk assessment.`,
      description: "Multi-factor quantitative stock screening",
      icon: "🔍",
      difficulty: "intermediate",
      estimatedTime: "3-4 min",
      tags: ["quantitative", "screening", "valuation", "momentum"],
    },

    // Web3 & DeFi Analysis Prompts
    {
      id: "web3-perpetuals-analysis",
      category: "Web3 & DeFi",
      title: "Web3 Perpetuals Market Analysis",
      prompt: `Analyze the current Web3 perpetual futures landscape focusing on dYdX, GMX, and Perpetual Protocol. Examine funding rates, open interest, and liquidation patterns for ${randomCrypto.join(" and ")}. Include protocol TVL comparisons, trading volumes, and yield opportunities. Assess the decentralized derivatives market trends and identify arbitrage opportunities.`,
      description:
        "Comprehensive Web3 perpetuals and DeFi derivatives analysis",
      icon: "🌐",
      difficulty: "advanced",
      estimatedTime: "5-6 min",
      tags: ["web3", "defi", "perpetuals", "derivatives"],
    },
    {
      id: "defi-yield-farming",
      category: "Web3 & DeFi",
      title: "DeFi Yield Farming Opportunities",
      prompt: `Evaluate current DeFi yield farming opportunities across major protocols including Uniswap, Aave, Compound, and Curve. Analyze APY rates, impermanent loss risks, and protocol security. Focus on ${randomCrypto.join(", ")} pairs and provide risk-adjusted yield strategies with entry/exit recommendations.`,
      description: "DeFi yield farming analysis with risk assessment",
      icon: "🚜",
      difficulty: "advanced",
      estimatedTime: "4-5 min",
      tags: ["defi", "yield-farming", "apy", "liquidity"],
    },

    // Location-Based Analysis Prompts
    {
      id: "regional-market-comparison",
      category: "Regional Analysis",
      title: "Global Regional Market Comparison",
      prompt: `Compare market performance across North America, Europe, Asia-Pacific, and Emerging Markets over the past 6 months. Analyze economic indicators, currency impacts, sector rotations, and geopolitical factors. Identify regional arbitrage opportunities and provide allocation recommendations based on current valuations and growth prospects.`,
      description:
        "Comprehensive regional market comparison with allocation strategies",
      icon: "🌍",
      difficulty: "intermediate",
      estimatedTime: "4-5 min",
      tags: ["regional", "global-markets", "allocation", "arbitrage"],
    },
    {
      id: "emerging-markets-deep-dive",
      category: "Regional Analysis",
      title: "Emerging Markets Deep Dive",
      prompt: `Conduct detailed analysis of emerging markets focusing on India, Brazil, and Southeast Asia. Examine economic growth, political stability, currency trends, and sector opportunities. Compare valuations with developed markets and assess infrastructure, technology, and consumer discretionary sectors for investment potential.`,
      description: "Deep dive into emerging markets with sector analysis",
      icon: "🌱",
      difficulty: "advanced",
      estimatedTime: "5-6 min",
      tags: ["emerging-markets", "growth", "sectors", "valuation"],
    },

    // Watchlist Management Prompts
    {
      id: "watchlist-opportunities",
      category: "Watchlist Management",
      title: "Smart Watchlist Recommendations",
      prompt: `Analyze current market conditions and recommend 5-7 high-potential symbols for my watchlist. Include a mix of ${randomTech.join(" and ")} along with emerging opportunities. For each recommendation, provide target prices, stop-loss levels, priority ranking, and clear reasoning. Use the watchlist management tool to add these symbols.`,
      description: "AI-powered watchlist recommendations with target prices",
      icon: "📋",
      difficulty: "intermediate",
      estimatedTime: "3-4 min",
      tags: ["watchlist", "recommendations", "targets"],
    },
    {
      id: "watchlist-cleanup",
      category: "Watchlist Management",
      title: "Watchlist Optimization Review",
      prompt: `Review my current watchlist and identify symbols that should be removed based on changed fundamentals, technical deterioration, or better opportunities elsewhere. Provide clear reasoning for each removal and suggest 2-3 replacement symbols with better risk-reward profiles.`,
      description: "Optimize watchlist by removing underperformers",
      icon: "🔄",
      difficulty: "advanced",
      estimatedTime: "4-5 min",
      tags: ["watchlist", "optimization", "cleanup"],
    },

    // Global Markets Prompts
    {
      id: "global-markets",
      category: "Global Markets",
      title: "Global Markets Interconnection",
      prompt: `Analyze interconnections between US, European, and Asian markets. Assess currency impacts, trade relationships, and geopolitical risks. Identify global investment opportunities and add the top 3 to my watchlist with reasoning.`,
      description:
        "Comprehensive global markets analysis with watchlist updates",
      icon: "🌍",
      difficulty: "intermediate",
      estimatedTime: "4-5 min",
      tags: ["global-markets", "currency", "geopolitical", "watchlist"],
    },
    {
      id: "emerging-markets",
      category: "Global Markets",
      title: "Emerging Markets Opportunity",
      prompt: `Evaluate emerging markets investment opportunities considering current valuations, economic growth, and political stability. Compare with developed markets and add the most promising 2-3 emerging market symbols to my watchlist with allocation recommendations.`,
      description: "Emerging markets analysis with watchlist additions",
      icon: "🌱",
      difficulty: "advanced",
      estimatedTime: "4-5 min",
      tags: ["emerging-markets", "valuation", "allocation", "watchlist"],
    },

    // Advanced Trading Strategies Prompts
    {
      id: "options-strategies",
      category: "Advanced Trading",
      title: "Options Strategy Analysis",
      prompt: `Analyze optimal options strategies for ${randomSymbols[0]} based on current implied volatility, upcoming events, and technical levels. Compare covered calls, protective puts, straddles, and iron condors. Provide specific strike prices, expiration dates, and risk/reward profiles.`,
      description:
        "Professional options strategy analysis with specific recommendations",
      icon: "📊",
      difficulty: "advanced",
      estimatedTime: "5-6 min",
      tags: ["options", "volatility", "strategies", "risk-reward"],
    },
    {
      id: "pairs-trading",
      category: "Advanced Trading",
      title: "Pairs Trading Opportunities",
      prompt: `Identify pairs trading opportunities within the ${randomSector} sector. Analyze correlation patterns, spread relationships, and mean reversion potential. Provide specific entry/exit levels, position sizing, and risk management for the most attractive pair.`,
      description: "Statistical arbitrage and pairs trading analysis",
      icon: "⚖️",
      difficulty: "advanced",
      estimatedTime: "4-5 min",
      tags: ["pairs-trading", "arbitrage", "correlation", "mean-reversion"],
    },
    {
      id: "momentum-strategies",
      category: "Advanced Trading",
      title: "Momentum Strategy Screening",
      prompt: `Screen for momentum opportunities across ${randomTech.join(", ")} and similar growth stocks. Analyze price momentum, earnings momentum, and analyst revision trends. Rank opportunities by momentum strength and provide entry strategies with stop-loss levels.`,
      description: "Multi-factor momentum analysis with ranking system",
      icon: "🚀",
      difficulty: "intermediate",
      estimatedTime: "3-4 min",
      tags: ["momentum", "screening", "growth", "rankings"],
    },

    // ESG & Sustainable Investing Prompts
    {
      id: "esg-analysis",
      category: "ESG & Sustainability",
      title: "ESG Investment Opportunities",
      prompt: `Analyze ESG (Environmental, Social, Governance) investment opportunities in clean energy, sustainable technology, and responsible investing. Compare ESG scores, sustainability metrics, and long-term growth potential. Add top 3 ESG leaders to watchlist with investment thesis.`,
      description:
        "Comprehensive ESG analysis with sustainable investment focus",
      icon: "🌿",
      difficulty: "intermediate",
      estimatedTime: "4-5 min",
      tags: ["esg", "sustainability", "clean-energy", "responsible-investing"],
    },
    {
      id: "climate-investing",
      category: "ESG & Sustainability",
      title: "Climate Change Investment Themes",
      prompt: `Identify investment opportunities related to climate change adaptation and mitigation. Analyze renewable energy, carbon capture, electric vehicles, and green infrastructure sectors. Assess policy impacts, technological trends, and provide allocation recommendations.`,
      description: "Climate-focused investment theme analysis",
      icon: "🌍",
      difficulty: "advanced",
      estimatedTime: "5-6 min",
      tags: ["climate-change", "renewable-energy", "green-tech", "policy"],
    },

    // Alternative Investments Prompts
    {
      id: "commodities-analysis",
      category: "Alternative Investments",
      title: "Commodities Market Analysis",
      prompt: `Analyze current commodities market focusing on gold, oil, copper, and agricultural products. Assess supply/demand dynamics, geopolitical impacts, and inflation hedging properties. Provide allocation recommendations and specific commodity ETF selections.`,
      description:
        "Comprehensive commodities analysis with allocation strategy",
      icon: "🥇",
      difficulty: "intermediate",
      estimatedTime: "4-5 min",
      tags: ["commodities", "inflation-hedge", "supply-demand", "etf"],
    },
    {
      id: "reits-analysis",
      category: "Alternative Investments",
      title: "Real Estate Investment Trusts (REITs)",
      prompt: `Evaluate REIT investment opportunities across residential, commercial, and specialized property sectors. Analyze dividend yields, occupancy rates, interest rate sensitivity, and geographic exposure. Recommend top 3 REITs for current market conditions.`,
      description: "Professional REIT analysis with sector diversification",
      icon: "🏢",
      difficulty: "intermediate",
      estimatedTime: "3-4 min",
      tags: ["reits", "real-estate", "dividends", "interest-rates"],
    },

    // Behavioral Finance & Psychology Prompts
    {
      id: "market-psychology",
      category: "Behavioral Finance",
      title: "Market Psychology Analysis",
      prompt: `Analyze current market psychology using fear/greed indicators, sentiment surveys, and behavioral patterns. Identify contrarian opportunities where market sentiment diverges from fundamentals. Provide psychological-based trading strategies and timing recommendations.`,
      description: "Behavioral finance analysis with contrarian opportunities",
      icon: "🧠",
      difficulty: "advanced",
      estimatedTime: "4-5 min",
      tags: ["psychology", "sentiment", "contrarian", "behavioral-finance"],
    },
    {
      id: "cognitive-biases",
      category: "Behavioral Finance",
      title: "Cognitive Bias Impact Assessment",
      prompt: `Assess how cognitive biases (confirmation bias, anchoring, herding) are currently affecting market pricing in ${randomSymbols.join(", ")}. Identify mispriced opportunities created by behavioral inefficiencies and provide rational investment approaches to exploit these biases.`,
      description: "Cognitive bias analysis for investment opportunities",
      icon: "🎭",
      difficulty: "advanced",
      estimatedTime: "5-6 min",
      tags: ["cognitive-biases", "mispricing", "behavioral-inefficiencies"],
    },

    // Fintech & Innovation Prompts
    {
      id: "fintech-disruption",
      category: "Fintech & Innovation",
      title: "Fintech Disruption Analysis",
      prompt: `Analyze fintech disruption trends in payments, lending, wealth management, and blockchain technology. Evaluate traditional financial institutions vs fintech challengers. Identify investment opportunities in digital transformation and add promising fintech stocks to watchlist.`,
      description: "Fintech disruption analysis with investment opportunities",
      icon: "💳",
      difficulty: "intermediate",
      estimatedTime: "4-5 min",
      tags: ["fintech", "disruption", "digital-transformation", "blockchain"],
    },
    {
      id: "ai-investment-themes",
      category: "Fintech & Innovation",
      title: "AI Investment Themes Analysis",
      prompt: `Analyze artificial intelligence investment themes including machine learning, natural language processing, computer vision, and robotics. Evaluate AI adoption across industries, identify leading AI companies, and assess the competitive landscape. Provide investment recommendations for AI-focused ETFs and individual stocks with growth potential.`,
      description:
        "Comprehensive AI investment theme analysis with stock picks",
      icon: "🤖",
      difficulty: "advanced",
      estimatedTime: "5-6 min",
      tags: [
        "artificial-intelligence",
        "machine-learning",
        "robotics",
        "innovation",
      ],
    },

    // Healthcare & Biotech Prompts
    {
      id: "biotech-pipeline",
      category: "Healthcare & Biotech",
      title: "Biotech Pipeline Analysis",
      prompt: `Evaluate biotech companies with promising drug pipelines focusing on oncology, rare diseases, and breakthrough therapies. Analyze clinical trial data, FDA approval timelines, and market potential. Assess risk-reward profiles and identify biotech stocks with significant upside potential for watchlist addition.`,
      description: "Biotech pipeline analysis with clinical trial assessment",
      icon: "🧬",
      difficulty: "advanced",
      estimatedTime: "5-6 min",
      tags: ["biotech", "pharmaceuticals", "clinical-trials", "fda-approval"],
    },
    {
      id: "healthcare-innovation",
      category: "Healthcare & Biotech",
      title: "Healthcare Innovation Trends",
      prompt: `Analyze healthcare innovation trends including telemedicine, digital health, medical devices, and personalized medicine. Evaluate the impact of aging demographics, healthcare costs, and technological advancement. Identify investment opportunities in healthcare technology and add top healthcare innovation stocks to watchlist.`,
      description: "Healthcare innovation analysis with demographic trends",
      icon: "🏥",
      difficulty: "intermediate",
      estimatedTime: "4-5 min",
      tags: ["healthcare", "telemedicine", "medical-devices", "demographics"],
    },

    // Energy Transition Prompts
    {
      id: "energy-transition",
      category: "Energy & Utilities",
      title: "Energy Transition Investment Strategy",
      prompt: `Analyze the global energy transition from fossil fuels to renewable energy sources. Evaluate solar, wind, battery storage, and hydrogen technologies. Assess policy impacts, technological advancement, and cost competitiveness. Provide investment recommendations for clean energy ETFs and individual stocks in the energy transition space.`,
      description: "Comprehensive energy transition investment analysis",
      icon: "⚡",
      difficulty: "advanced",
      estimatedTime: "5-6 min",
      tags: [
        "renewable-energy",
        "solar",
        "wind",
        "battery-storage",
        "hydrogen",
      ],
    },
    {
      id: "utility-modernization",
      category: "Energy & Utilities",
      title: "Utility Sector Modernization",
      prompt: `Evaluate utility sector modernization including smart grid technology, energy storage, and distributed energy resources. Analyze regulatory changes, infrastructure investment needs, and dividend sustainability. Identify utility companies leading the modernization effort and assess their investment potential for income-focused portfolios.`,
      description: "Utility sector modernization with dividend analysis",
      icon: "🔌",
      difficulty: "intermediate",
      estimatedTime: "4-5 min",
      tags: ["utilities", "smart-grid", "infrastructure", "dividends"],
    },
  ];

  // Add time-sensitive context to prompts
  return basePrompts.map((prompt) => ({
    ...prompt,
    prompt: addTimeContext(prompt.prompt, context),
    title: addTimeContext(prompt.title, context, true),
  }));
}

// Add time-sensitive context to prompts
function addTimeContext(
  text: string,
  context: any,
  isTitle: boolean = false,
): string {
  if (isTitle) {
    if (context.isMarketHours) {
      return `${text} (Live Markets)`;
    } else if (context.isWeekend) {
      return `${text} (Weekend Analysis)`;
    } else {
      return `${text} (After Hours)`;
    }
  }

  let contextualText = text;

  if (context.isMarketHours) {
    contextualText +=
      " Focus on real-time market movements and intraday patterns.";
  } else if (context.isWeekend) {
    contextualText +=
      " Provide strategic analysis for the upcoming trading week.";
  } else {
    contextualText +=
      " Include after-hours developments and overnight market influences.";
  }

  return contextualText;
}

// Get prompts by category
export function getPromptsByCategory(category: string): DynamicPrompt[] {
  return generateDynamicPrompts().filter(
    (prompt) => prompt.category === category,
  );
}

// Get prompts by difficulty
export function getPromptsByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced",
): DynamicPrompt[] {
  return generateDynamicPrompts().filter(
    (prompt) => prompt.difficulty === difficulty,
  );
}

// Get random prompts
export function getRandomPrompts(count: number = 5): DynamicPrompt[] {
  const allPrompts = generateDynamicPrompts();
  return getRandomItems(allPrompts, count);
}

// Get prompt categories
export function getPromptCategories(): string[] {
  const prompts = generateDynamicPrompts();
  return [...new Set(prompts.map((p) => p.category))];
}

// Search prompts by tags or keywords
export function searchPrompts(query: string): DynamicPrompt[] {
  const allPrompts = generateDynamicPrompts();
  const lowerQuery = query.toLowerCase();

  return allPrompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(lowerQuery) ||
      prompt.description.toLowerCase().includes(lowerQuery) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      prompt.category.toLowerCase().includes(lowerQuery),
  );
}
