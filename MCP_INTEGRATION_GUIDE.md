# MCP Integration Guide for SokoAnalyst

## Overview

This guide shows how to integrate Model Context Protocol (MCP) servers to get real-time market data instead of using traditional APIs.

## MCP Configuration

### Configured Servers

- **Perplexity**: Real-time web search for market data, news, and analysis
- **Fetch**: HTTP requests for API endpoints
- **Filesystem**: File operations (already working)

### Configuration Files

- Workspace: `.kiro/settings/mcp.json`
- User-level: `~/.kiro/settings/mcp.json`

## New MCP-Powered Tools

### 1. mcpMarketDataTool

```typescript
// Usage in agent
const marketData = await mcpMarketDataTool.execute({
  symbols: ["AAPL", "BTC-USD", "EUR/USD"],
  market: "stocks",
  timeframe: "1d",
});
```

### 2. mcpMarketNewsTool

```typescript
// Get latest news and sentiment
const news = await mcpMarketNewsTool.execute({
  symbols: ["AAPL"],
  newsType: "breaking",
  timeRange: "24h",
});
```

### 3. mcpEconomicIndicatorsTool

```typescript
// Get economic indicators
const indicators = await mcpEconomicIndicatorsTool.execute({
  indicators: ["GDP", "CPI", "unemployment"],
  countries: ["US", "EU"],
  timeframe: "latest",
});
```

## Integration Steps

### Step 1: Restart Kiro

Restart Kiro to load the new MCP configuration.

### Step 2: Verify MCP Servers

1. Open Kiro feature panel
2. Go to MCP Server view
3. Verify all servers are connected and running

### Step 3: Test MCP Tools

Use the command palette to test MCP tools or run them in your agent.

### Step 4: Replace Mock Data

The market data route (`src/app/api/soko/market-data/route.ts`) has been updated to use MCP tools with fallback to mock data.

## Actual MCP Integration

To complete the integration, you need to replace the placeholder functions in `src/mastra/tools/financial/mcp-market-data.ts`:

### Replace mcpPerplexitySearch function:

```typescript
export async function mcpPerplexitySearch(query: string): Promise<any> {
  // Use actual MCP call - this depends on your MCP client setup
  // Example structure:
  return await mcp.call("perplexity", "search", {
    query,
    max_results: 5,
    include_sources: true,
  });
}
```

### Update search functions:

Replace the mock implementations in:

- `searchMarketData()`
- `searchMarketNews()`
- `searchEconomicData()`

With actual MCP calls and proper parsing of the returned data.

## Benefits of MCP Integration

1. **Real-time Data**: Get current market prices and news
2. **No API Limits**: Avoid rate limits of traditional APIs
3. **Comprehensive Coverage**: Access to web-scale information
4. **Cost Effective**: Reduce API costs
5. **Flexible Queries**: Natural language queries for complex data

## Example Queries

### Market Data Queries

- "AAPL current stock price today real time quote"
- "Bitcoin BTC price USD latest cryptocurrency market"
- "EUR/USD exchange rate forex current"

### News Queries

- "Apple AAPL earnings news today market sentiment"
- "Bitcoin cryptocurrency news last 24 hours"
- "Federal Reserve interest rate decision news"

### Economic Data Queries

- "US GDP growth rate latest quarterly data"
- "inflation rate CPI United States current"
- "unemployment rate statistics latest"

## Troubleshooting

### MCP Server Not Connected

1. Check `.kiro/settings/mcp.json` configuration
2. Verify API keys in environment variables
3. Restart Kiro
4. Check MCP Server view for error messages

### Perplexity API Issues

1. Verify `PERPLEXITY_API_KEY` in `.env` file
2. Check API key validity and quota
3. Test with simple queries first

### Data Parsing Issues

1. Review search result structure
2. Update parsing functions in `mcp-market-data.ts`
3. Add error handling for malformed data

## Next Steps

1. **Complete MCP Integration**: Replace placeholder functions with actual MCP calls
2. **Enhance Parsing**: Improve data extraction from search results
3. **Add Caching**: Cache MCP results to reduce API calls
4. **Error Handling**: Add robust error handling and fallbacks
5. **Testing**: Create comprehensive tests for MCP tools

## File Structure

```
src/mastra/tools/financial/
├── index.ts                 # Main exports
├── advanced.ts             # Advanced analysis tools
└── mcp-market-data.ts      # New MCP-powered tools

src/app/api/soko/
└── market-data/route.ts    # Updated to use MCP tools

.kiro/settings/
└── mcp.json               # MCP server configuration
```

This integration provides a foundation for real-time market data using MCP. The next step is to implement the actual MCP calls and data parsing logic.
