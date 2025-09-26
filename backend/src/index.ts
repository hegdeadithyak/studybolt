import express from "express";
import fetch from "node-fetch";
import {Redis} from "ioredis";
import crypto from "crypto";
import { Mistral } from "@mistralai/mistralai";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const CACHE_TTL = 3600;

const redis = new Redis(REDIS_URL);
const mistralClient = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || "tGsvbOWDLMajM87EeiFu1551E1EhpoRu",
});

const STUDYBOLT_AGENT_ID = "ag:26507ac4:20250924:untitled-agent:81db0d98";

app.use(express.json({ limit: "1mb" }));
app.use(cors());

async function performWebSearch(query: string, numResults = 5) {
  const apiKey = process.env.SERP_API_KEY;
  

  try {
    const url = `https://serpapi.com/search?q=${encodeURIComponent(query)}&num=${numResults}&api_key=${apiKey}&engine=google`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`SERP request failed: ${response.status}`);
    }
    
    const data = await response.json() as any;
    const results = data.organic_results || [];
    
    return results.slice(0, numResults).map((result: any, idx: number) => ({
      id: `search-result-${idx + 1}`,
      title: result.title || 'No title',
      snippet: result.snippet || '',
      link: result.link || '',
      text: `${result.title || ''}\n${result.snippet || ''}\nSource: ${result.link || ''}`
    }));
    
  } catch (error) {
    console.error("Search failed:", error);
    return {};
  }
}

function createSearchAugmentedMessages(messages: any[], searchResults: any[]) {
  const contextText = searchResults
    .map(result => `[${result.title}]\n${result.snippet}\nSource: ${result.link}`)
    .join('\n\n---\n\n');

  const systemPrompt = {
    role: "system",
    content: `You are StudyBolt, an AI study assistant. You have access to current web search results to provide accurate, up-to-date information.

When an swering:
- Use the search results provided to give comprehensive answers
- Cite sources when making specific claims
- If search results don't fully answer the question, acknowledge limitations
- Focus on being helpful for studying and learning
- Structure responses clearly with proper formatting

Current search results:
${contextText}`
  };

  return [systemPrompt, ...messages];
}

app.post('/api/chat', async (req, res) => {
  console.log(req);
  const { messages, enableSearch = false } = req.body;
  
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  try {
    let messagesToSend = messages;
    
    // If search is enabled, perform web search on the latest user message
    if (enableSearch) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        const searchResults = await performWebSearch(lastMessage.content, 5);
        messagesToSend = createSearchAugmentedMessages(messages, searchResults);
      }
    }

    // Stream response from Mistral
    const stream = await mistralClient.agents.stream({
      agentId: STUDYBOLT_AGENT_ID,
      messages: messagesToSend,
    });

    for await (const chunk of stream) {
      console.log(chunk);
      const content = chunk.data.choices?.[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Streaming error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate response' })}\n\n`);
    res.end();
  }
});

// Dedicated search endpoint
app.post('/api/search', async (req, res) => {
  const { query, numResults = 5 } = req.body;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  const cacheKey = crypto.createHash('sha256').update(`search:${query.trim()}:${numResults}`).digest('hex');
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return res.json({ source: 'cache', ...JSON.parse(cached) });
  }

  try {
    const searchResults = await performWebSearch(query, numResults);
    
    // Create AI-enhanced summary
    const messages = [{
      role: "system",
      content: "You are a research assistant. Provide a concise summary of the search results below, highlighting key points and insights."
    }, {
      role: "user", 
      content: `Please summarize these search results for the query "${query}":\n\n${searchResults.map(r => r.text).join('\n\n')}`
    }];

    const response = await mistralClient.agents.complete({
      agentId: STUDYBOLT_AGENT_ID,
      messages,
    });

    const result = {
      query,
      summary: response.choices?.[0]?.message?.content || '',
      sources: searchResults.map(r => ({
        title: r.title,
        snippet: r.snippet,
        link: r.link,
        id: r.id
      })),
      timestamp: new Date().toISOString()
    };

    // Cache result
    await redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL);
    
    res.json({ source: 'fresh', ...result });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', message: (error as any).message });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await redis.ping();
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      agentId: STUDYBOLT_AGENT_ID,
      redis: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      redis: 'disconnected',
      error: (error as any).message 
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'StudyBolt API',
    version: '2.1.0',
    endpoints: {
      'POST /api/chat': 'Main chat endpoint (set enableSearch: true for web search)',
      'POST /api/search': 'Dedicated search endpoint',
      'GET /health': 'Health check'
    }
  });
});

app.listen(PORT, () => {
  console.log(`StudyBolt API running on port ${PORT}`);
  console.log(`Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`Search endpoint: http://localhost:${PORT}/api/search`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await redis.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await redis.disconnect();
  process.exit(0);
});