# SokoAnalyst Dynamic Prompts System

## 🎯 **15 Dynamic Prompts Generated**

### **Intelligent Prompt Categories**

#### **1. Market Analysis (3 prompts)**

- **Current Market Overview**: Comprehensive analysis of market conditions with major indices and sector performance
- **Sector Deep Dive**: Detailed sector analysis with rotation patterns and investment thesis
- **Market Volatility Assessment**: Professional volatility analysis with VIX and hedging strategies

#### **2. Technical Analysis (2 prompts)**

- **Technical Breakout Analysis**: Comprehensive technical analysis with specific entry/exit levels
- **Multi-Timeframe Analysis**: Advanced multi-timeframe technical analysis with trend alignment

#### **3. Cryptocurrency (2 prompts)**

- **Crypto Market Correlation Analysis**: Correlation patterns between crypto and traditional markets
- **DeFi Protocol Analysis**: Comprehensive DeFi ecosystem analysis with yield strategies

#### **4. Sentiment & News Analysis (1 prompt)**

- **Earnings Season Sentiment**: Market sentiment around earnings with options flow analysis

#### **5. Macro Analysis (1 prompt)**

- **Federal Reserve Policy Impact**: Macro policy analysis with cross-asset implications

#### **6. Portfolio Management (2 prompts)**

- **Portfolio Optimization Strategy**: Professional portfolio optimization with risk management
- **Risk Parity Analysis**: Advanced risk parity portfolio construction

#### **7. AI & Quantitative Analysis (2 prompts)**

- **AI-Powered Market Prediction**: Advanced AI-powered market forecasting with probabilities
- **Quantitative Stock Screening**: Multi-factor quantitative stock screening

#### **8. Global Markets (2 prompts)**

- **Global Markets Interconnection**: Comprehensive global markets analysis with currency impacts
- **Emerging Markets Opportunity**: Emerging markets analysis with allocation strategies

## 🧠 **Smart Features**

### **Dynamic Context Awareness**

- **Time-Sensitive**: Prompts adapt based on market hours, weekends, and time of day
- **Symbol Rotation**: Uses random selection from popular symbols (AAPL, TSLA, NVDA, etc.)
- **Market Context**: Adds real-time context like "Live Markets" or "After Hours"

### **Intelligent Categorization**

- **10 Categories**: Market Analysis, Technical Analysis, Crypto, Sentiment, etc.
- **3 Difficulty Levels**: Beginner, Intermediate, Advanced
- **Time Estimates**: 2-6 minutes per analysis
- **Smart Tags**: Searchable tags for easy filtering

### **Contextual Prompts Examples**

#### **Market Analysis - Current Market Overview**

```
"Provide a comprehensive analysis of current market conditions. Focus on major indices, sector performance, and key market drivers affecting AAPL, TSLA, NVDA. Include risk assessment and outlook. Focus on real-time market movements and intraday patterns."
```

#### **AI Analysis - Market Prediction**

```
"Use AI reasoning to predict market movements for the next 1-3 months. Analyze multiple data sources including technical indicators, sentiment data, and macro factors. Provide probability-weighted scenarios with confidence intervals. Include after-hours developments and overnight market influences."
```

#### **Cryptocurrency - DeFi Analysis**

```
"Evaluate the current DeFi landscape focusing on TVL trends, yield farming opportunities, and protocol risks. Analyze major DeFi tokens and their tokenomics. Provide risk-adjusted yield strategies. Provide strategic analysis for the upcoming trading week."
```

## 🎨 **UI Components**

### **Main Dynamic Prompts Component**

- **Smart Grid Layout**: Responsive 3-column grid with expandable view
- **Advanced Filtering**: Search, category, and difficulty filters
- **Interactive Cards**: Hover effects with gradient backgrounds
- **Real-time Stats**: Live counts and metrics

### **Quick Prompts Preview**

- **Integrated in Interface**: 4 featured prompts in the main interface
- **One-Click Access**: Direct prompt selection
- **Visual Indicators**: Icons and color-coded categories

### **Professional Styling**

- **Gradient Backgrounds**: Beautiful indigo/purple gradients
- **Color-Coded Categories**: Each category has unique colors
- **Difficulty Badges**: Green (Beginner), Yellow (Intermediate), Red (Advanced)
- **Interactive Elements**: Hover animations and transitions

## 🔧 **Technical Implementation**

### **Dynamic Generation System**

```typescript
export function generateDynamicPrompts(): DynamicPrompt[];
```

- **Context-Aware**: Adapts to market hours and time of day
- **Symbol Rotation**: Random selection from curated symbol lists
- **Category Distribution**: Balanced across all analysis types

### **Filtering & Search**

```typescript
export function searchPrompts(query: string): DynamicPrompt[];
export function getPromptsByCategory(category: string): DynamicPrompt[];
export function getPromptsByDifficulty(difficulty: string): DynamicPrompt[];
```

### **Smart Features**

- **Real-time Context**: Market hours detection
- **Random Selection**: Prevents repetitive prompts
- **Tag-based Search**: Intelligent keyword matching
- **Category Filtering**: Professional organization

## 📊 **Prompt Distribution**

### **By Difficulty**

- **Beginner**: 2 prompts (13%)
- **Intermediate**: 7 prompts (47%)
- **Advanced**: 6 prompts (40%)

### **By Category**

- **Market Analysis**: 3 prompts (20%)
- **Technical Analysis**: 2 prompts (13%)
- **Cryptocurrency**: 2 prompts (13%)
- **Portfolio/Risk Management**: 4 prompts (27%)
- **AI/Quantitative**: 2 prompts (13%)
- **Global/Macro**: 2 prompts (13%)

### **By Time Estimate**

- **2-3 minutes**: 3 prompts
- **3-4 minutes**: 6 prompts
- **4-5 minutes**: 4 prompts
- **5-6 minutes**: 2 prompts

## 🚀 **User Experience Features**

### **Smart Prompt Selection**

- **One-Click Use**: Direct integration with chat interface
- **Context Preservation**: Maintains user preferences
- **Visual Feedback**: Clear selection indicators

### **Professional Interface**

- **Executive Dashboard**: Corporate-grade design
- **Responsive Layout**: Works on all devices
- **Accessibility**: Keyboard navigation and screen reader support

### **Real-time Updates**

- **Live Context**: Updates based on market conditions
- **Dynamic Content**: Fresh prompts on each visit
- **Smart Suggestions**: Contextually relevant recommendations

## 🎯 **Integration Points**

### **CopilotKit Integration**

- **Direct Chat**: Prompts sent directly to agent
- **Context Preservation**: Maintains conversation flow
- **Response Formatting**: Uses formatted response system

### **Agent Integration**

- **Tool Matching**: Prompts designed for available tools
- **Response Optimization**: Formatted for digestible output
- **Professional Analysis**: Institutional-grade insights

## 📈 **System Status**

**Dynamic Prompts**: ✅ **COMPLETE** - 15 intelligent prompts generated
**UI Components**: ✅ **IMPLEMENTED** - Professional interface with filtering
**Context Awareness**: ✅ **ACTIVE** - Real-time market context integration
**Search & Filter**: ✅ **FUNCTIONAL** - Advanced filtering capabilities
**Professional Design**: ✅ **DEPLOYED** - Corporate-grade interface

The SokoAnalyst system now provides users with 15 intelligent, context-aware prompts that adapt to market conditions and provide professional-grade analysis suggestions across all major financial analysis categories.
