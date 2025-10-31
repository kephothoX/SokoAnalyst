'use client';

import React, { useState, useEffect } from 'react';
import { generateDynamicPrompts, getPromptCategories, searchPrompts, type DynamicPrompt } from '@/lib/dynamicPrompts';

interface DynamicPromptsProps {
    onPromptSelect: (prompt: string) => void;
    className?: string;
}

export const DynamicPrompts: React.FC<DynamicPromptsProps> = ({ onPromptSelect, className = '' }) => {
    const [prompts, setPrompts] = useState<DynamicPrompt[]>([]);
    const [filteredPrompts, setFilteredPrompts] = useState<DynamicPrompt[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [executingPrompt, setExecutingPrompt] = useState<string | null>(null);

    // Enhanced prompt execution with visual feedback

    useEffect(() => {
        const generatedPrompts = generateDynamicPrompts();
        const promptCategories = getPromptCategories();

        setPrompts(generatedPrompts);
        setFilteredPrompts(generatedPrompts);
        setCategories(promptCategories);
    }, []);

    useEffect(() => {
        let filtered = prompts;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = searchPrompts(searchQuery);
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(prompt => prompt.category === selectedCategory);
        }

        // Filter by difficulty
        if (selectedDifficulty !== 'All') {
            filtered = filtered.filter(prompt => prompt.difficulty === selectedDifficulty);
        }

        setFilteredPrompts(filtered);
    }, [prompts, selectedCategory, selectedDifficulty, searchQuery]);

    const handlePromptClick = async (prompt: DynamicPrompt) => {
        try {
            setExecutingPrompt(prompt.id);

            // Enhanced visual feedback
            const notification = document.createElement('div');
            notification.innerHTML = `
                <div class="fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-bounce border border-blue-400/30">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <span class="text-lg">${prompt.icon}</span>
                        </div>
                        <div>
                            <div class="font-bold text-lg">${prompt.title}</div>
                            <div class="text-sm opacity-90">Analysis ready! Paste in chat sidebar →</div>
                            <div class="text-xs opacity-75 mt-1">Estimated time: ${prompt.estimatedTime}</div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);

            // Call the onPromptSelect callback to handle the prompt
            onPromptSelect(prompt.prompt);

            // Close expanded view after selection
            setIsExpanded(false);

            console.log(`🎯 Executed prompt: ${prompt.title} (${prompt.category})`);
            console.log(`📊 Prompt details:`, {
                difficulty: prompt.difficulty,
                estimatedTime: prompt.estimatedTime,
                tags: prompt.tags
            });

            // Remove notification after 5 seconds
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 5000);

        } catch (error) {
            console.error('❌ Failed to execute prompt:', error);

            // Show error notification
            const errorNotification = document.createElement('div');
            errorNotification.innerHTML = `
                <div class="fixed top-4 right-4 bg-red-500/90 text-white px-4 py-3 rounded-lg shadow-lg z-50">
                    ❌ Failed to execute prompt. Please try again.
                </div>
            `;
            document.body.appendChild(errorNotification);

            setTimeout(() => {
                if (document.body.contains(errorNotification)) {
                    document.body.removeChild(errorNotification);
                }
            }, 3000);
        } finally {
            // Clear executing state after a delay
            setTimeout(() => setExecutingPrompt(null), 2000);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            'Market Analysis': 'bg-blue-500/20 text-blue-400',
            'Technical Analysis': 'bg-purple-500/20 text-purple-400',
            'Cryptocurrency': 'bg-orange-500/20 text-orange-400',
            'Sentiment Analysis': 'bg-green-500/20 text-green-400',
            'Portfolio Management': 'bg-indigo-500/20 text-indigo-400',
            'Risk Management': 'bg-red-500/20 text-red-400',
            'AI Analysis': 'bg-pink-500/20 text-pink-400',
            'Quantitative Analysis': 'bg-cyan-500/20 text-cyan-400',
            'Global Markets': 'bg-emerald-500/20 text-emerald-400',
            'Macro Analysis': 'bg-violet-500/20 text-violet-400'
        };
        return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
    };

    return (
        <div className={`bg-gradient-to-r from-slate-900/50 to-indigo-900/50 backdrop-blur-xl rounded-2xl border border-indigo-500/20 ${className}`}>
            {/* Header */}
            <div className="p-6 border-b border-indigo-500/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">🎯</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Smart Prompts</h2>
                            <p className="text-slate-300">AI-generated analysis suggestions</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg transition-all duration-300 border border-indigo-500/30"
                    >
                        {isExpanded ? 'Collapse' : 'Explore All'}
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-400">{prompts.length}</div>
                        <div className="text-sm text-slate-400">Total Prompts</div>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-400">{categories.length}</div>
                        <div className="text-sm text-slate-400">Categories</div>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-400">{prompts.filter(p => p.difficulty === 'advanced').length}</div>
                        <div className="text-sm text-slate-400">Advanced</div>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-orange-400">Live</div>
                        <div className="text-sm text-slate-400">Real-time</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            {isExpanded && (
                <div className="p-6 border-b border-indigo-500/20 bg-slate-800/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search prompts..."
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-400 focus:border-indigo-500/50 focus:outline-none"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white focus:border-indigo-500/50 focus:outline-none"
                            >
                                <option value="All">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white focus:border-indigo-500/50 focus:outline-none"
                            >
                                <option value="All">All Levels</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-sm text-slate-400">
                        Showing {filteredPrompts.length} of {prompts.length} prompts
                    </div>
                </div>
            )}

            {/* Prompts Grid */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(isExpanded ? filteredPrompts : filteredPrompts.slice(0, 6)).map((prompt) => (
                        <div
                            key={prompt.id}
                            onClick={() => handlePromptClick(prompt)}
                            className={`bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-600/30 rounded-xl p-4 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/10 group ${executingPrompt === prompt.id ? 'border-green-500/50 bg-green-500/10 animate-pulse' : ''
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl">{prompt.icon}</span>
                                    <div className="flex flex-col">
                                        <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(prompt.category)}`}>
                                            {prompt.category}
                                        </span>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(prompt.difficulty)}`}>
                                    {prompt.difficulty}
                                </span>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                                {prompt.title}
                            </h3>
                            <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                                {prompt.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {prompt.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>⏱️ {prompt.estimatedTime}</span>
                                {executingPrompt === prompt.id ? (
                                    <span className="text-green-400 flex items-center space-x-1">
                                        <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Executing...</span>
                                    </span>
                                ) : (
                                    <span className="text-indigo-400 group-hover:text-indigo-300">Click to execute →</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show More Button */}
                {!isExpanded && filteredPrompts.length > 6 && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            View All {filteredPrompts.length} Prompts
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};