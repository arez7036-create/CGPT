import { ChatRequest, ChatResponse } from '@/types';
import { generateId } from "@/lib/utils";

/**
 * Send a request to the Router API
 */
export async function sendRouterRequest(
  apiUrl: string,
  apiKey: string,
  chatRequest: ChatRequest
): Promise<ChatResponse | ReadableStream<Uint8Array>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  try {
    // Always request streaming from the API
    const apiRequest = {
      messages: chatRequest.messages.map((msg) => ({
        role: msg.role === 'system' ? 'user' : msg.role,
        content: msg.content,
      })),
      model: chatRequest.model || 'router-default',
      temperature: chatRequest.temperature,
      stream: true,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(apiRequest),
    });

    if (!response.ok) {
      throw new Error(
        `Router API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    // For UI streaming requests, return the stream directly
    if (chatRequest.stream) {
      return new ReadableStream({
        async start(controller) {
          const reader = response.body.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }

            controller.enqueue(value);
          }

          controller.close();
        },
      });
    } else {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk
            .split('\n')
            .filter((line) => line.trim() !== '');
          
          for (const line of lines) {
            try {
              if (line.includes('event: ping') || 
                  line.includes('[DONE]') || 
                  line.startsWith('event:')) continue;
              
              if (!line.startsWith('data:')) continue;
              
              const trimmedLine = line.startsWith('data: ') ? line.slice(6) : line;
              if (trimmedLine.trim() === '') continue;
              
              const data = JSON.parse(trimmedLine);
              
              if (data.chunk !== undefined) {
                fullContent += data.chunk;
              }
              else if (data.choices && data.choices[0]?.delta?.content) {
                fullContent += data.choices[0].delta.content;
              }
            } catch (e) {
              console.warn('Skipping invalid JSON in stream:', line);
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
      
      return {
        id: generateId(),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: fullContent
            },
            finish_reason: 'stop'
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error in Router API request:', error);
    throw error;
  }
}
