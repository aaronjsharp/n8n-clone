import prisma from '@/lib/db';
import { inngest } from './client';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import * as Sentry from "@sentry/nextjs"

const openai = createOpenAI();
const gemini = createGoogleGenerativeAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: 'execute-ai' },
  { event: 'execute/ai' },
  async ({ event, step }) => {
    await step.sleep('pretend-to-sleep', '5s');

    Sentry.logger.info("User triggered test log", {
      log_source: 'sentry_test'
    });
    console.warn("Something is missing");
    console.error("This is an error I want to track")
    
    const { steps: openaiSteps } = await step.ai.wrap(
      'openai-generate-text',
      generateText,
      {
        model: openai('gpt-5'),
        system: 'You are a helpful assistant.',
        prompt: 'What is 2 + 2',
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const { steps: geminiSteps } = await step.ai.wrap(
      'gemini-generate-text',
      generateText,
      {
        model: gemini('gemini-2.5-flash'),
        system: 'You are a helpful assistant.',
        prompt: 'What is 2 + 2',
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      'anthropic-generate-text',
      generateText,
      {
        model: anthropic('claude-sonnet-4-5'),
        system: 'You are a helpful assistant.',
        prompt: 'What is 2 + 2',
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    return {
      openaiSteps,
      geminiSteps,
      anthropicSteps,
    };
  }
);
