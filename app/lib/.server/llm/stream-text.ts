import { getSystemPrompt } from './prompts';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export async function streamText(
  messages: Messages,
  env: Env,
  options: Record<string, any> = {},
) {
  const apiKey = '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';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openrouter/quasar-alpha',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      max_tokens: 1024,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return {
    text: data.choices?.[0]?.message?.content ?? '',
  };
}
