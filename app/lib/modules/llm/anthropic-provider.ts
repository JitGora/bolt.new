import { createAnthropic } from '@ai-sdk/anthropic';
import { BaseProvider } from './base-provider';
import type { ModelInfo } from './types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';

export default class AnthropicProvider extends BaseProvider {
  name = 'Anthropic';
  getApiKeyLink = undefined;

  config = {
    apiTokenKey: 'ANTHROPIC_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'claude-3-5-sonnet-20240620',
      label: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      maxTokenAllowed: 200000, // adjust as needed
    },
  ];

  async getDynamicModels(): Promise<ModelInfo[]> {
    // Anthropic API may not support dynamic model listing
    return this.staticModels;
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const apiKey =
      apiKeys?.[this.name] ||
      serverEnv?.ANTHROPIC_API_KEY ||
      process?.env?.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('Missing Anthropic API key');
    }

    const anthropic = createAnthropic({
      apiKey,
    });

    return anthropic(model);
  }
}
