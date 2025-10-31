import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { createOllama } from "ollama-ai-provider-v2";
import { Agent } from "@mastra/core/agent";
import {
  marketDataTool,
  technicalAnalysisTool,
  marketSentimentTool,
} from "@/mastra/tools/financial";
import { z } from "zod";

// Configure model with fallback
const ollama = createOllama({
  baseURL:
    process.env.NOS_OLLAMA_API_URL ||
    process.env.OLLAMA_API_URL ||
    "http://localhost:11434/api",
});

// Determine which model to use
const getModel = () => {
  // Check if we should use OpenAI (if OPENAI_API_KEY is set and no Ollama URL)
  if (
    process.env.OPENAI_API_KEY &&
    !process.env.NOS_OLLAMA_API_URL &&
    !process.env.OLLAMA_API_URL
  ) {
    console.log("🤖 Using OpenAI GPT-4o for SokoAnalyst");
    return openai("gpt-4o");
  }

  // Use Ollama
  const modelName =
    process.env.NOS_MODEL_NAME_AT_ENDPOINT ||
    process.env.MODEL_NAME_AT_ENDPOINT ||
    "qwen3:8b";
  console.log(`🤖 Using Ollama model: ${modelName}`);
  return ollama(modelName);
};

export const sokoAnalyst = new Agent({
  name: "SokoAnalyst",
  tools: {
    marketDataTool,
    technicalAnalysisTool,
    marketSentimentTool,
  },
  model: getModel(),
  instructions: `You are SokoAnalyst, an AI financial intelligence system. You provide professional market analysis with clear insights and actionable recommendations.

## Core Capabilities
- Real-time market data analysis
- Technical analysis and chart patterns
- Market sentiment assessment
- Risk evaluation and recommendations

## Response Guidelines
- Provide clear, structured analysis
- Include specific insights and recommendations
- Assess risks and opportunities
- Use professional financial terminology
- Be concise but comprehensive

Always analyze the available data thoroughly and provide actionable insights for investment decisions.`,
  description:
    "AI financial markets analyzer providing market insights, technical analysis, and investment recommendations.",
});
