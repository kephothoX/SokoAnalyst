# syntax=docker/dockerfile:1
# Multi-stage Dockerfile for SokoAnalyst on Nosana

FROM node:lts AS build

# Install system dependencies including Ollama
RUN apt-get update && apt-get install -y \
    curl \
    bash \
    python3 \
    build-essential \
    && curl -fsSL https://ollama.com/install.sh | sh \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Disable Analytics/Telemetry
ENV DISABLE_TELEMETRY=true
ENV POSTHOG_DISABLED=true
ENV MASTRA_TELEMETRY_DISABLED=true
ENV DO_NOT_TRACK=1
ENV NEXT_TELEMETRY_DISABLED=1

# Ensure logs are visible (disable buffering)
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY pnpm-lock.yaml ./

RUN --mount=type=cache,target=/pnpm/store \
  pnpm fetch --frozen-lockfile

COPY package.json ./

RUN --mount=type=cache,target=/pnpm/store \
  pnpm install --frozen-lockfile --offline

COPY . .

# Build both agent and UI
RUN pnpm build

FROM node:lts AS runtime

# Install Ollama in runtime
RUN apt-get update && apt-get install -y \
    curl \
    bash \
    && curl -fsSL https://ollama.com/install.sh | sh \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -g 1001 appgroup && \
  useradd -u 1001 -g appgroup -m -d /app -s /bin/bash appuser

WORKDIR /app

COPY --from=build --chown=appuser:appgroup /app ./

# Create startup script for SokoAnalyst
RUN cat > /app/start-soko.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting SokoAnalyst on Nosana..."

# Start Ollama in background
echo "📡 Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to be ready..."
timeout=60
while [ $timeout -gt 0 ] && ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; do
  sleep 1
  timeout=$((timeout-1))
done

if [ $timeout -eq 0 ]; then
  echo "⚠️  Ollama failed to start, continuing without local model..."
else
  echo "📥 Pulling lightweight Qwen model..."
  ollama pull qwen2.5:0.5b || echo "⚠️  Model pull failed, will use remote endpoint"
fi

# Start the application
echo "🌐 Starting SokoAnalyst application..."
exec npm start
EOF

RUN chmod +x /app/start-soko.sh && chown appuser:appgroup /app/start-soko.sh

# Create health check endpoint
RUN cat > /app/health.js << 'EOF'
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      service: 'SokoAnalyst',
      timestamp: new Date().toISOString() 
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(8080, () => {
  console.log('Health check server running on port 8080');
});
EOF

ENV NODE_ENV=production \
    NODE_OPTIONS="--enable-source-maps" \
    OLLAMA_HOST=0.0.0.0:11434 \
    PORT=3000

USER appuser

# Expose ports for UI, Agent, Ollama, and Health Check
EXPOSE 3000 4111 11434 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start SokoAnalyst with all services
ENTRYPOINT ["/app/start-soko.sh"]
