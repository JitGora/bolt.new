import { providers } from '~/lib/modules/llm/providers';
import type { IProviderSetting } from '~/types/model';

interface GetProviderModelOptions {
  providerName?: string;
  modelName: string;
  apiKeys?: Record<string, string>;
  providerSettings?: Record<string, IProviderSetting>;
  serverEnv?: Record<string, string>;
}

export function getProviderModel(options: GetProviderModelOptions) {
  const {
    providerName = 'openrouter',
    modelName,
    apiKeys,
    providerSettings,
    serverEnv,
  } = options;

  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Provider "${providerName}" not found`);
  }

  return provider.getModelInstance({
    model: modelName,
    apiKeys,
    providerSettings,
    serverEnv,
  });
}
