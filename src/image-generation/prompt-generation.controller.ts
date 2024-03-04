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

    console.log(`request is: ${JSON.stringify(request)}`);

    // Extract the traits from the image description and the new trait
    const traits = [...request.baseImage.traits];
    console.log(`traits before adding new trait are: ${JSON.stringify(traits)}`);
    if (request.newTraits) {
      traits.push(...request.newTraits);
    }
    console.log(`traits are: ${JSON.stringify(traits)}`);

    // Generate sentences from the traits
    const sentences = await generateSentences({ traits }, traitDefinitions);

    // Generate the final prompt
    let finalPrompt = await generateFinalPromptFromSentences(basePrompt, sentences);
    finalPrompt = 'A simple pixel art image of a cat with captivating eyes and a chirpy mouth.';
    return finalPrompt;
  }
}