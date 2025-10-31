import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { sokoAnalyst } from "./agents/sokoAnalyst-simple";
// SokoAnalyst is imported via the MCP server
import { ConsoleLogger, LogLevel } from "@mastra/core/logger";
import { server } from "./mcp";

const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) || "info";

export const mastra = new Mastra({
  agents: {
    sokoAnalyst, // Primary financial analysis agent
  },
  mcpServers: {
    server,
  },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new ConsoleLogger({
    level: LOG_LEVEL,
  }),
});
