'use client';

import React, { useState, useEffect } from 'react';
import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
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

interface SokoAnalystInterfaceProps {
    themeColor: string;
}

export const SokoAnalystInterface: React.FC<SokoAnalystInterfaceProps> = ({ themeColor }) => {
    const [loading, setLoading] = useState(false);
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['AAPL', 'BTC-USD', 'TSLA']);
    const [marketData, setMarketData] = useState<any[]>([]);
    const [insights, setInsights] = useState<any[]>([]);

    // 🪁 Shared State for SokoAnalyst
    const { state, setState } = useCoAgent<AgentState>({
        name: "sokoAnalyst",
        initialState: {
            watchlist: [],
            alerts: [],
            portfolios: [],
            marketInsights: [],
        },
    });

    // 🪁 Enhanced Market Data Tool with Perplexity
    useCopilotAction({
        name: "fetchRealTimeMarketData",
        description: "Fetch real-time market data using Perplexity AI for accurate financial information",
        available: "frontend",
        parameters: [
            { name: "symbols", type: "string[]", required: true },
            { name: "market", type: "string", required: false },
        ],
        render: ({ args, result, status }) => {
            return <EnhancedMarketDataCard
                symbols={args.symbols}
                market={args.market}
                themeColor={themeColor}
                result={result}
                status={status}
            />
        },
    });

    // 🪁 Market Sentiment Analysis with Perplexity
    useCopilotAction({
        name: "analyzeMarketSentiment",
        description: "Analyze market sentiment using real-time news and social media data",
        available: "frontend",
        parameters: [
            { name: "symbols", type: "string[]", required: true },
            { name: "timeframe", type: "string", required: false },
        ],
        render: ({ args, result, status }) => {
            return <SentimentAnalysisCard
                symbols={args.symbols}
                timeframe={args.timeframe}
                themeColor={themeColor}
                result={result}
                status={status}
            />
        },
    });

    // 🪁 Economic Indicators Tool
    useCopilotAction({
        name: "getEconomicIndicators",
        description: "Get latest economic indicators and their impact on markets",
        available: "frontend",
        parameters: [
            { name: "indicators", type: "string[]", required: true },
            { name: "countries", type: "string[]", required: false },
        ],
        render: ({ args, result, status }) => {
            return <EconomicIndicatorsCard
                indicators={args.indicators}
                countries={args.countries}
                themeColor={themeColor}
                result={result}
                status={status}
            />
        },
    });

    // 🪁 Add to Watchlist Action
    useCopilotAction({
        name: "addToWatchlist",
        description: "Add symbols to the watchlist for monitoring",
        available: "frontend",
        parameters: [
            { name: "symbol", type: "string", required: true },
            { name: "market", type: "string", required: true },
        ],
        handler: ({ symbol, market }) => {
            const newWatchlistItem = {
                symbol,
                market,
                addedAt: Date.now(),
            };

            setState({
                ...state,
                watchlist: [...(state.watchlist || []), newWatchlistItem],
            });
        },
    });

    // 🪁 Generate Market Insights Action
    useCopilotAction({
        name: "generateMarketInsights",
        description: "Generate actionable market insights based on current data",
        available: "frontend",
        parameters: [
            { name: "analysisType", type: "string", required: true },
            { name: "symbols", type: "string[]", required: false },
        ],
        handler: ({ analysisType, symbols }) => {
            const newInsight = {
                id: Date.now().toString(),
                title: `${analysisType} Analysis`,
                content: `Generated insights for ${symbols?.join(', ') || 'market'} based on current conditions`,
                severity: 'medium' as const,
                timestamp: Date.now(),
            };

            setState({
                ...state,
                marketInsights: [...(state.marketInsights || []), newInsight],
            });
        },
    });

    // Fetch market data and populate initial data on component mount
    useEffect(() => {
        fetchMarketData();
        populateInitialData();
    }, []);

    const populateInitialData = () => {
        // Populate initial watchlist
        const initialWatchlist = [
            { symbol: 'AAPL', market: 'stocks', addedAt: Date.now() - 86400000 },
            { symbol: 'TSLA', market: 'stocks', addedAt: Date.now() - 172800000 },
            { symbol: 'BTC-USD', market: 'crypto', addedAt: Date.now() - 259200000 },
            { symbol: 'NVDA', market: 'stocks', addedAt: Date.now() - 345600000 },
            { symbol: 'ETH-USD', market: 'crypto', addedAt: Date.now() - 432000000 },
        ];

        // Populate initial market insights
        const initialInsights = [
            {
                id: '1',
                title: 'Tech Sector Momentum Analysis',
                content: 'Strong institutional buying in mega-cap tech stocks with AAPL and NVDA showing bullish technical patterns. RSI levels suggest continued upward momentum with proper risk management.',
                severity: 'medium' as const,
                timestamp: Date.now() - 3600000,
            },
            {
                id: '2',
                title: 'Crypto Market Correlation Breakdown',
                content: 'Bitcoin and Ethereum showing decreased correlation with traditional markets. This decoupling suggests crypto-specific catalysts driving price action, presenting diversification opportunities.',
                severity: 'high' as const,
                timestamp: Date.now() - 7200000,
            },
            {
                id: '3',
                title: 'Federal Reserve Policy Impact',
                content: 'Recent Fed communications suggest potential policy shifts affecting interest-sensitive sectors. Monitor bond yields and financial sector performance for early indicators.',
                severity: 'high' as const,
                timestamp: Date.now() - 10800000,
            },
            {
                id: '4',
                title: 'Earnings Season Outlook',
                content: 'Q4 earnings expectations remain elevated for technology sector. Focus on guidance revisions and margin expansion commentary for forward-looking insights.',
                severity: 'medium' as const,
                timestamp: Date.now() - 14400000,
            },
            {
                id: '5',
                title: 'Global Market Risk Assessment',
                content: 'Geopolitical tensions and supply chain disruptions creating volatility clusters. Recommend defensive positioning with quality growth exposure.',
                severity: 'low' as const,
                timestamp: Date.now() - 18000000,
            },
        ];

        // Update state with initial data
        setState({
            ...state,
            watchlist: initialWatchlist,
            marketInsights: initialInsights,
        });
    };

    const triggerSentimentAnalysis = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/soko/sentiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbols: selectedSymbols,
                    sources: ['news', 'social']
                }),
            });

            const result = await response.json();
            if (result.success) {
                // Add sentiment insight to market insights
                const sentimentInsight = {
                    id: Date.now().toString(),
                    title: 'Real-time Sentiment Analysis',
                    content: `Sentiment analysis completed for ${selectedSymbols.join(', ')}. Overall market sentiment shows ${result.data?.overallSentiment || 'mixed'} signals with ${result.data?.confidence || 'moderate'} confidence.`,
                    severity: 'medium' as const,
                    timestamp: Date.now(),
                };

                setState({
                    ...state,
                    marketInsights: [sentimentInsight, ...(state.marketInsights || [])],
                });
            }
        } catch (error) {
            console.error('Sentiment analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const triggerTechnicalAnalysis = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/soko/technical-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol: selectedSymbols[0],
                    indicators: ['RSI', 'MACD', 'SMA', 'EMA']
                }),
            });

            const result = await response.json();
            if (result.success) {
                // Add technical insight to market insights
                const technicalInsight = {
                    id: Date.now().toString(),
                    title: `Technical Analysis - ${selectedSymbols[0]}`,
                    content: `Technical analysis reveals ${result.data?.trend || 'neutral'} trend with RSI at ${result.data?.rsi || 'N/A'} and MACD showing ${result.data?.macdSignal || 'neutral'} signals. Key support/resistance levels identified.`,
                    severity: 'high' as const,
                    timestamp: Date.now(),
                };

                setState({
                    ...state,
                    marketInsights: [technicalInsight, ...(state.marketInsights || [])],
                });
            }
        } catch (error) {
            console.error('Technical analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const triggerPortfolioAnalysis = async () => {
        setLoading(true);
        try {
            const mockPortfolio = [
                { symbol: 'AAPL', quantity: 100, avgCost: 150 },
                { symbol: 'TSLA', quantity: 50, avgCost: 200 },
                { symbol: 'NVDA', quantity: 25, avgCost: 400 }
            ];

            const response = await fetch('/api/soko/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    holdings: mockPortfolio,
                    benchmarks: ['SPY', 'QQQ']
                }),
            });

            const result = await response.json();
            if (result.success) {
                // Add portfolio insight to market insights
                const portfolioInsight = {
                    id: Date.now().toString(),
                    title: 'Portfolio Performance Review',
                    content: `Portfolio analysis shows ${result.data?.totalReturn >= 0 ? 'positive' : 'negative'} performance with ${Math.abs(result.data?.totalReturn || 0).toFixed(1)}% total return. Sharpe ratio: ${result.data?.sharpeRatio?.toFixed(2) || 'N/A'}. Risk-adjusted recommendations provided.`,
                    severity: 'medium' as const,
                    timestamp: Date.now(),
                };

                setState({
                    ...state,
                    marketInsights: [portfolioInsight, ...(state.marketInsights || [])],
                });
            }
        } catch (error) {
            console.error('Portfolio analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMarketData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/soko/market-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbols: selectedSymbols,
                    market: 'mixed',
                    timeframe: '1d'
                }),
            });

            const result = await response.json();
            if (result.success) {
                setMarketData(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch market data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Corporate Market Overview */}
            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-400">📊</span>
                        </div>
                        Market Intelligence Dashboard
                    </h2>
                    <div className="flex items-center space-x-3">
                        <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                            Live Data
                        </div>
                        <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                            AI Reasoning
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {marketData.slice(0, 3).map((asset, index) => (
                        <div key={index} className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-6 hover:border-indigo-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xl font-bold text-white">{asset.symbol}</span>
                                    <div className="text-sm text-slate-400 mt-1">
                                        {asset.source === 'Perplexity' ? '🔍 Sonar-Reasoning' : '📊 Market Data'}
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-sm font-bold ${asset.changePercent >= 0
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                    {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent?.toFixed(2)}%
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">${asset.price?.toFixed(2)}</div>
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>Vol: {(asset.volume / 1000000)?.toFixed(1)}M</span>
                                <span className="text-blue-400">Real-time</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={fetchMarketData}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Analyzing Markets...</span>
                            </>
                        ) : (
                            <>
                                <span>🔄</span>
                                <span>Refresh Intelligence</span>
                            </>
                        )}
                    </button>
                    <div className="text-sm text-slate-400">
                        Powered by Perplexity Sonar-Reasoning
                    </div>
                </div>
            </div>

            {/* Watchlist */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-green-400 mr-2">👁️</span>
                    Watchlist ({state.watchlist?.length || 0})
                </h2>

                {state.watchlist?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {state.watchlist.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/10 px-3 py-2 rounded-lg text-white text-sm font-medium flex justify-between items-center"
                            >
                                <span>{item.symbol}</span>
                                <span className="text-xs text-white/60">({item.market})</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-white/70 italic">
                        Ask SokoAnalyst to add symbols to your watchlist!
                    </p>
                )}
            </div>

            {/* Market Insights */}
            <div className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 backdrop-blur-xl rounded-xl p-6 border border-violet-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-purple-400 mr-2">💡</span>
                    Market Insights ({state.marketInsights?.length || 0})
                </h2>

                {state.marketInsights?.length > 0 ? (
                    <div className="space-y-3">
                        {state.marketInsights.slice(0, 5).map((insight: any, index: number) => (
                            <div
                                key={index}
                                className="bg-white/10 p-4 rounded-lg border-l-4 border-purple-400"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-white">{insight.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded ${insight.severity === 'high' ? 'bg-red-500/30 text-red-300' :
                                        insight.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                                            'bg-blue-500/30 text-blue-300'
                                        }`}>
                                        {insight.severity.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-white/80 text-sm">{insight.content}</p>
                                <div className="text-xs text-white/50 mt-2">
                                    {new Date(insight.timestamp).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-white/70 italic">
                        Ask SokoAnalyst to generate market insights based on current conditions!
                    </p>
                )}
            </div>

            {/* Smart Prompts Preview */}
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/20 mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-cyan-400 mr-2">🎯</span>
                    Smart Analysis Prompts
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <button
                        onClick={() => {/* Add prompt selection logic */ }}
                        className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium text-left border border-cyan-500/20 hover:border-cyan-500/40"
                    >
                        <div className="flex items-center space-x-2">
                            <span>🌐</span>
                            <span>Web3 Perpetuals Market Analysis</span>
                        </div>
                    </button>
                    <button
                        onClick={() => {/* Add prompt selection logic */ }}
                        className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium text-left border border-cyan-500/20 hover:border-cyan-500/40"
                    >
                        <div className="flex items-center space-x-2">
                            <span>🌍</span>
                            <span>Regional Market Comparison</span>
                        </div>
                    </button>
                    <button
                        onClick={() => {/* Add prompt selection logic */ }}
                        className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium text-left border border-cyan-500/20 hover:border-cyan-500/40"
                    >
                        <div className="flex items-center space-x-2">
                            <span>🚜</span>
                            <span>DeFi Yield Farming Opportunities</span>
                        </div>
                    </button>
                    <button
                        onClick={() => {/* Add prompt selection logic */ }}
                        className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium text-left border border-cyan-500/20 hover:border-cyan-500/40"
                    >
                        <div className="flex items-center space-x-2">
                            <span>🌱</span>
                            <span>Emerging Markets Deep Dive</span>
                        </div>
                    </button>
                </div>

                <div className="text-center">
                    <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                        View All Smart Prompts →
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 backdrop-blur-xl rounded-xl p-6 border border-amber-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-orange-400 mr-2">⚡</span>
                    Quick Actions
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                        onClick={() => fetchMarketData()}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 active:scale-95"
                    >
                        📊 Refresh Data
                    </button>
                    <button
                        onClick={() => triggerSentimentAnalysis()}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 active:scale-95"
                    >
                        🧠 Sentiment Check
                    </button>
                    <button
                        onClick={() => triggerTechnicalAnalysis()}
                        className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 active:scale-95"
                    >
                        📈 Technical Analysis
                    </button>
                    <button
                        onClick={() => triggerPortfolioAnalysis()}
                        className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 active:scale-95"
                    >
                        💼 Portfolio Review
                    </button>
                </div>
            </div>
        </div>
    );
};

// Enhanced Market Data Card Component
function EnhancedMarketDataCard({
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
            <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-white/10 backdrop-blur-md border border-white/20">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                        <p className="text-white">Fetching real-time data for {symbols?.join(", ")}...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-white/10 backdrop-blur-md border border-white/20">
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-blue-400 mr-2">📊</span>
                    Real-Time Market Data
                    {result?.source === 'Perplexity' && (
                        <span className="ml-2 text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded">LIVE</span>
                    )}
                </h3>

                {result?.data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.data.map((asset: any, index: number) => (
                            <div key={index} className="bg-white/10 rounded-lg p-4 border border-white/10">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-white text-lg">{asset.symbol}</span>
                                    <span className={`text-sm font-medium px-2 py-1 rounded ${asset.changePercent >= 0 ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                                        }`}>
                                        {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent?.toFixed(2)}%
                                    </span>
                                </div>

                                <div className="text-3xl font-bold text-white mb-2">
                                    ${asset.price?.toFixed(2)}
                                </div>

                                <div className="space-y-1 text-sm text-white/70">
                                    <div>Volume: {(asset.volume / 1000000)?.toFixed(1)}M</div>
                                    <div>High: ${asset.high24h?.toFixed(2)}</div>
                                    <div>Low: ${asset.low24h?.toFixed(2)}</div>
                                    <div className="flex items-center space-x-2">
                                        <span>Source:</span>
                                        <span className={`text-xs px-2 py-1 rounded ${asset.source === 'Perplexity' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-300'
                                            }`}>
                                            {asset.source}
                                        </span>
                                    </div>
                                </div>

                                {asset.rawContent && (
                                    <details className="mt-3">
                                        <summary className="cursor-pointer text-blue-300 text-sm">View Raw Data</summary>
                                        <div className="mt-2 text-xs text-white/60 bg-black/20 p-2 rounded max-h-20 overflow-y-auto">
                                            {asset.rawContent.substring(0, 200)}...
                                        </div>
                                    </details>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {result?.citations && result.citations.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <h4 className="text-sm font-semibold text-blue-300 mb-2">Sources:</h4>
                        <div className="space-y-1">
                            {result.citations.slice(0, 3).map((citation: string, index: number) => (
                                <div key={index} className="text-xs text-blue-200">
                                    • {citation}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Sentiment Analysis Card Component
function SentimentAnalysisCard({
    symbols,
    timeframe,
    themeColor,
    result,
    status
}: {
    symbols?: string[],
    timeframe?: string,
    themeColor: string,
    result: any,
    status: "inProgress" | "executing" | "complete"
}) {
    if (status !== "complete") {
        return (
            <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-white/10 backdrop-blur-md border border-white/20">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <div className="animate-pulse rounded-full h-6 w-6 bg-purple-400"></div>
                        <p className="text-white">Analyzing sentiment for {symbols?.join(", ")}...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-white/10 backdrop-blur-md border border-white/20">
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-purple-400 mr-2">🧠</span>
                    Market Sentiment Analysis
                </h3>

                {result?.sentimentData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.sentimentData.map((sentiment: any, index: number) => (
                            <div key={index} className="bg-white/10 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-white">{sentiment.symbol}</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${sentiment.overall === 'bullish' ? 'bg-green-500/30 text-green-300' :
                                        sentiment.overall === 'bearish' ? 'bg-red-500/30 text-red-300' :
                                            'bg-yellow-500/30 text-yellow-300'
                                        }`}>
                                        {sentiment.overall.toUpperCase()}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-white/70">
                                    <div>Score: {sentiment.score?.toFixed(2)}</div>
                                    <div>Confidence: {(sentiment.confidence * 100)?.toFixed(0)}%</div>
                                    {sentiment.sources?.news && (
                                        <div>News Articles: {sentiment.sources.news.articles}</div>
                                    )}
                                    {sentiment.sources?.social && (
                                        <div>Social Mentions: {sentiment.sources.social.mentions}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Economic Indicators Card Component
function EconomicIndicatorsCard({
    indicators,
    countries,
    themeColor,
    result,
    status
}: {
    indicators?: string[],
    countries?: string[],
    themeColor: string,
    result: any,
    status: "inProgress" | "executing" | "complete"
}) {
    if (status !== "complete") {
        return (
            <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-white/10 backdrop-blur-md border border-white/20">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <div className="animate-bounce rounded-full h-6 w-6 bg-orange-400"></div>
                        <p className="text-white">Fetching economic indicators...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl shadow-xl mt-6 mb-4 max-w-4xl w-full bg-white/10 backdrop-blur-md border border-white/20">
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-orange-400 mr-2">📈</span>
                    Economic Indicators
                </h3>

                {result?.data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.data.map((indicator: any, index: number) => (
                            <div key={index} className="bg-white/10 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-white">{indicator.indicator}</span>
                                    <span className="text-sm text-white/60">{indicator.country}</span>
                                </div>

                                <div className="text-2xl font-bold text-white mb-2">
                                    {indicator.value?.toFixed(2)}%
                                </div>

                                <div className="space-y-1 text-sm text-white/70">
                                    <div>Previous: {indicator.previousValue?.toFixed(2)}%</div>
                                    <div className={`${indicator.change >= 0 ? 'text-green-300' : 'text-red-300'
                                        }`}>
                                        Change: {indicator.change >= 0 ? '+' : ''}{indicator.change?.toFixed(2)}%
                                    </div>
                                    <div>Release: {new Date(indicator.releaseDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}