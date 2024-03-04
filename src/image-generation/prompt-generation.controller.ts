// image-generation.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { generateFinalPromptFromSentences } from './openai/craft-image';
import { getTraitDefinitions, generateSentences, basePrompt } from './openai/prompt-gen-helper';
import { ImageGenerationRequest } from './types/image-gen-types';

@Controller('/prompt')
export class PromptGenerationController {

  @Post('/generate')
  async generatePrompt(@Body() request: ImageGenerationRequest): Promise<String> {

    // Get the trait definitions
    const traitDefinitions = getTraitDefinitions();

    // Extract the traits from the image description and the new trait
    const traits = [...request.baseImage.traits];
    if (request.newTrait) {
      traits.push(request.newTrait);
    }

    // Generate sentences from the traits
    const sentences = await generateSentences({ traits }, traitDefinitions);

    // Generate the final prompt
    const finalPrompt = await generateFinalPromptFromSentences(basePrompt, sentences);
    return finalPrompt;
  }
}