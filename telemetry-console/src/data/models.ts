import { LlmModelConfig } from '../types/telemetry';

export const SUPPORTED_LLM_MODELS: LlmModelConfig[] = [
  // Google Gemini Provider
  {
    id: 'gemini-3.5-flash-lite',
    name: 'Gemini 3.5 Flash-Lite (Recommended)',
    provider: 'gemini',
    costTier: 'Free',
    costDescription: '$0.00 / Free Tier ($0.10/1M in, $0.40/1M out)',
    description: 'Most cost-effective, high-throughput model today. Ultra-low latency (<350ms), highly available, and 100% free in Google AI Studio tier.',
    contextWindow: '1M tokens'
  },
  {
    id: 'gemini-flash-lite-latest',
    name: 'Gemini Flash-Lite Latest',
    provider: 'gemini',
    costTier: 'Free',
    costDescription: '$0.00 / Free Tier',
    description: 'Auto-updating pointer to the latest production Flash-Lite checkpoint with instant uptime and zero downtime.',
    contextWindow: '1M tokens'
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'gemini',
    costTier: 'Low Cost',
    costDescription: '$0.75/1M in, $3.75/1M out',
    description: 'Google frontier multimodal flash reasoning engine with native thinking tokens.',
    contextWindow: '1M tokens'
  },
  {
    id: 'gemini-3.5-pro',
    name: 'Gemini 3.5 Pro',
    provider: 'gemini',
    costTier: 'Standard',
    costDescription: '$2.00 / 1M in',
    description: 'Google AI flagship reasoning model with deep multi-turn clinical context.',
    contextWindow: '2M tokens'
  },

  // OpenRouter Multi-Model Provider
  {
    id: 'google/gemma-4-31b-it:free',
    name: 'Google: Gemma 4 31B (Free)',
    provider: 'openrouter',
    costTier: 'Free',
    costDescription: '$0.00 / Zero Cost',
    description: 'Frontier dense multimodal model with 262K context window, native chain-of-thought reasoning, and function calling at zero cost via OpenRouter.',
    contextWindow: '262K tokens'
  },
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    name: 'Nvidia: Nemotron 3 Super 120B (Free)',
    provider: 'openrouter',
    costTier: 'Free',
    costDescription: '$0.00 / Zero Cost',
    description: 'Frontier 120B parameter model optimized by Nvidia for high-throughput reasoning and instant vernacular generation.',
    contextWindow: '128K tokens'
  },
  {
    id: 'qwen/qwen3.8-27b:free',
    name: 'Qwen: Qwen 3.8 27B (Free)',
    provider: 'openrouter',
    costTier: 'Free',
    costDescription: '$0.00 / Zero Cost',
    description: 'Highly competitive multilingual reasoning model with exceptional fluency across Hindi and Indian vernacular dialects.',
    contextWindow: '64K tokens'
  },
  {
    id: 'liquid/lfm-2.5-2.6b:free',
    name: 'Liquid: LFM 2.5 2.6B (Free)',
    provider: 'openrouter',
    costTier: 'Free',
    costDescription: '$0.00 / Zero Cost',
    description: 'Ultra-low latency non-transformer dynamical architecture with instant token synthesis.',
    contextWindow: '32K tokens'
  },
  {
    id: 'google/gemma-4-26b-a4b-it:free',
    name: 'Google: Gemma 4 26B MoE (Free)',
    provider: 'openrouter',
    costTier: 'Free',
    costDescription: '$0.00 / Zero Cost',
    description: 'Ultra-fast Mixture-of-Experts variant with low latency and 262K context window via OpenRouter.',
    contextWindow: '262K tokens'
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'openrouter',
    costTier: 'Premium',
    costDescription: '$0.003 / 1K in, $0.015 / 1K out',
    description: 'Industry gold-standard for autonomous agency, complex fiduciary rails, and precise tool calling.',
    contextWindow: '200K tokens'
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    provider: 'openrouter',
    costTier: 'Low Cost',
    costDescription: '$0.00012 / 1K tokens',
    description: 'High-performance open-weights intelligence with competitive Indian vernacular reasoning.',
    contextWindow: '128K tokens'
  },
  {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'openrouter',
    costTier: 'Low Cost',
    costDescription: '$0.00055 / 1K tokens',
    description: 'Frontier reasoning model with transparent chain-of-thought verification for safety guardrails.',
    contextWindow: '64K tokens'
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openrouter',
    costTier: 'Low Cost',
    costDescription: '$0.00015 / 1K tokens',
    description: 'Affordable, fast, multimodal small model for budget-conscious production deployments.',
    contextWindow: '128K tokens'
  }
];

export const DEFAULT_MODEL_ID = 'gemini-3.5-flash-lite';
