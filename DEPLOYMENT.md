# SokoAnalyst Deployment Guide

This guide covers deploying SokoAnalyst to the Nosana decentralized compute network.

## 🚀 Quick Deployment

### Prerequisites

- Docker installed locally
- Nosana CLI installed (`npm install -g @nosana/cli`)
- Docker Hub account (or alternative registry)

### Step 1: Build and Push Docker Image

```bash
# Build the SokoAnalyst Docker image
docker build -t yourusername/sokoanalyst:latest .

# Test locally (optional)
docker run -p 3000:3000 -p 4111:4111 yourusername/sokoanalyst:latest

# Push to Docker Hub
docker login
docker push yourusername/sokoanalyst:latest
```

### Step 2: Update Job Definition

Edit `nos_job_def/sokoanalyst_nosana_job.json` and replace `yourusername/sokoanalyst:latest` with your actual Docker image:

```json
{
  "spec": {
    "image": "yourusername/sokoanalyst:latest"
  }
}
```

### Step 3: Deploy to Nosana

```bash
# Deploy using Nosana CLI
nosana job post --file ./nos_job_def/sokoanalyst_nosana_job.json --market nvidia-3090 --timeout 60

# Or use the dashboard method (see below)
```

### Step 4: Access Your Deployment

Once deployed, Nosana will provide URLs for:

- **Main Dashboard**: `https://your-deployment-url.nos.ci` (Port 3000)
- **Agent API**: `https://your-deployment-url.nos.ci:4111` (Port 4111)
- **Health Check**: `https://your-deployment-url.nos.ci:8080` (Port 8080)

## 🖥️ Dashboard Deployment

### Using Nosana Dashboard

1. **Open Dashboard**: Go to [Nosana Dashboard](https://dashboard.nosana.com/deploy)

2. **Expand Job Editor**: Click `Expand` to open the job definition editor

3. **Copy Job Definition**: Copy the contents of `nos_job_def/sokoanalyst_nosana_job.json`

4. **Update Image**: Replace `yourusername/sokoanalyst:latest` with your Docker image

5. **Paste and Deploy**:

   - Paste the job definition
   - Select GPU type (nvidia-3090 recommended)
   - Click `Deploy`

6. **Monitor Deployment**: Watch the deployment progress in the dashboard

## 🔧 Configuration Options

### Environment Variables

You can customize the deployment by modifying environment variables in the job definition:

```json
{
  "env": [
    {
      "name": "MODEL_NAME_AT_ENDPOINT",
      "value": "qwen2.5:0.5b"
    },
    {
      "name": "OLLAMA_API_URL",
      "value": "http://localhost:11434"
    },
    {
      "name": "NOS_OLLAMA_API_URL",
      "value": "https://your-nosana-endpoint.nos.ci/api"
    }
  ]
}
```

### Resource Requirements

Adjust resources based on your needs:

```json
{
  "resources": {
    "cpu": 4, // CPU cores
    "memory": "8Gi", // RAM
    "gpu": 1, // GPU count
    "storage": "20Gi" // Disk space
  }
}
```

### GPU Selection

Choose appropriate GPU market:

- `nvidia-3090` - High performance (recommended)
- `nvidia-4090` - Maximum performance
- `nvidia-a100` - Enterprise grade
- `any` - Any available GPU

## 📊 Monitoring and Health Checks

### Health Check Endpoint

SokoAnalyst includes a built-in health check at `/health`:

```bash
curl https://your-deployment-url.nos.ci:8080/health
```

Response:

```json
{
  "status": "healthy",
  "service": "SokoAnalyst",
  "timestamp": "2024-10-27T12:00:00.000Z"
}
```

### Service Status

Check individual service status:

1. **Frontend (Port 3000)**: Main SokoAnalyst dashboard
2. **Agent API (Port 4111)**: Mastra agent endpoints
3. **Ollama (Port 11434)**: LLM inference (internal)
4. **Health Check (Port 8080)**: Service monitoring

### Logs and Debugging

View deployment logs through:

- Nosana Dashboard logs section
- CLI: `nosana job logs <job-id>`

Common startup sequence:

```
🚀 Starting SokoAnalyst on Nosana...
📡 Starting Ollama server...
⏳ Waiting for Ollama to be ready...
📥 Pulling lightweight Qwen model...
🌐 Starting SokoAnalyst application...
```

## 🔒 Security Considerations

### Network Security

- All services run on internal network
- Only specified ports are exposed
- Health checks use internal endpoints

### Data Privacy

- No sensitive data stored in container
- Market data processed in memory
- User sessions are stateless

### Resource Limits

- Memory limits prevent resource exhaustion
- CPU limits ensure fair resource sharing
- Storage limits prevent disk overflow

## 🚨 Troubleshooting

### Common Issues

#### 1. Container Fails to Start

```bash
# Check job status
nosana job status <job-id>

# View logs
nosana job logs <job-id>
```

**Solutions**:

- Verify Docker image exists and is public
- Check resource requirements
- Ensure job definition syntax is valid

#### 2. Ollama Model Download Fails

**Symptoms**: Agent responses are slow or fail
**Solutions**:

- Use smaller model (qwen2.5:0.5b)
- Configure external Ollama endpoint
- Increase timeout in job definition

#### 3. Frontend Not Accessible

**Symptoms**: Cannot access dashboard
**Solutions**:

- Check port exposure in job definition
- Verify health check passes
- Wait for full startup (can take 2-3 minutes)

#### 4. Agent API Errors

**Symptoms**: API calls return 500 errors
**Solutions**:

- Check Mastra agent logs
- Verify model is loaded
- Restart deployment if needed

### Performance Optimization

#### 1. Model Selection

- **Development**: `qwen2.5:0.5b` (fast, lower accuracy)
- **Production**: `qwen2.5:1.5b` (balanced)
- **High Performance**: `qwen2.5:3b` (slower, higher accuracy)

#### 2. Resource Tuning

```json
{
  "resources": {
    "cpu": 2, // Minimum for basic operation
    "memory": "4Gi", // Minimum for small models
    "gpu": 1, // Required for model inference
    "storage": "10Gi" // Minimum for model storage
  }
}
```

#### 3. Caching Strategy

- Models are cached after first download
- Market data cached for performance
- Agent state persisted in memory

## 📈 Scaling and Load Balancing

### Horizontal Scaling

Deploy multiple instances with different job definitions:

```bash
# Deploy multiple instances
nosana job post --file ./nos_job_def/sokoanalyst_nosana_job.json --market nvidia-3090
nosana job post --file ./nos_job_def/sokoanalyst_nosana_job.json --market nvidia-4090
```

### Load Distribution

- Each instance handles independent requests
- No shared state between instances
- Client-side load balancing recommended

### Auto-scaling

Configure restart policy for automatic recovery:

```json
{
  "restart_policy": "always",
  "health_check": {
    "retries": 3,
    "start_period": "90s"
  }
}
```

## 💰 Cost Optimization

### Resource Efficiency

- Use smallest viable model for your use case
- Optimize memory usage with appropriate limits
- Choose cost-effective GPU markets

### Market Selection

- Monitor Nosana market prices
- Use `any` GPU type for cost optimization
- Consider off-peak deployment times

### Usage Patterns

- Scale down during low usage periods
- Use health checks to prevent unnecessary restarts
- Monitor resource utilization

## 🔄 Updates and Maintenance

### Updating SokoAnalyst

1. **Build New Image**:

   ```bash
   docker build -t yourusername/sokoanalyst:v1.1.0 .
   docker push yourusername/sokoanalyst:v1.1.0
   ```

2. **Update Job Definition**:

   ```json
   {
     "spec": {
       "image": "yourusername/sokoanalyst:v1.1.0"
     }
   }
   ```

3. **Redeploy**:
   ```bash
   nosana job post --file ./nos_job_def/sokoanalyst_nosana_job.json
   ```

### Rolling Updates

- Deploy new version alongside old
- Test new version thoroughly
- Switch traffic to new version
- Terminate old version

### Backup and Recovery

- Export agent configurations
- Save custom tool definitions
- Document environment variables
- Keep job definition versions

## 📞 Support and Community

### Getting Help

- **Nosana Discord**: [Join here](https://nosana.com/discord)
- **Builders Channel**: [Dev Chat](https://discord.com/channels/236263424676331521/1354391113028337664)
- **Documentation**: [Nosana Docs](https://docs.nosana.io)

### Reporting Issues

1. Check troubleshooting section
2. Search existing issues
3. Provide deployment logs
4. Include job definition
5. Describe expected vs actual behavior

### Community Resources

- **Example Deployments**: Community showcase
- **Best Practices**: Deployment patterns
- **Performance Tips**: Optimization guides
- **Security Guidelines**: Security recommendations

---

**SokoAnalyst** is now ready for deployment on the Nosana decentralized compute network! 🚀

For additional support or questions, reach out to the community or check the comprehensive documentation.
