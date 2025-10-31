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
}

interface TechnicalIndicator {
    name: string;
    value: number | string;
    signal: 'bullish' | 'bearish' | 'neutral';
    description: string;
}

interface MarketInsight {
    title: string;
    description: string;
    confidence: number;
    category: 'technical' | 'fundamental' | 'sentiment' | 'macro';
    timeframe: 'short' | 'medium' | 'long';
    actionable: string;
}

export const MarketDashboard: React.FC = () => {
    const [selectedMarket, setSelectedMarket] = useState<'stocks' | 'crypto' | 'forex' | 'commodities'>('stocks');
    const [marketData, setMarketData] = useState<MarketData[]>([]);
    const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
    const [insights, setInsights] = useState<MarketInsight[]>([]);
    const [loading, setLoading] = useState(false);

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
        try {
            const response = await fetch('/api/soko/technical-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol,
                    indicators: ['RSI', 'MACD', 'SMA', 'BB'],
                    period: 14
                }),
            });

            const result = await response.json();
            if (result.success) {
                const indicators: TechnicalIndicator[] = [];

                if (result.analysis.indicators.RSI) {
                    indicators.push({
                        name: 'RSI',
                        value: result.analysis.indicators.RSI.value.toFixed(2),
                        signal: result.analysis.indicators.RSI.signal,
                        description: `Relative Strength Index: ${result.analysis.indicators.RSI.signal}`
                    });
                }

                if (result.analysis.indicators.MACD) {
                    indicators.push({
                        name: 'MACD',
                        value: result.analysis.indicators.MACD.macd.toFixed(4),
                        signal: result.analysis.indicators.MACD.trend === 'bullish' ? 'bullish' : 'bearish',
                        description: `MACD trend: ${result.analysis.indicators.MACD.trend}`
                    });
                }

                setTechnicalIndicators(indicators);
            }
        } catch (error) {
            console.error('Failed to fetch technical analysis:', error);
        }
    };

    const generateInsights = () => {
        const mockInsights: MarketInsight[] = [
            {
                title: "Tech Sector Momentum Building",
                description: "Strong earnings from major tech companies driving sector rotation",
                confidence: 85,
                category: 'fundamental',
                timeframe: 'medium',
                actionable: "Consider increasing tech allocation by 5-10% on any pullback below key support"
            },
            {
                title: "Bitcoin Consolidation Pattern",
                description: "BTC forming ascending triangle, potential breakout above $45K",
                confidence: 72,
                category: 'technical',
                timeframe: 'short',
                actionable: "Watch for volume confirmation above $45K resistance for long entry"
            },
            {
                title: "Dollar Strength Pressuring Commodities",
                description: "DXY rally creating headwinds for gold and oil prices",
                confidence: 78,
                category: 'macro',
                timeframe: 'medium',
                actionable: "Hedge commodity exposure or wait for USD weakness signals"
            },
            {
                title: "Market Sentiment Improving",
                description: "Fear & Greed index moving from extreme fear to neutral territory",
                confidence: 68,
                category: 'sentiment',
                timeframe: 'short',
                actionable: "Gradual risk-on positioning as sentiment stabilizes"
            }
        ];

        setInsights(mockInsights);
    };

    useEffect(() => {
        fetchMarketData(selectedMarket, marketSymbols[selectedMarket]);
        generateInsights();
    }, [selectedMarket]);

    const getChangeColor = (change: number) => {
        return change >= 0 ? 'text-green-400' : 'text-red-400';
    };

    const getSignalColor = (signal: string) => {
        switch (signal) {
            case 'bullish': return 'text-green-400';
            case 'bearish': return 'text-red-400';
            default: return 'text-yellow-400';
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'bg-green-500';
        if (confidence >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        SokoAnalyst
                    </h1>
                    <p className="text-xl text-slate-300">
                        Elite Financial Markets Intelligence
                    </p>
                </div>

                {/* Market Selector */}
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-2 flex space-x-2">
                        {Object.keys(marketSymbols).map((market) => (
                            <button
                                key={market}
                                onClick={() => setSelectedMarket(market as any)}
                                className={`
                  px-6 py-2 rounded-md transition-all capitalize font-medium
                  ${selectedMarket === market
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }
                `}
                            >
                                {market}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Market Data Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Market Overview */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                <span className="text-blue-400 mr-2">📊</span>
                                Market Overview - {selectedMarket.toUpperCase()}
                            </h2>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {marketData.map((asset, index) => (
                                        <div
                                            key={asset.symbol}
                                            className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-blue-400 transition-all cursor-pointer"
                                            onClick={() => fetchTechnicalAnalysis(asset.symbol)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-lg">{asset.symbol}</h3>
                                                <span className={`text-sm font-medium ${getChangeColor(asset.change)}`}>
                                                    {asset.changePercent.toFixed(2)}%
                                                </span>
                                            </div>

                                            <div className="space-y-1 text-sm text-slate-300">
                                                <div className="flex justify-between">
                                                    <span>Price:</span>
                                                    <span className="font-medium">${asset.price.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Change:</span>
                                                    <span className={getChangeColor(asset.change)}>
                                                        {asset.change >= 0 ? '+' : ''}${asset.change.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Volume:</span>
                                                    <span>{(asset.volume / 1000000).toFixed(1)}M</span>
                                                </div>
                                                {asset.marketCap && (
                                                    <div className="flex justify-between">
                                                        <span>Market Cap:</span>
                                                        <span>${(asset.marketCap / 1000000000).toFixed(1)}B</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Technical Indicators */}
                    <div className="space-y-6">
                        <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <span className="text-purple-400 mr-2">📈</span>
                                Technical Signals
                            </h2>

                            {technicalIndicators.length > 0 ? (
                                <div className="space-y-3">
                                    {technicalIndicators.map((indicator, index) => (
                                        <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium">{indicator.name}</span>
                                                <span className={`text-sm font-medium ${getSignalColor(indicator.signal)}`}>
                                                    {indicator.signal.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-300">
                                                <div>Value: {indicator.value}</div>
                                                <div className="text-xs mt-1">{indicator.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 text-center py-8">
                                    Click on an asset to view technical analysis
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Market Insights */}
                <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center">
                        <span className="text-green-400 mr-2">💡</span>
                        Actionable Market Insights
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {insights.map((insight, index) => (
                            <div key={index} className="bg-slate-700/30 rounded-lg p-5 border border-slate-600">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-lg">{insight.title}</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-slate-400 uppercase">{insight.category}</span>
                                        <div className={`w-2 h-2 rounded-full ${getConfidenceColor(insight.confidence)}`}></div>
                                    </div>
                                </div>

                                <p className="text-slate-300 text-sm mb-3">{insight.description}</p>

                                <div className="bg-slate-600/30 rounded-md p-3 mb-3">
                                    <p className="text-sm font-medium text-blue-300">Actionable Step:</p>
                                    <p className="text-sm text-slate-200">{insight.actionable}</p>
                                </div>

                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>Confidence: {insight.confidence}%</span>
                                    <span>Timeframe: {insight.timeframe}-term</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Market Heatmap Placeholder */}
                <div className="mt-8 bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center">
                        <span className="text-red-400 mr-2">🔥</span>
                        Global Markets Heatmap
                    </h2>

                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {Array.from({ length: 32 }, (_, i) => {
                            const change = (Math.random() - 0.5) * 10;
                            const intensity = Math.abs(change) / 5;
                            const color = change >= 0
                                ? `rgba(34, 197, 94, ${intensity})`
                                : `rgba(239, 68, 68, ${intensity})`;

                            return (
                                <div
                                    key={i}
                                    className="aspect-square rounded-md flex items-center justify-center text-xs font-medium border border-slate-600"
                                    style={{ backgroundColor: color }}
                                >
                                    {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-center mt-4 space-x-6 text-sm text-slate-400">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span>Strong Gains</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span>Strong Losses</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-slate-600 rounded"></div>
                            <span>Neutral</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};