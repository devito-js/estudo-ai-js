import { ChatOpenAI } from "@langchain/openai";
import { config, type ModelConfig } from "../config.ts";
import { z } from "zod/v3";
import { createAgent, HumanMessage, providerStrategy, SystemMessage } from "langchain";

export class OpenRouterService {
  private config: ModelConfig;
  private llmclient: ChatOpenAI;

  constructor(configOverride?: ModelConfig) {
    this.config = configOverride || config;
    this.llmclient = new ChatOpenAI({
      apiKey: this.config.apiKey,
      modelName: this.config.models.at(0),
      temperature: this.config.temperature,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "X-Title": this.config.xTitle,
          "HTTP-Referer": this.config.httpReferer,
        },
      },
      modelKwargs: {
        models: this.config.models,
        provider: this.config.provider,
      },
    });
  }
  async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
        schema: z.ZodSchema<T>
  ){
    const agent = createAgent({
        model: this.llmclient,
        tools: [],
        responseFormat: providerStrategy(schema)
    })
    
    const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt),
    ]

    const data = await agent.invoke({messages});
    1;
  }
}
