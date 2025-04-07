import OpenRouterProvider from './openrouter-provider';
import type { ProviderInfo } from './types';

export const providers: Record<string, ProviderInfo> = {
  openrouter: new OpenRouterProvider(),
};
