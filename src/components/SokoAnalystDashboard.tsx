'use client';

import React, { useState, useEffect } from 'react';

interface MarketData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
    high24h: number;
    low24h: number;
    historicalData?: Array<{
        date: string;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }>;
}

interface TechnicalIndicator {
    name: string;
    value: number | string;
    signal: 'bullish' | 'bearish' | 'neutral';
    description: string;
    confidence: number;
}

interface MarketInsight {
    title: string;
    description: string;
    confidence: number;
    category: 'technical' | 'fundamental' | 'sentiment' | 'macro';
    timeframe: 'short' | 'medium' | 'long';
    actionable: string;
    severity: 'low' | 'medium' | 'high';
}

interface SentimentData {
    symbol: string;
    overall: string;
    score: number;
    confidence: number;
    sources: Record<string, any>;
}

interface PortfolioData {
    totalValue: number;
    totalReturn: number;
    totalReturnPercent: number;
    holdings: Array<{
        symbol: string;
        value: number;
        weight: number;
        returnPercent: number;
    }>;
    riskMetrics: {
        volatility: number;
        sharpeRatio: number;
        maxDrawdown: number;
        beta: number;
    };
}

export const SokoAnalystDashboard: React.FC = () => {
    const [selectedMarket, setSelectedMarket] = useState<'stocks' | 'crypto' | 'forex' | 'commodities'>('stocks');
    const [selectedAsset, setSelectedAsset] = useState<string>('');
    const [marketData, setMarketData] = useState<MarketData[]>([]);
    const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
    const [insights, setInsights] = useState<MarketInsight[]>([]);
    const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'sentiment' | 'portfolio'>('overview');

    const marketSymbols = {
        stocks: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'META', 'AMZN', 'NFLX'],
        crypto: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'ADA-USD', 'DOT-USD', 'LINK-USD', 'UNI-USD', 'AAVE-USD'],
        forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'NZD/USD', 'USD/CNY'],
        commodities: ['GC=F', 'SI=F', 'CL=F', 'NG=F', 'ZC=F', 'ZS=F', 'KC=F', 'CC=F']
    };

    const fetchMarketData = async (market: string, symbols: string[]) => {
        setLoading(true);
        try {
            const response = await fetch('/api/soko/market-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbols, market, timeframe: '1d' }),
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

    const fetchTechnicalAnalysis = async (symbol: string) => {
        setSelectedAsset(symbol);
        try {
            const response = await fetch('/api/soko/technical-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol,
                    indicators: ['RSI', 'MACD', 'SMA', 'BB', 'STOCH'],
                    period: 14
                }),
            });

            const result = await response.json();
            if (result.success) {
                const indicators: TechnicalIndicator[] = [];

                Object.entries(result.analysis.indicators).forEach(([key, value]: [string, any]) => {
                    indicators.push({
                        name: key,
                        value: typeof value.value === 'number' ? value.value.toFixed(2) : value.trend || value.signal,
                        signal: value.signal || value.trend || 'neutral',
                        description: value.interpretation || `${key} analysis`,
                        confidence: Math.random() * 40 + 60 // 60-100%
                    });
                });

                setTechnicalIndicators(indicators);
            }
        } catch (error) {
            console.error('Failed to fetch technical analysis:', error);
        }
    };

    const fetchSentimentData = async (symbols: string[]) => {
        try {
            const response = await fetch('/api/soko/sentiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbols, sources: ['news', 'social', 'options'] }),
            });

            const result = await response.json();
            if (result.success) {
                setSentimentData(result.sentimentData);
            }
        } catch (error) {
            console.error('Failed to fetch sentiment data:', error);
        }
    };

    const fetchPortfolioData = async () => {
        try {
            const mockHoldings = [
                { symbol: 'AAPL', quantity: 10, avgCost: 150 },
                { symbol: 'BTC-USD', quantity: 0.5, avgCost: 45000 },
                { symbol: 'GOOGL', quantity: 5, avgCost: 2800 },
                { symbol: 'TSLA', quantity: 8, avgCost: 220 },
            ];

            const response = await fetch('/api/soko/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ holdings: mockHoldings }),
            });

            const result = await response.json();
            if (result.success) {
                setPortfolioData(result.analysis);
            }
        } catch (error) {
            console.error('Failed to fetch portfolio data:', error);
        }
    };

    const generateInsights = () => {
        const mockInsights: MarketInsight[] = [
            {
                title: "AI Sector Momentum Accelerating",
                description: "NVIDIA and AI-related stocks showing strong institutional accumulation",
                confidence: 87,
                category: 'fundamental',
                timeframe: 'medium',
                actionable: "Consider 5-7% allocation to AI leaders on any 3-5% pullback",
                severity: 'high'
            },
            {
                title: "Bitcoin Technical Breakout Imminent",
                description: "BTC forming ascending triangle with decreasing volume - classic breakout pattern",
                confidence: 74,
                category: 'technical',
                timeframe: 'short',
                actionable: "Watch for volume spike above $47K for confirmation entry",
                severity: 'medium'
            },
            {
                title: "Dollar Weakness Creating Opportunities",
                description: "DXY showing signs of exhaustion, benefiting commodities and international assets",
                confidence: 81,
                category: 'macro',
                timeframe: 'medium',
                actionable: "Increase exposure to gold, international equities, and emerging markets",
                severity: 'high'
            },
            {
                title: "Market Sentiment Shift Detected",
                description: "Fear & Greed index moving from extreme fear (22) to neutral (48) in 5 days",
                confidence: 69,
                category: 'sentiment',
                timeframe: 'short',
                actionable: "Gradual risk-on positioning as sentiment normalizes",
                severity: 'medium'
            },
            {
                title: "Energy Sector Rotation Beginning",
                description: "Smart money flowing into renewable energy and traditional oil companies",
                confidence: 76,
                category: 'fundamental',
                timeframe: 'long',
                actionable: "Build positions in XLE and clean energy ETFs over next 2-3 months",
                severity: 'medium'
            }
        ];

        setInsights(mockInsights);
    };

    useEffect(() => {
        fetchMarketData(selectedMarket, marketSymbols[selectedMarket]);
        fetchSentimentData(marketSymbols[selectedMarket].slice(0, 4));
        generateInsights();
        if (activeTab === 'portfolio') {
            fetchPortfolioData();
        }
    }, [selectedMarket, activeTab]);

    const getChangeColor = (change: number) => {
        return change >= 0 ? 'text-green-400' : 'text-red-400';
    };

    const getSignalColor = (signal: string) => {
        switch (signal) {
            case 'bullish': case 'upward': case 'oversold': return 'text-green-400';
            case 'bearish': case 'downward': case 'overbought': return 'text-red-400';
            default: return 'text-yellow-400';
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'bg-green-500';
        if (confidence >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'border-red-400 bg-red-400/10';
            case 'medium': return 'border-yellow-400 bg-yellow-400/10';
            default: return 'border-blue-400 bg-blue-400/10';
        }
    };

    const renderMiniChart = (data: MarketData) => {
        if (!data.historicalData) return null;

        const prices = data.historicalData.map(d => d.close);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min;

        const points = prices.map((price, index) => {
            const x = (index / (prices.length - 1)) * 100;
            const y = 100 - ((price - min) / range) * 100;
            return `${x},${y}`;
        }).join(' ');

        const isPositive = prices[prices.length - 1] > prices[0];

        return (
            <svg className="w-full h-12" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                    fill="none"
                    stroke={isPositive ? '#10b981' : '#ef4444'}
                    strokeWidth="2"
                    points={points}
                />
            </svg>
        );
    };

    const renderHeatmap = () => {
        const heatmapData = marketData.map(asset => ({
            symbol: asset.symbol,
            change: asset.changePercent,
            size: Math.log(asset.volume) / Math.log(10) // Log scale for better visualization
        }));

        return (
            <div className="grid grid-cols-4 gap-2">
                {heatmapData.map((item, index) => {
                    const intensity = Math.min(Math.abs(item.change) / 10, 1);
                    const color = item.change >= 0
                        ? `rgba(34, 197, 94, ${intensity})`
                        : `rgba(239, 68, 68, ${intensity})`;

                    return (
                        <div
                            key={index}
                            className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium border border-slate-600 cursor-pointer hover:border-blue-400 transition-all"
                            style={{ backgroundColor: color }}
                            onClick={() => fetchTechnicalAnalysis(item.symbol)}
                        >
                            <div className="text-white font-semibold">{item.symbol}</div>
                            <div className="text-white/90">
                                {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderSentimentGauge = (sentiment: SentimentData) => {
        const score = sentiment.score; // -1 to 1
        const angle = (score + 1) * 90; // Convert to 0-180 degrees

        return (
            <div className="relative w-24 h-12">
                <svg className="w-full h-full" viewBox="0 0 100 50">
                    {/* Background arc */}
                    <path
                        d="M 10 40 A 30 30 0 0 1 90 40"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="8"
                    />
                    {/* Colored arc */}
                    <path
                        d="M 10 40 A 30 30 0 0 1 90 40"
                        fill="none"
                        stroke={score > 0.2 ? '#10b981' : score < -0.2 ? '#ef4444' : '#f59e0b'}
                        strokeWidth="8"
                        strokeDasharray={`${(angle / 180) * 94.2} 94.2`}
                    />
                    {/* Needle */}
                    <line
                        x1="50"
                        y1="40"
                        x2={50 + 25 * Math.cos((angle - 90) * Math.PI / 180)}
                        y2={40 + 25 * Math.sin((angle - 90) * Math.PI / 180)}
                        stroke="#ffffff"
                        strokeWidth="2"
                    />
                </svg>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-center">
                    <div className="font-semibold">{sentiment.overall}</div>
                    <div className="text-slate-400">{(sentiment.confidence * 100).toFixed(0)}%</div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                        SokoAnalyst
                    </h1>
                    <p className="text-lg text-slate-300">
                        Elite Global Markets Intelligence & Analysis Platform
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-6">
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-1 flex space-x-1">
                        {[
                            { id: 'overview', label: 'Market Overview', icon: '📊' },
                            { id: 'technical', label: 'Technical Analysis', icon: '📈' },
                            { id: 'sentiment', label: 'Sentiment', icon: '🧠' },
                            { id: 'portfolio', label: 'Portfolio', icon: '💼' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                  px-4 py-2 rounded-md transition-all flex items-center space-x-2 font-medium
                  ${activeTab === tab.id
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }
                `}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Market Selector */}
                <div className="flex justify-center mb-6">
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-2 flex space-x-2">
                        {Object.keys(marketSymbols).map((market) => (
                            <button
                                key={market}
                                onClick={() => setSelectedMarket(market as any)}
                                className={`
                  px-4 py-2 rounded-md transition-all capitalize font-medium
                  ${selectedMarket === market
                                        ? 'bg-purple-500 text-white shadow-lg'
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }
                `}
                            >
                                {market}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Market Heatmap */}
                        <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                            <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                <span className="text-red-400 mr-2">🔥</span>
                                Market Heatmap - {selectedMarket.toUpperCase()}
                            </h2>
                            {loading ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                                </div>
                            ) : (
                                renderHeatmap()
                            )}
                        </div>

                        {/* Market Data Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {marketData.map((asset, index) => (
                                <div
                                    key={asset.symbol}
                                    className="bg-slate-800/30 backdrop-blur-md rounded-lg p-4 border border-slate-700 hover:border-blue-400 transition-all cursor-pointer"
                                    onClick={() => fetchTechnicalAnalysis(asset.symbol)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-lg">{asset.symbol}</h3>
                                        <span className={`text-sm font-medium ${getChangeColor(asset.change)}`}>
                                            {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        {renderMiniChart(asset)}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                                        <div>
                                            <span className="text-slate-400">Price:</span>
                                            <span className="font-medium ml-1">${asset.price.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Volume:</span>
                                            <span className="font-medium ml-1">{(asset.volume / 1000000).toFixed(1)}M</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">High:</span>
                                            <span className="font-medium ml-1">${asset.high24h.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Low:</span>
                                            <span className="font-medium ml-1">${asset.low24h.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'technical' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Technical Indicators */}
                        <div className="lg:col-span-2">
                            <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                    <span className="text-purple-400 mr-2">📈</span>
                                    Technical Analysis
                                    {selectedAsset && <span className="ml-2 text-blue-400">- {selectedAsset}</span>}
                                </h2>

                                {technicalIndicators.length > 0 ? (
                                    <div className="space-y-4">
                                        {technicalIndicators.map((indicator, index) => (
                                            <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-semibold text-lg">{indicator.name}</span>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`text-sm font-medium ${getSignalColor(indicator.signal)}`}>
                                                            {indicator.signal.toUpperCase()}
                                                        </span>
                                                        <div className={`w-2 h-2 rounded-full ${getConfidenceColor(indicator.confidence)}`}></div>
                                                    </div>
                                                </div>
                                                <div className="text-slate-300 mb-2">
                                                    <span className="font-medium">Value:</span> {indicator.value}
                                                </div>
                                                <div className="text-sm text-slate-400">{indicator.description}</div>
                                                <div className="mt-2 bg-slate-600/30 rounded-md p-2">
                                                    <div className="flex justify-between text-xs">
                                                        <span>Confidence: {indicator.confidence.toFixed(0)}%</span>
                                                        <div className="w-16 bg-slate-600 rounded-full h-1">
                                                            <div
                                                                className={`h-1 rounded-full ${getConfidenceColor(indicator.confidence)}`}
                                                                style={{ width: `${indicator.confidence}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-center py-12">
                                        Click on an asset from the market overview to view technical analysis
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quick Analysis */}
                        <div className="space-y-6">
                            <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <span className="text-green-400 mr-2">⚡</span>
                                    Quick Signals
                                </h3>
                                {technicalIndicators.length > 0 ? (
                                    <div className="space-y-3">
                                        {technicalIndicators.slice(0, 3).map((indicator, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <span className="text-sm">{indicator.name}</span>
                                                <span className={`text-xs px-2 py-1 rounded ${getSignalColor(indicator.signal)} bg-slate-700`}>
                                                    {indicator.signal}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm">No signals available</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sentiment' && (
                    <div className="space-y-6">
                        {/* Sentiment Overview */}
                        <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                <span className="text-blue-400 mr-2">🧠</span>
                                Market Sentiment Analysis
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {sentimentData.map((sentiment, index) => (
                                    <div key={index} className="bg-slate-700/30 rounded-lg p-4 text-center">
                                        <h3 className="font-semibold mb-3">{sentiment.symbol}</h3>
                                        {renderSentimentGauge(sentiment)}
                                        <div className="mt-3 space-y-1 text-xs text-slate-300">
                                            <div>Score: {sentiment.score.toFixed(2)}</div>
                                            <div>News: {sentiment.sources.news?.articles || 0} articles</div>
                                            <div>Social: {sentiment.sources.social?.mentions || 0} mentions</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'portfolio' && portfolioData && (
                    <div className="space-y-6">
                        {/* Portfolio Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                                <h3 className="text-lg font-semibold mb-2">Total Value</h3>
                                <div className="text-2xl font-bold text-green-400">
                                    ${portfolioData.totalValue.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                                <h3 className="text-lg font-semibold mb-2">Total Return</h3>
                                <div className={`text-2xl font-bold ${getChangeColor(portfolioData.totalReturn)}`}>
                                    {portfolioData.totalReturnPercent >= 0 ? '+' : ''}{portfolioData.totalReturnPercent.toFixed(2)}%
                                </div>
                            </div>
                            <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                                <h3 className="text-lg font-semibold mb-2">Sharpe Ratio</h3>
                                <div className="text-2xl font-bold text-blue-400">
                                    {portfolioData.riskMetrics.sharpeRatio.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Holdings */}
                        <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                            <h2 className="text-2xl font-semibold mb-4">Portfolio Holdings</h2>
                            <div className="space-y-3">
                                {portfolioData.holdings.map((holding, index) => (
                                    <div key={index} className="flex justify-between items-center bg-slate-700/30 rounded-lg p-3">
                                        <div>
                                            <span className="font-semibold">{holding.symbol}</span>
                                            <span className="text-slate-400 ml-2">{holding.weight.toFixed(1)}%</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">${holding.value.toLocaleString()}</div>
                                            <div className={`text-sm ${getChangeColor(holding.returnPercent)}`}>
                                                {holding.returnPercent >= 0 ? '+' : ''}{holding.returnPercent.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Actionable Insights */}
                <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center">
                        <span className="text-green-400 mr-2">💡</span>
                        Actionable Market Insights
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {insights.map((insight, index) => (
                            <div key={index} className={`rounded-lg p-5 border-2 ${getSeverityColor(insight.severity)}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-lg">{insight.title}</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-slate-400 uppercase">{insight.category}</span>
                                        <div className={`w-2 h-2 rounded-full ${getConfidenceColor(insight.confidence)}`}></div>
                                    </div>
                                </div>

                                <p className="text-slate-300 text-sm mb-3">{insight.description}</p>

                                <div className="bg-slate-600/30 rounded-md p-3 mb-3">
                                    <p className="text-sm font-medium text-blue-300">🎯 Action Required:</p>
                                    <p className="text-sm text-slate-200">{insight.actionable}</p>
                                </div>

                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>Confidence: {insight.confidence}%</span>
                                    <span>Timeframe: {insight.timeframe}-term</span>
                                    <span className={`px-2 py-1 rounded ${insight.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                                            insight.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                'bg-blue-500/20 text-blue-300'
                                        }`}>
                                        {insight.severity.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};