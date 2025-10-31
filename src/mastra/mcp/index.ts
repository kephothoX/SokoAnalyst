import { MCPServer } from "@mastra/mcp";
import { weatherTool } from "../tools";
import { SolanaGetBalanceTool } from "../tools/solana";
import { getNameTool } from "../tools/misc";
import {
  mcpMarketDataTool,
  mcpMarketNewsTool,
  mcpEconomicIndicatorsTool,
  marketDataTool,
  technicalAnalysisTool,
  marketSentimentTool,
} from "../tools/financial";

import { sokoAnalyst } from "../agents";

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
    // MCP-powered tools
    mcpMarketDataTool,
    mcpMarketNewsTool,
    mcpEconomicIndicatorsTool,
  },
  agents: {
    sokoAnalyst, // Primary financial analysis agent
  },
  // workflows: {
  // dataProcessingWorkflow, // this workflow will become tool "run_dataProcessingWorkflow"
  // }
});
