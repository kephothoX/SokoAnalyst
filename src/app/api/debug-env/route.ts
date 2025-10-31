import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const envInfo = {
      // Ollama configuration
      hasOllamaUrl: !!(
        process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL
      ),
      ollamaUrl:
        process.env.NOS_OLLAMA_API_URL ||
        process.env.OLLAMA_API_URL ||
        "not set",
      modelName:
        process.env.NOS_MODEL_NAME_AT_ENDPOINT ||
        process.env.MODEL_NAME_AT_ENDPOINT ||
        "not set",

      // OpenAI configuration
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      openAIKeySet: process.env.OPENAI_API_KEY ? "set" : "not set",

      // Perplexity configuration
      hasPerplexityKey: !!process.env.PERPLEXITY_API_KEY,
      perplexityKeySet: process.env.PERPLEXITY_API_KEY ? "set" : "not set",

      // Node environment
      nodeEnv: process.env.NODE_ENV || "not set",

      // Recommended configuration
      recommendation: getRecommendation(),
    };

    return NextResponse.json(envInfo);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check environment",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

function getRecommendation() {
  const hasOllama = !!(
    process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL
  );
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasPerplexity = !!process.env.PERPLEXITY_API_KEY;

  if (!hasOllama && !hasOpenAI) {
    return "❌ No AI model configured. Set OPENAI_API_KEY or configure Ollama with NOS_OLLAMA_API_URL/OLLAMA_API_URL";
  }

  if (!hasPerplexity) {
    return "⚠️ PERPLEXITY_API_KEY not set. Real-time market data will use fallback data.";
  }

  if (hasOpenAI && hasPerplexity) {
    return "✅ Optimal configuration: OpenAI + Perplexity for best performance";
  }

  if (hasOllama && hasPerplexity) {
    return "✅ Good configuration: Ollama + Perplexity (ensure Ollama server is running)";
  }

  return "⚠️ Partial configuration detected";
}
