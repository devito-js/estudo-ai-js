import { OpenRouter } from "@openrouter/sdk";
import { config, type ModelConfig } from "./config";

export type LLMResponse = {
  model: string;
  content: string;
}

export class openrouterService {
  private client: OpenRouter;
  private config: ModelConfig;

  constructor(configOverride: ModelConfig) {
    this.config = configOverride ?? config;

    this.client = new OpenRouter({
      apiKey: this.config.apiKey,
      httpReferer: this.config.httpReferer,
      // xTitle: this.config.xTitle,
    });
  }

  async generate(prompt: string) : Promise<LLMResponse> {
    type Provider = 'openai' | 'anthropic' | 'azure' | string;
    const payload = {
      chatRequest: {
        models: this.config.models,
        messages: [
          {
            role: "system",
            content: this.config.systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: false,
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens,
  provider: this.config.provider as any,
      },
      httpReferer: this.config.httpReferer,
      appTitle: this.config.xTitle,
    };

    try {
      const result = await this.client.chat.send(payload as any);

      // SDK returns a result object with choices on success
      const content = result.choices?.at(0)?.message?.content ?? "";
      return {
        model: result.model,
        content,
      }
    
    } catch (err) {
      console.error('Error calling OpenRouter.chat.send', err);
      throw err;
    }
  }
}
