"use client";

import React, { useState } from "react";
import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { SokoAnalystInterface } from "@/components/SokoAnalystInterface";
import { DynamicPrompts } from "@/components/DynamicPrompts";
import { z } from "zod";

// Simple state type for the agent
const SokoAnalystState = z.object({
  watchlist: z.array(z.object({
    symbol: z.string(),
    market: z.string(),
    addedAt: z.number(),
  })).default([]),
  alerts: z.array(z.object({
    id: z.string(),
    symbol: z.string(),
    condition: z.string(),
    value: z.number(),
    triggered: z.boolean(),
    createdAt: z.number(),
  })).default([]),
  marketInsights: z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    severity: z.enum(["low", "medium", "high"]),
    timestamp: z.number(),
  })).default([]),
});

type AgentState = z.infer<typeof SokoAnalystState>;

export default function SokoAnalystPage() {
  const [themeColor, setThemeColor] = useState("#1e40af");

  // Debug: Check if CopilotKit is properly initialized
  React.useEffect(() => {
    console.log("🔍 SokoAnalyst page loaded");
    console.log("🔍 CopilotKit runtime URL: /api/copilotkit");
    console.log("🔍 Agent: sokoAnalyst");

    // Test the CopilotKit API connection
    fetch('/api/test-copilot')
      .then(res => res.json())
      .then(data => {
        console.log("🔍 CopilotKit test result:", data);
        if (data.success) {
          console.log("✅ Agent is working:", data.agentTools?.length, "tools available");
        } else {
          console.error("❌ Agent test failed:", data.error);
        }
      })
      .catch(err => {
        console.error("❌ Failed to test CopilotKit:", err);
      });
  }, []);

  // 🪁 Frontend Actions for SokoAnalyst
  useCopilotAction({
    name: "setThemeColor",
    parameters: [{
      name: "themeColor",
      description: "The theme color to set for the financial dashboard.",
      required: true,
    }],
    handler({ themeColor }) {
      setThemeColor(themeColor);
    },
  });

  return (
    <main style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}>
      <SokoAnalystMainContent themeColor={themeColor} />
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "SokoAnalyst Intelligence",
          initial: "🏛️ **Welcome to SokoAnalyst** - Your Institutional-Grade Financial Intelligence Platform\n\n**Core Capabilities:**\n\n📊 **Market Intelligence**\n• Real-time market data and analysis\n• Multi-asset coverage (Equities, Crypto, FX, Commodities)\n• Advanced technical and fundamental analysis\n\n🧠 **AI-Powered Reasoning**\n• Perplexity Sonar-Reasoning integration\n• Step-by-step analytical methodology\n• Risk-adjusted investment recommendations\n\n💼 **Professional Tools**\n• Portfolio optimization and risk management\n• Economic indicators and macro analysis\n• Sentiment analysis with institutional insights\n\n**Sample Queries:**\n• \"Provide comprehensive analysis of AAPL with reasoning\"\n• \"Analyze current market sentiment for tech sector\"\n• \"What are the key risks in today's market environment?\"\n• \"Compare TSLA vs traditional automakers fundamentally\"\n\n*Powered by advanced AI reasoning for institutional-quality insights*"
        }}
      />
    </main>
  );
}

function SokoAnalystMainContent({ themeColor }: { themeColor: string }) {
  // 🪁 Shared State for SokoAnalyst
  const { state, setState } = useCoAgent<AgentState>({
    name: "sokoAnalyst",
    initialState: {
      watchlist: [],
      alerts: [],
      portfolios: [],
      marketInsights: [],
    },
  })

  // Smart analysis action handlers (moved from parent component)
  const executeSmartAnalysis = (analysisType: string) => {
    const smartPrompts = {
      'market-intelligence': 'Provide a comprehensive market intelligence analysis covering current market conditions, major indices performance, sector rotations, and key market drivers. Include risk assessment, volatility analysis, and institutional positioning. Focus on actionable insights for professional investors.',
      'ai-reasoning': 'Use advanced AI reasoning to analyze current market trends and predict potential movements over the next 1-3 months. Apply step-by-step analytical methodology including technical indicators, sentiment analysis, macro factors, and probability-weighted scenarios with confidence intervals.',
      'portfolio-management': 'Design an optimal portfolio allocation strategy for current market conditions. Analyze asset allocation across equities, bonds, commodities, and alternatives. Include risk-adjusted return expectations, correlation analysis, and rebalancing guidelines. Provide specific allocation percentages and risk management strategies.'
    };

    const prompt = smartPrompts[analysisType as keyof typeof smartPrompts];
    if (prompt) {
      console.log(`🎯 Executing smart analysis: ${analysisType}`);

      // Copy prompt to clipboard for CopilotKit sidebar
      navigator.clipboard.writeText(prompt).then(() => {
        // Show enhanced notification
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div class="fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce">
            <div class="flex items-center space-x-2">
              <span class="text-xl">🎯</span>
              <div>
                <div class="font-semibold">${analysisType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Analysis Ready!</div>
                <div class="text-sm opacity-90">Paste in chat sidebar to execute →</div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(notification);

        // Remove notification after 4 seconds
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 4000);
      }).catch(err => {
        console.error('Failed to copy smart analysis prompt:', err);
      });
    }
  };

  // 🪁 Market Data Tool UI
  useCopilotAction({
    name: "mcpMarketDataTool",
    description: "Fetch real-time market data using MCP",
    available: "frontend",
    parameters: [
      { name: "symbols", type: "string[]", required: true },
      { name: "market", type: "string", required: true },
      { name: "timeframe", type: "string", required: false },
    ],
    render: ({ args, result, status }: { args: any, result: any, status: "inProgress" | "executing" | "complete" }) => {
      return <MarketDataCard
        symbols={args.symbols}
        market={args.market}
        themeColor={themeColor}
        result={result}
        status={status}
      />
    },
  });

  // 🪁 Technical Analysis Tool UI
  useCopilotAction({
    name: "technicalAnalysisTool",
    description: "Perform technical analysis on market data",
    available: "frontend",
    parameters: [
      { name: "symbol", type: "string", required: true },
      { name: "indicators", type: "string[]", required: true },
    ],
    render: ({ args, result, status }: { args: any, result: any, status: "inProgress" | "executing" | "complete" }) => {
      return <TechnicalAnalysisCard
        symbol={args.symbol}
        indicators={args.indicators}
        themeColor={themeColor}
        result={result}
        status={status}
      />
    },
  });

  // 🪁 Portfolio Analysis Tool UI
  useCopilotAction({
    name: "portfolioAnalysisTool",
    description: "Analyze portfolio performance and risk",
    available: "frontend",
    parameters: [
      { name: "holdings", type: "object[]", required: true },
    ],
    render: ({ args, result, status }: { args: any, result: any, status: "inProgress" | "executing" | "complete" }) => {
      return <PortfolioAnalysisCard
        holdings={args.holdings}
        themeColor={themeColor}
        result={result}
        status={status}
      />
    },
  });

  // 🪁 Perplexity Reasoning Analysis Tool UI
  useCopilotAction({
    name: "perplexity_reasoning_analysis",
    description: "Perform advanced financial analysis using Perplexity Sonar-Reasoning",
    available: "frontend",
    parameters: [
      { name: "symbols", type: "string[]", required: true },
      { name: "analysisType", type: "string", required: false },
    ],
    render: ({ args, result, status }: { args: any, result: any, status: "inProgress" | "executing" | "complete" }) => {
      return <ReasoningAnalysisCard
        symbols={args.symbols}
        analysisType={args.analysisType}
        themeColor={themeColor}
        result={result}
        status={status}
      />
    },
  });

  // 🪁 Market Intelligence Tool UI
  useCopilotAction({
    name: "market_intelligence",
    description: "Get comprehensive market intelligence with contextual analysis",
    available: "frontend",
    parameters: [
      { name: "query", type: "string", required: true },
      { name: "context", type: "string", required: false },
    ],
    render: ({ args, result, status }: { args: any, result: any, status: "inProgress" | "executing" | "complete" }) => {
      return <MarketIntelligenceCard
        query={args.query}
        context={args.context}
        themeColor={themeColor}
        result={result}
        status={status}
      />
    },
  });

  // 🪁 Watchlist Management Tool UI
  useCopilotAction({
    name: "watchlist_management",
    description: "Manage user's watchlist by adding or removing symbols based on analysis",
    available: "frontend",
    parameters: [
      { name: "action", type: "string", required: true },
      { name: "symbols", type: "object[]", required: true },
      { name: "analysis", type: "string", required: false },
    ],
    render: ({ args, result, status }: { args: any, result: any, status: "inProgress" | "executing" | "complete" }) => {
      // Update the actual watchlist state when the tool executes
      if (status === "complete" && result?.watchlistUpdate) {
        const { action, symbols } = result.watchlistUpdate;

        if (action === 'add') {
          setState((prevState: any) => ({
            ...prevState,
            watchlist: [
              ...(prevState?.watchlist || []),
              ...symbols.map((s: any) => ({
                symbol: s.symbol,
                market: s.market,
                addedAt: s.addedAt || Date.now(),
              }))
            ]
          }));
        } else if (action === 'remove') {
          const symbolsToRemove = symbols.map((s: any) => s.symbol);
          setState((prevState: any) => ({
            ...prevState,
            watchlist: (prevState?.watchlist || []).filter(
              (item: any) => !symbolsToRemove.includes(item.symbol)
            )
          }));
        }
      }

      return <WatchlistManagementCard
        action={args.action}
        symbols={args.symbols}
        analysis={args.analysis}
        themeColor={themeColor}
        result={result}
        status={status}
      />
    },
  });

  // 🪁 Web3 Perpetuals Analysis Tool UI
  useCopilotAction({
    name: "web3_perpetuals_analysis",
    description: "Analyze Web3 perpetual futures markets and DeFi protocols",
    available: "frontend",
    parameters: [
      { name: "protocols", type: "string[]", required: true },
      { name: "assets", type: "string[]", required: true },
      { name: "analysisType", type: "string", required: false },
      { name: "timeframe", type: "string", required: false },
    ],
    render: ({ args, result, status }: { args: any, result: any, status: "inProgress" | "executing" | "complete" }) => {
      return <Web3PerpetualsCard
        protocols={args.protocols}
        assets={args.assets}
        analysisType={args.analysisType}
        timeframe={args.timeframe}
        themeColor={themeColor}
        result={result}
        status={status}
      />
    },
  });

  // 🪁 Location-Based Market Analysis Tool UI
  useCopilotAction({
    name: "location_based_market_analysis",
    description: "Analyze markets based on geographic location and regional trends",
    available: "frontend",
    parameters: [
      { name: "regions", type: "string[]", required: true },
      { name: "countries", type: "string[]", required: false },
      { name: "analysisType", type: "string", required: false },
      { name: "sectors", type: "string[]", required: false },
      { name: "timeframe", type: "string", required: false },
    ],
    render: ({ args, result, status }: { args: any, result: any, status: "inProgress" | "executing" | "complete" }) => {
      return <LocationBasedAnalysisCard
        regions={args.regions}
        countries={args.countries}
        analysisType={args.analysisType}
        sectors={args.sectors}
        timeframe={args.timeframe}
        themeColor={themeColor}
        result={result}
        status={status}
      />
    },
  });

  useCopilotAction({
    name: "updateWorkingMemory",
    available: "frontend",
    render: ({ args }: { args: any }) => {
      return <div style={{ backgroundColor: themeColor }} className="rounded-2xl max-w-md w-full text-white p-4">
        <p>📊 SokoAnalyst Memory Updated</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-white">See market insights</summary>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }} className="overflow-x-auto text-sm bg-white/20 p-4 rounded-lg mt-2">
            {JSON.stringify(args, null, 2)}
          </pre>
        </details>
      </div>
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Corporate Header */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  SokoAnalyst
                </h1>
                <p className="text-slate-300 text-lg font-medium">Institutional Financial Intelligence</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-slate-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">98.7%</div>
                <div className="text-sm">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">24/7</div>
                <div className="text-sm">Live Data</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">AI</div>
                <div className="text-sm">Reasoning</div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Markets Open</span>
              </div>
              <div className="text-slate-400">|</div>
              <div className="text-slate-300">
                <span className="text-blue-400">Perplexity Sonar-Reasoning</span> Active
              </div>
            </div>
            <div className="text-slate-400 text-sm">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Corporate Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => executeSmartAnalysis('market-intelligence')}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <span className="text-blue-400 text-xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Market Intelligence</h3>
            </div>
            <p className="text-slate-300 mb-4">Real-time analysis with AI reasoning for institutional-grade insights</p>
            <div className="text-blue-400 font-medium group-hover:text-blue-300">Execute Analysis →</div>
          </div>

          <div
            onClick={() => executeSmartAnalysis('ai-reasoning')}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <span className="text-purple-400 text-xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-white">AI Reasoning</h3>
            </div>
            <p className="text-slate-300 mb-4">Advanced analytical reasoning with step-by-step methodology</p>
            <div className="text-purple-400 font-medium group-hover:text-purple-300">Execute Analysis →</div>
          </div>

          <div
            onClick={() => executeSmartAnalysis('portfolio-management')}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <span className="text-green-400 text-xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Portfolio Management</h3>
            </div>
            <p className="text-slate-300 mb-4">Risk-adjusted optimization and professional portfolio tools</p>
            <div className="text-green-400 font-medium group-hover:text-green-300">Execute Analysis →</div>
          </div>
        </div>

        {/* Enhanced Dynamic Prompts Section */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">🎯</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">AI-Powered Smart Prompts</h2>
                  <p className="text-slate-300">30+ Professional Analysis Templates</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6 text-slate-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">30+</div>
                  <div className="text-sm">Prompts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">10</div>
                  <div className="text-sm">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">Live</div>
                  <div className="text-sm">Context</div>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-400">📊</span>
                  <span className="text-white font-medium">Market Analysis</span>
                </div>
                <p className="text-slate-300 text-sm">Real-time market insights with AI reasoning</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-purple-400">🌐</span>
                  <span className="text-white font-medium">Web3 & DeFi</span>
                </div>
                <p className="text-slate-300 text-sm">Advanced DeFi and perpetuals analysis</p>
              </div>
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-green-400">💼</span>
                  <span className="text-white font-medium">Portfolio Tools</span>
                </div>
                <p className="text-slate-300 text-sm">Professional portfolio optimization</p>
              </div>
            </div>
          </div>

          <DynamicPrompts onPromptSelect={async (prompt) => {
            // Enhanced integration with both clipboard and direct execution
            console.log('🎯 Smart prompt selected:', prompt);

            try {
              // Copy prompt to clipboard for CopilotKit sidebar
              await navigator.clipboard.writeText(prompt);

              // Optional: Also execute directly through API for immediate results
              const shouldExecuteDirectly = prompt.includes('watchlist') || prompt.includes('add to watchlist');

              if (shouldExecuteDirectly) {
                console.log('🚀 Executing prompt directly through API...');

                try {
                  const response = await fetch('/api/soko/agent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      query: prompt,
                      context: {}
                    })
                  });

                  const result = await response.json();

                  if (result.success) {
                    console.log('✅ Direct execution successful:', result.response);

                    // Show success notification with preview
                    const directNotification = document.createElement('div');
                    directNotification.innerHTML = `
                      <div class="fixed top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-md">
                        <div class="flex items-center space-x-3 mb-2">
                          <span class="text-xl">✅</span>
                          <div class="font-bold">Analysis Complete!</div>
                        </div>
                        <div class="text-sm opacity-90 line-clamp-3">
                          ${result.response.substring(0, 150)}...
                        </div>
                        <div class="text-xs opacity-75 mt-2">Also copied to clipboard for chat sidebar</div>
                      </div>
                    `;
                    document.body.appendChild(directNotification);

                    setTimeout(() => {
                      if (document.body.contains(directNotification)) {
                        document.body.removeChild(directNotification);
                      }
                    }, 8000);
                  }
                } catch (apiError) {
                  console.error('API execution failed:', apiError);
                }
              }

            } catch (clipboardError) {
              console.error('Failed to copy prompt:', clipboardError);
            }
          }} />
        </div>

        {/* Enhanced SokoAnalyst Interface */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          <SokoAnalystInterface themeColor="#1e40af" />
        </div>
      </div>
    </div>
  );
}

// Market Data Card Component
function MarketDataCard({
  symbols,
  market,
  themeColor,
  result,
  status
}: {
  symbols?: string[],
  market?: string,
  themeColor: string,
  result: any,
  status: "inProgress" | "executing" | "complete"
}) {
  if (status !== "complete") {
    return (
      <div
        className="rounded-xl shadow-xl mt-6 mb-4 max-w-2xl w-full"
        style={{ backgroundColor: themeColor }}
      >
        <div className="bg-white/20 p-4 w-full">
          <p className="text-white animate-pulse">Fetching market data for {symbols?.join(", ")}...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="rounded-xl shadow-xl mt-6 mb-4 max-w-2xl w-full"
    >
      <div className="bg-white/20 p-4 w-full">
        <h3 className="text-xl font-bold text-white mb-4">📊 Market Data - {market?.toUpperCase()}</h3>

        {result?.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.data.slice(0, 4).map((asset: any, index: number) => (
              <div key={index} className="bg-white/10 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">{asset.symbol}</span>
                  <span className={`text-sm font-medium ${asset.changePercent >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent?.toFixed(2)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">${asset.price?.toFixed(2)}</div>
                <div className="text-sm text-white/70">Vol: {(asset.volume / 1000000)?.toFixed(1)}M</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Technical Analysis Card Component
function TechnicalAnalysisCard({
  symbol,
  indicators,
  themeColor,
  result,
  status
}: {
  symbol?: string,
  indicators?: string[],
  themeColor: string,
  result: any,
  status: "inProgress" | "executing" | "complete"
}) {
  if (status !== "complete") {
    return (
      <div
        className="rounded-xl shadow-xl mt-6 mb-4 max-w-2xl w-full"
        style={{ backgroundColor: themeColor }}
      >
        <div className="bg-white/20 p-4 w-full">
          <p className="text-white animate-pulse">Analyzing {symbol} with {indicators?.join(", ")}...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="rounded-xl shadow-xl mt-6 mb-4 max-w-2xl w-full"
    >
      <div className="bg-white/20 p-4 w-full">
        <h3 className="text-xl font-bold text-white mb-4">📈 Technical Analysis - {symbol}</h3>

        {result?.analysis?.indicators && (
          <div className="space-y-3">
            {Object.entries(result.analysis.indicators).map(([key, value]: [string, any]) => (
              <div key={key} className="bg-white/10 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{key}</span>
                  <span className={`text-sm px-2 py-1 rounded ${value.signal === 'bullish' || value.trend === 'upward' ? 'bg-green-500/30 text-green-300' :
                    value.signal === 'bearish' || value.trend === 'downward' ? 'bg-red-500/30 text-red-300' :
                      'bg-yellow-500/30 text-yellow-300'
                    }`}>
                    {value.signal || value.trend || 'neutral'}
                  </span>
                </div>
                <div className="text-white/80 text-sm mt-1">
                  Value: {typeof value.value === 'number' ? value.value.toFixed(2) : value.value || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        )}

        {result?.actionableInsights && (
          <div className="mt-4 bg-blue-500/20 rounded-lg p-3">
            <h4 className="font-semibold text-blue-300 mb-2">💡 Insights</h4>
            <ul className="text-sm text-white/90 space-y-1">
              {result.actionableInsights.slice(0, 3).map((insight: string, index: number) => (
                <li key={index}>• {insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Reasoning Analysis Card Component
function ReasoningAnalysisCard({
  symbols,
  analysisType,
  themeColor,
  result,
  status
}: {
  symbols?: string[],
  analysisType?: string,
  themeColor: string,
  result: any,
  status: "inProgress" | "executing" | "complete"
}) {
  if (status !== "complete") {
    return (
      <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-white">Analyzing {symbols?.join(", ")} with AI reasoning...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-400">🧠</span>
            </div>
            AI Reasoning Analysis - {analysisType || 'Comprehensive'}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
              Sonar-Reasoning
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
              Live Analysis
            </span>
          </div>
        </div>

        {result && (
          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600/30">
            {/* Summary Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">📋 Executive Summary</h4>
              <p className="text-slate-200 leading-relaxed">{result.summary}</p>
            </div>

            {/* Key Points Section */}
            {result.keyPoints && result.keyPoints.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">🎯 Key Insights</h4>
                <div className="space-y-2">
                  {result.keyPoints.map((point: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span className="text-slate-200 text-sm leading-relaxed">{point.replace(/^•\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Sections */}
            {result.details && result.details.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">📊 Detailed Analysis</h4>
                <div className="space-y-4">
                  {result.details.map((section: any, index: number) => (
                    <div key={index} className="bg-slate-800/30 rounded-lg p-4">
                      <h5 className="text-purple-300 font-medium mb-2">{section.section}</h5>
                      <div className="space-y-1">
                        {section.points.map((point: string, pointIndex: number) => (
                          <div key={pointIndex} className="flex items-start space-x-2">
                            <span className="text-purple-400/60 mt-1 text-xs">▸</span>
                            <span className="text-slate-300 text-sm">{point.replace(/^•\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fallback Message */}
            {result.fallbackMessage && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <h4 className="text-amber-300 font-medium mb-2">ℹ️ Additional Information</h4>
                <p className="text-amber-200 text-sm">{result.fallbackMessage}</p>
              </div>
            )}

            {/* Sources & Metadata */}
            {result.metadata && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700/50">
                {result.metadata.model && (
                  <span className="text-xs text-slate-400">Model: {result.metadata.model}</span>
                )}
                {result.metadata.confidence && (
                  <span className="text-xs text-slate-400">Confidence: {result.metadata.confidence}</span>
                )}
                {result.metadata.sources && result.metadata.sources.length > 0 && (
                  <span className="text-xs text-slate-400">Sources: {result.metadata.sources.length}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Watchlist Management Card Component
function WatchlistManagementCard({
  action,
  symbols,
  analysis,
  themeColor,
  result,
  status
}: {
  action?: string,
  symbols?: any[],
  analysis?: string,
  themeColor: string,
  result: any,
  status: "inProgress" | "executing" | "complete"
}) {
  if (status !== "complete") {
    return (
      <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-white">
              {action === 'add' ? 'Adding symbols to' : action === 'remove' ? 'Removing symbols from' : 'Updating'} watchlist...
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'add': return 'emerald';
      case 'remove': return 'red';
      case 'update': return 'blue';
      default: return 'gray';
    }
  };

  const actionColor = getActionColor(action || 'update');

  return (
    <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <div className={`w-8 h-8 bg-${actionColor}-500/20 rounded-lg flex items-center justify-center mr-3`}>
              <span className={`text-${actionColor}-400`}>📋</span>
            </div>
            Watchlist {action ? action.charAt(0).toUpperCase() + action.slice(1) : 'Update'} - {symbols?.length || 0} Symbol{(symbols?.length || 0) > 1 ? 's' : ''}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 bg-${actionColor}-500/20 text-${actionColor}-400 rounded-full text-sm font-medium`}>
              {action?.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
              Updated
            </span>
          </div>
        </div>

        {result && (
          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600/30">
            {/* Summary Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">📋 Watchlist Update</h4>
              <p className="text-slate-200 leading-relaxed">{result.summary}</p>
            </div>

            {/* Symbols Section */}
            {result.keyPoints && result.keyPoints.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">📊 Symbols Updated</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.keyPoints.map((point: string, index: number) => (
                    <div key={index} className={`bg-${actionColor}-500/10 border border-${actionColor}-500/20 rounded-lg p-3`}>
                      <div className="text-slate-200 text-sm">{point}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Priority Sections */}
            {result.details && result.details.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">🎯 Priority Breakdown</h4>
                <div className="space-y-4">
                  {result.details.map((section: any, index: number) => (
                    <div key={index} className="bg-slate-800/30 rounded-lg p-4">
                      <h5 className={`text-${actionColor}-300 font-medium mb-2`}>{section.section}</h5>
                      <div className="space-y-1">
                        {section.points.map((point: string, pointIndex: number) => (
                          <div key={pointIndex} className="flex items-start space-x-2">
                            <span className={`text-${actionColor}-400/60 mt-1 text-xs`}>▸</span>
                            <span className="text-slate-300 text-sm">{point.replace(/^•\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Section */}
            {analysis && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="text-blue-300 font-medium mb-2">💡 Analysis Context</h4>
                <p className="text-blue-200 text-sm">{analysis}</p>
              </div>
            )}

            {/* Metadata */}
            {result.metadata && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700/50">
                <span className="text-xs text-slate-400">Action: {action}</span>
                <span className="text-xs text-slate-400">Symbols: {symbols?.length || 0}</span>
                {result.metadata.confidence && (
                  <span className="text-xs text-slate-400">Status: {result.metadata.confidence}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Web3 Perpetuals Card Component
function Web3PerpetualsCard({
  protocols,
  assets,
  analysisType,
  timeframe,
  themeColor,
  result,
  status
}: {
  protocols?: string[],
  assets?: string[],
  analysisType?: string,
  timeframe?: string,
  themeColor: string,
  result: any,
  status: "inProgress" | "executing" | "complete"
}) {
  if (status !== "complete") {
    return (
      <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-white">Analyzing Web3 perpetuals for {protocols?.join(", ")}...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-400">🌐</span>
            </div>
            Web3 Perpetuals Analysis - {analysisType || 'Comprehensive'}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
              DeFi
            </span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium">
              Web3
            </span>
          </div>
        </div>

        {/* Protocols & Assets Info */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/30 rounded-lg p-3">
            <div className="text-sm text-slate-400 mb-1">Protocols Analyzed</div>
            <div className="text-white font-medium">{protocols?.join(", ")}</div>
          </div>
          <div className="bg-slate-900/30 rounded-lg p-3">
            <div className="text-sm text-slate-400 mb-1">Assets Covered</div>
            <div className="text-white font-medium">{assets?.join(", ")}</div>
          </div>
        </div>

        {/* Use the standard formatted response display */}
        {result && (
          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600/30">
            {/* Summary Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">📋 Executive Summary</h4>
              <p className="text-slate-200 leading-relaxed">{result.summary}</p>
            </div>

            {/* Key Points Section */}
            {result.keyPoints && result.keyPoints.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">🎯 Key Insights</h4>
                <div className="space-y-2">
                  {result.keyPoints.map((point: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span className="text-slate-200 text-sm leading-relaxed">{point.replace(/^•\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Sections */}
            {result.details && result.details.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">📊 Detailed Analysis</h4>
                <div className="space-y-4">
                  {result.details.map((section: any, index: number) => (
                    <div key={index} className="bg-slate-800/30 rounded-lg p-4">
                      <h5 className="text-purple-300 font-medium mb-2">{section.section}</h5>
                      <div className="space-y-1">
                        {section.points.map((point: string, pointIndex: number) => (
                          <div key={pointIndex} className="flex items-start space-x-2">
                            <span className="text-purple-400/60 mt-1 text-xs">▸</span>
                            <span className="text-slate-300 text-sm">{point.replace(/^•\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources & Metadata */}
            {result.metadata && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700/50">
                {result.metadata.model && (
                  <span className="text-xs text-slate-400">Model: {result.metadata.model}</span>
                )}
                {result.metadata.confidence && (
                  <span className="text-xs text-slate-400">Data: {result.metadata.confidence}</span>
                )}
                <span className="text-xs text-slate-400">Timeframe: {timeframe || '1d'}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Location-Based Analysis Card Component
function LocationBasedAnalysisCard({
  regions,
  countries,
  analysisType,
  sectors,
  timeframe,
  themeColor,
  result,
  status
}: {
  regions?: string[],
  countries?: string[],
  analysisType?: string,
  sectors?: string[],
  timeframe?: string,
  themeColor: string,
  result: any,
  status: "inProgress" | "executing" | "complete"
}) {
  if (status !== "complete") {
    return (
      <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-white">Analyzing regional markets for {regions?.join(", ")}...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-emerald-400">🌍</span>
            </div>
            Location-Based Analysis - {analysisType || 'Comprehensive'}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
              Regional
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
              Global
            </span>
          </div>
        </div>

        {/* Regions & Countries Info */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/30 rounded-lg p-3">
            <div className="text-sm text-slate-400 mb-1">Regions Analyzed</div>
            <div className="text-white font-medium">{regions?.join(", ")}</div>
          </div>
          {countries && countries.length > 0 && (
            <div className="bg-slate-900/30 rounded-lg p-3">
              <div className="text-sm text-slate-400 mb-1">Countries Focus</div>
              <div className="text-white font-medium">{countries.join(", ")}</div>
            </div>
          )}
        </div>

        {/* Use the standard formatted response display */}
        {result && (
          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600/30">
            {/* Summary Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">📋 Executive Summary</h4>
              <p className="text-slate-200 leading-relaxed">{result.summary}</p>
            </div>

            {/* Key Points Section */}
            {result.keyPoints && result.keyPoints.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">🎯 Key Insights</h4>
                <div className="space-y-2">
                  {result.keyPoints.map((point: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span className="text-slate-200 text-sm leading-relaxed">{point.replace(/^•\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Sections */}
            {result.details && result.details.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">📊 Detailed Analysis</h4>
                <div className="space-y-4">
                  {result.details.map((section: any, index: number) => (
                    <div key={index} className="bg-slate-800/30 rounded-lg p-4">
                      <h5 className="text-emerald-300 font-medium mb-2">{section.section}</h5>
                      <div className="space-y-1">
                        {section.points.map((point: string, pointIndex: number) => (
                          <div key={pointIndex} className="flex items-start space-x-2">
                            <span className="text-emerald-400/60 mt-1 text-xs">▸</span>
                            <span className="text-slate-300 text-sm">{point.replace(/^•\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources & Metadata */}
            {result.metadata && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700/50">
                {result.metadata.model && (
                  <span className="text-xs text-slate-400">Model: {result.metadata.model}</span>
                )}
                {result.metadata.confidence && (
                  <span className="text-xs text-slate-400">Data: {result.metadata.confidence}</span>
                )}
                <span className="text-xs text-slate-400">Timeframe: {timeframe || '6m'}</span>
                {sectors && sectors.length > 0 && (
                  <span className="text-xs text-slate-400">Sectors: {sectors.join(", ")}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Market Intelligence Card Component
function MarketIntelligenceCard({
  query,
  context,
  themeColor,
  result,
  status
}: {
  query?: string,
  context?: string,
  themeColor: string,
  result: any,
  status: "inProgress" | "executing" | "complete"
}) {
  if (status !== "complete") {
    return (
      <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-white">Gathering market intelligence...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-400">🎯</span>
            </div>
            Market Intelligence - {context || 'Research'}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
              AI Intelligence
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
              Real-time
            </span>
          </div>
        </div>

        <div className="mb-4 p-3 bg-slate-900/30 rounded-lg border border-slate-600/20">
          <div className="text-sm text-slate-400 mb-1">Query:</div>
          <div className="text-white font-medium">{query}</div>
        </div>

        {result?.content && (
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/30">
            <div className="prose prose-invert max-w-none">
              <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                {result.content.length > 1200
                  ? result.content.substring(0, 1200) + "..."
                  : result.content
                }
              </div>
            </div>

            {result.citations && result.citations.length > 0 && (
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <h4 className="text-sm font-semibold text-green-300 mb-2">Intelligence Sources:</h4>
                <div className="space-y-1">
                  {result.citations.slice(0, 4).map((citation: string, index: number) => (
                    <div key={index} className="text-xs text-green-200">
                      • {citation}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center text-sm text-slate-400">
              <span>Model: {result.model}</span>
              <span>Analysis Depth: {result.usage?.total_tokens > 2000 ? 'Deep' : 'Standard'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Portfolio Analysis Card Component
function PortfolioAnalysisCard({
  holdings,
  themeColor,
  result,
  status
}: {
  holdings?: any[],
  themeColor: string,
  result: any,
  status: "inProgress" | "executing" | "complete"
}) {
  if (status !== "complete") {
    return (
      <div
        className="rounded-xl shadow-xl mt-6 mb-4 max-w-2xl w-full"
        style={{ backgroundColor: themeColor }}
      >
        <div className="bg-white/20 p-4 w-full">
          <p className="text-white animate-pulse">Analyzing portfolio with {holdings?.length} holdings...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="rounded-xl shadow-xl mt-6 mb-4 max-w-2xl w-full"
    >
      <div className="bg-white/20 p-4 w-full">
        <h3 className="text-xl font-bold text-white mb-4">💼 Portfolio Analysis</h3>

        {result?.analysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-sm text-white/70">Total Value</div>
                <div className="text-xl font-bold text-green-300">
                  ${result.analysis.totalValue?.toLocaleString()}
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-sm text-white/70">Total Return</div>
                <div className={`text-xl font-bold ${result.analysis.totalReturnPercent >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {result.analysis.totalReturnPercent >= 0 ? '+' : ''}{result.analysis.totalReturnPercent?.toFixed(2)}%
                </div>
              </div>
            </div>

            {result.analysis.riskMetrics && (
              <div className="bg-white/10 rounded-lg p-3">
                <h4 className="font-semibold text-white mb-2">Risk Metrics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Sharpe Ratio: <span className="font-medium">{result.analysis.riskMetrics.sharpeRatio?.toFixed(2)}</span></div>
                  <div>Volatility: <span className="font-medium">{result.analysis.riskMetrics.volatility?.toFixed(1)}%</span></div>
                  <div>Max Drawdown: <span className="font-medium">{result.analysis.riskMetrics.maxDrawdown?.toFixed(1)}%</span></div>
                  <div>Beta: <span className="font-medium">{result.analysis.riskMetrics.beta?.toFixed(2)}</span></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


// Function definitions 
async function fetchMarketInsights() {
  const response = await fetch('/api/market-insights');
  const data = await response.json();
  return data;
}   