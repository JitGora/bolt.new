import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { streamText, type Messages } from '~/lib/.server/llm/stream-text';

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

async function chatAction({ context, request }: ActionFunctionArgs) {
  const { messages } = await request.json<{ messages: Messages }>();

  try {
    const result = await streamText(messages, context.cloudflare.env);

    return new Response(JSON.stringify({ text: result.text ?? '' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log(error);

    throw new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}
