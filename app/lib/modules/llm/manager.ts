export class LLMManager {
  static instance: LLMManager | null = null;

  env: Record<string, string> = {};

  private constructor() {}

  static getInstance(): LLMManager {
    if (!LLMManager.instance) {
      LLMManager.instance = new LLMManager();
    }
    return LLMManager.instance;
  }
}
