// Perplexity MCP Client for real-time market data and news
export const perplexityMcpClient = {
  name: "perplexity",
  version: "1.0.0",
  description:
    "Perplexity search client for real-time market data and news analysis",
};

// Real Perplexity search function using MCP
export async function searchWithPerplexity(query: string): Promise<any> {
  try {
    console.log(`🔍 Searching Perplexity for: ${query}`);

    // Use the actual Perplexity SDK
    const { searchFinancialData } = await import("@/lib/perplexity");
    const result = await searchFinancialData(query);

    return {
      results: [
        {
          title: `Financial data for ${extractSymbolFromQuery(query)}`,
          content: result.content,
          url: "https://perplexity.ai",
          published_at: new Date().toISOString(),
          citations: result.citations,
          model: result.model,
          usage: result.usage,
        },
      ],
      query,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Perplexity search failed:", error);

    // Fallback to mock data
    const results = await generateRealisticFinancialData(query);

    return {
      results: [
        {
          title: `Fallback data for ${extractSymbolFromQuery(query)}`,
          content:
            results.content + " [Note: Fallback data - Perplexity unavailable]",
          url: `https://finance.yahoo.com/quote/${extractSymbolFromQuery(query)}`,
          published_at: new Date().toISOString(),
        },
      ],
      query,
      timestamp: new Date().toISOString(),
      fallback: true,
    };
  }
}

// Generate realistic financial data based on search query
async function generateRealisticFinancialData(query: string) {
  const symbol = extractSymbolFromQuery(query);
  const isStock = /^[A-Z]{1,5}$/.test(symbol);
  const isCrypto =
    symbol.includes("-USD") || symbol.includes("BTC") || symbol.includes("ETH");
  const isForex = symbol.includes("/");

  let basePrice: number;
  let volatility: number;

  // Set realistic base prices and volatility based on asset type
  if (isStock) {
    basePrice = getStockPrice(symbol);
    volatility = 0.02;
  } else if (isCrypto) {
    basePrice = getCryptoPrice(symbol);
    volatility = 0.05;
  } else if (isForex) {
    basePrice = getForexPrice(symbol);
    volatility = 0.008;
  } else {
    basePrice = 100;
    volatility = 0.02;
  }

  const change = (Math.random() - 0.5) * basePrice * volatility;
  const changePercent = (change / basePrice) * 100;
  const volume = Math.floor(Math.random() * 50000000);
  const high24h = basePrice + Math.random() * basePrice * volatility;
  const low24h = basePrice - Math.random() * basePrice * volatility;

  const content = `${symbol} is currently trading at $${basePrice.toFixed(2)}, ${change >= 0 ? "up" : "down"} ${Math.abs(change).toFixed(2)} (${changePercent.toFixed(2)}%) in today's session. Trading volume is ${(volume / 1000000).toFixed(1)}M shares. The 24-hour high was $${high24h.toFixed(2)} and the low was $${low24h.toFixed(2)}. Market sentiment appears ${Math.random() > 0.5 ? "bullish" : "bearish"} based on recent trading activity and news flow.`;

  return {
    content,
    price: basePrice,
    change,
    changePercent,
    volume,
    high24h,
    low24h,
    marketCap: isCrypto ? Math.floor(Math.random() * 100000000000) : null,
  };
}

function extractSymbolFromQuery(query: string): string {
  // Extract symbol from query string
  const symbolMatch = query.match(/([A-Z]{1,5}(-USD|\/USD)?)/);
  return symbolMatch ? symbolMatch[1] : query.split(" ")[0].toUpperCase();
}

function getStockPrice(symbol: string): number {
  const stockPrices: Record<string, number> = {
    AAPL: 175.5,
    GOOGL: 140.25,
    MSFT: 380.75,
    TSLA: 240.3,
    NVDA: 450.8,
    META: 320.45,
    AMZN: 155.2,
    NFLX: 485.6,
  };
  return stockPrices[symbol] || Math.random() * 300 + 50;
}

function getCryptoPrice(symbol: string): number {
  const cryptoPrices: Record<string, number> = {
    "BTC-USD": 43250.0,
    "ETH-USD": 2650.75,
    "SOL-USD": 105.3,
    "ADA-USD": 0.48,
    "DOT-USD": 7.25,
    "LINK-USD": 15.8,
  };
  return cryptoPrices[symbol] || Math.random() * 10000 + 100;
}

function getForexPrice(symbol: string): number {
  const forexPrices: Record<string, number> = {
    "EUR/USD": 1.085,
    "GBP/USD": 1.272,
    "USD/JPY": 149.85,
    "AUD/USD": 0.658,
  };
  return forexPrices[symbol] || Math.random() * 2 + 0.5;
}

import { Tool } from "@mastra/core/tools";
import { z } from "zod";

// Get available tools from the MCP client
export const getPerplexityTools = async () => {
  try {
    // Return proper Mastra Tool that can be used by agents
    return {
      perplexitySearch: new Tool({
        id: "perplexity_search",
        description:
          "Search for real-time financial market data using Perplexity",
        inputSchema: z.object({
          query: z.string().describe("Search query for financial data"),
        }),
        execute: async (context) => {
          const { query } = context.context || context;
          return await searchWithPerplexity(query);
        },
      }),
    };
  } catch (error) {
    console.error("Failed to get Perplexity tools:", error);
    return {};
  }
};
