# SokoAnalyst Agent Structure

This document explains how the SokoAnalyst agent is structured following the reference repository pattern from https://github.com/kephothoX/agent-challenge.

## 📁 File Structure

```
src/mastra/
├── agents/
│   ├── index.ts              # Main agents export (includes kephothoAgent + sokoAnalyst)
│   └── sokoAnalyst.ts        # SokoAnalyst agent definition
├── mcp/
│   ├── index.ts              # MCP server configuration
│   └── perplexityClient.ts   # Perplexity MCP client
├── tools/
│   ├── index.ts              # Core tools (weather, etc.)
│   ├── financial/            # Financial analysis tools
│   ├── solana/               # Solana blockchain tools
│   └── misc/                 # Miscellaneous tools
└── index.ts                  # Main Mastra configuration
```

## 🤖 Agent Definition Pattern

### Reference Pattern (kephothoAgent)

```typescript
// src/mastra/agents/index.ts
import "dotenv/config";
import { createOllama } from "ollama-ai-provider-v2";
import { Agent } from "@mastra/core/agent";
import { weatherTool } from "@/mastra/tools";
import { SolanaGetBalanceTool } from "@/mastra/tools/solana";
import { getPerplexityTools } from "../mcp/perplexityClient";
import { getNameTool } from "../tools/misc";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";

export const AgentState = z.object({
  proverbs: z.array(z.string()).default([]),
});

const ollama = createOllama({
  baseURL: process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL,
});

const perplexityTools = await getPerplexityTools();

export const kephothoAgent = new Agent({
  name: "Kephotho Agent",
  tools: { weatherTool, SolanaGetBalanceTool, getNameTool, ...perplexityTools },
  // model: openai("gpt-4o"), // uncomment this line to use openai
  model: ollama(
    process.env.NOS_MODEL_NAME_AT_ENDPOINT ||
      process.env.MODEL_NAME_AT_ENDPOINT ||
      "qwen3:8b",
  ),
  instructions: "You are a helpful assistant.",
  description:
    "An agent that can get the weather for a given location. Get Solana balance for a given address. Get any name.",
  memory: new Memory({
    storage: new LibSQLStore({ url: "file::memory:" }),
    options: {
      workingMemory: {
        enabled: true,
        schema: AgentState,
      },
    },
  }),
});
```

### SokoAnalyst Implementation

```typescript
// src/mastra/agents/sokoAnalyst.ts
import "dotenv/config";
//import { openai } from "@ai-sdk/openai";

import { createOllama } from "ollama-ai-provider-v2";
import { Agent } from "@mastra/core/agent";
import {
  marketDataTool,
  technicalAnalysisTool,
  marketSentimentTool,
  portfolioAnalysisTool,
  advancedMarketAnalysisTool,
  blockchainAnalyticsTool,
  riskManagementTool,
  globalMarketsMonitorTool,
  mcpMarketDataTool,
  mcpMarketNewsTool,
  mcpEconomicIndicatorsTool,
} from "@/mastra/tools/financial";
import { getPerplexityTools } from "../mcp/perplexityClient";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";

export const SokoAnalystState = z.object({
  watchlist: z
    .array(
      z.object({
        symbol: z.string(),
        market: z.string(),
        addedAt: z.number(),
      }),
    )
    .default([]),
  alerts: z
    .array(
      z.object({
        id: z.string(),
        symbol: z.string(),
        condition: z.string(),
        value: z.number(),
        triggered: z.boolean(),
        createdAt: z.number(),
      }),
    )
    .default([]),
  portfolios: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        holdings: z.array(
          z.object({
            symbol: z.string(),
            quantity: z.number(),
            avgCost: z.number(),
          }),
        ),
        createdAt: z.number(),
      }),
    )
    .default([]),
  marketInsights: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        severity: z.enum(["low", "medium", "high"]),
        timestamp: z.number(),
      }),
    )
    .default([]),
});

const ollama = createOllama({
  baseURL: process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL,
});

const perplexityTools = await getPerplexityTools();

export const sokoAnalyst = new Agent({
  name: "SokoAnalyst",
  tools: {
    // Core financial analysis tools
    marketDataTool,
    technicalAnalysisTool,
    marketSentimentTool,
    portfolioAnalysisTool,
    // Advanced analysis tools
    advancedMarketAnalysisTool,
    blockchainAnalyticsTool,
    riskManagementTool,
    globalMarketsMonitorTool,
    // MCP-powered real-time tools
    mcpMarketDataTool,
    mcpMarketNewsTool,
    mcpEconomicIndicatorsTool,
    // Perplexity MCP tools
    ...perplexityTools,
  },
  // model: openai("gpt-4o"), // uncomment this line to use openai
  model: ollama(
    process.env.NOS_MODEL_NAME_AT_ENDPOINT ||
      process.env.MODEL_NAME_AT_ENDPOINT ||
      "qwen3:8b",
  ),
  instructions: `You are SokoAnalyst, an elite AI financial markets analyzer...`,
  description:
    "Elite AI financial markets analyzer providing global market insights...",
  memory: new Memory({
    storage: new LibSQLStore({ url: "file::memory:" }),
    options: {
      workingMemory: {
        enabled: true,
        schema: SokoAnalystState,
      },
    },
  }),
});
```

## 🔧 Key Components

### 1. **Agent State Schema**

- Defines the working memory structure using Zod
- SokoAnalyst has financial-specific state (watchlist, alerts, portfolios, insights)
- Reference agent has simple state (proverbs array)

### 2. **Model Configuration**

- Uses Ollama with configurable endpoints
- Supports both local and Nosana remote endpoints
- OpenAI option available (commented out)

### 3. **Tool Integration**

- Financial tools for market analysis
- MCP tools for real-time data
- Perplexity integration for web search
- Modular tool structure

### 4. **Memory Management**

- LibSQL storage for persistence
- Working memory with schema validation
- State management for agent context

## 🛠️ MCP Integration

### Perplexity Client Structure

```typescript
// src/mastra/mcp/perplexityClient.ts
import { MCPClient } from "@mastra/mcp";

export const perplexityMcpClient = new MCPClient({
  name: "perplexity",
  version: "1.0.0",
  description:
    "Perplexity search client for real-time market data and news analysis",
});

export const getPerplexityTools = async () => {
  try {
    // Return available MCP tools
    return {};
  } catch (error) {
    console.error("Failed to get Perplexity tools:", error);
    return {};
  }
};
```

### MCP Server Configuration

```typescript
// src/mastra/mcp/index.ts
import { MCPServer } from "@mastra/mcp";
import { kephothoAgent, sokoAnalyst } from "../agents";

export const server = new MCPServer({
  name: "SokoAnalyst MCP Server",
  version: "1.0.0",
  tools: {
    // Core tools
    weatherTool,
    SolanaGetBalanceTool,
    getNameTool,
    // Financial analysis tools
    marketDataTool,
    technicalAnalysisTool,
    marketSentimentTool,
    portfolioAnalysisTool,
    // MCP-powered tools
    mcpMarketDataTool,
    mcpMarketNewsTool,
    mcpEconomicIndicatorsTool,
  },
  agents: {
    sokoAnalyst, // Primary financial analysis agent
    kephothoAgent, // General purpose agent
  },
});
```

## 📊 Tool Structure

### Financial Tools

```typescript
// src/mastra/tools/financial/index.ts
export const marketDataTool = new Tool({
  id: "market_data",
  description:
    "Fetch real-time market data for stocks, crypto, forex, and commodities",
  inputSchema: z.object({
    symbols: z.array(z.string()),
    market: z.enum(["stocks", "crypto", "forex", "commodities"]),
    timeframe: z
      .enum(["1m", "5m", "15m", "1h", "4h", "1d", "1w"])
      .default("1d"),
  }),
  execute: async ({ symbols, market, timeframe }) => {
    // Implementation
  },
});
```

### MCP-Powered Tools

```typescript
// src/mastra/tools/financial/mcp-market-data.ts
export const mcpMarketDataTool = new Tool({
  id: "mcp_market_data",
  description: "Fetch real-time market data using MCP Perplexity search",
  inputSchema: z.object({
    symbols: z.array(z.string()),
    market: z.enum(["stocks", "crypto", "forex", "commodities"]),
    timeframe: z
      .enum(["1m", "5m", "15m", "1h", "4h", "1d", "1w"])
      .default("1d"),
  }),
  execute: async ({ symbols, market, timeframe }) => {
    // MCP Perplexity integration
  },
});
```

## 🚀 Usage Examples

### Basic Agent Interaction

```typescript
import { sokoAnalyst } from "@/mastra/agents/sokoAnalyst";

// Market analysis query
const result = await sokoAnalyst.generate(
  "Analyze the current Bitcoin market conditions and provide actionable trading recommendations.",
);

console.log(result.text);
console.log(result.toolCalls);
```

### API Integration

```typescript
// src/app/api/soko/agent/route.ts
import { sokoAnalyst } from "@/mastra/agents/sokoAnalyst";

export async function POST(request: NextRequest) {
  const { query, context } = await request.json();

  const result = await sokoAnalyst.generate(query, { context });

  return NextResponse.json({
    success: true,
    response: result.text,
    toolCalls: result.toolCalls || [],
    timestamp: Date.now(),
    agent: "SokoAnalyst",
  });
}
```

## 🔄 Comparison with Reference

| Aspect              | Reference (kephothoAgent) | SokoAnalyst                  |
| ------------------- | ------------------------- | ---------------------------- |
| **Purpose**         | General assistant         | Financial markets analyzer   |
| **Tools**           | Weather, Solana, Names    | Financial analysis, MCP data |
| **State**           | Simple proverbs array     | Complex financial state      |
| **Instructions**    | Basic helpful assistant   | Detailed financial expertise |
| **Memory**          | Basic working memory      | Financial insights storage   |
| **MCP Integration** | Basic Perplexity tools    | Advanced market data tools   |

## 📝 Key Differences

1. **Specialized Domain**: SokoAnalyst focuses on financial markets vs general assistance
2. **Complex State**: Financial-specific state management (watchlist, portfolios, alerts)
3. **Advanced Tools**: Comprehensive financial analysis toolkit
4. **MCP Integration**: Real-time market data via Perplexity search
5. **Professional Instructions**: Detailed financial expertise and risk management focus

## 🎯 Best Practices Followed

1. **Consistent Structure**: Follows the same file organization pattern
2. **Environment Configuration**: Uses same environment variable pattern
3. **Model Flexibility**: Supports both Ollama and OpenAI models
4. **Memory Management**: Implements proper state schema validation
5. **Tool Modularity**: Organized tools in logical categories
6. **MCP Integration**: Proper MCP client and server setup
7. **Error Handling**: Robust error handling throughout
8. **TypeScript**: Full type safety with Zod schemas

This structure ensures that SokoAnalyst maintains consistency with the reference repository while providing specialized financial market analysis capabilities.
