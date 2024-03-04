import { Injectable } from '@nestjs/common';
import { generateFinalPromptFromSentences, runDalle } from './openai/craft-image';
import { ImageGenerationRequest, ImageGenerationResponseOk, ImageQueryResponseOk, ImageGenerationResponseNotOk, Trait, ImageQueryResponseNotOk, ImageDescription } from './types/image-gen-types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import fs from 'fs';
import streamToArray from 'stream-to-array';
import { getTraitDefinitions, generateSentences, basePrompt } from './openai/prompt-gen-helper';
const fetch = require('node-fetch');

@Injectable()
export class ImageGenerationService {
  private imageMap = new Map<string, Promise<string>>();
  private imageGenerationRequestMap = new Map<string, Trait[]>();

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponseOk | ImageGenerationResponseNotOk> {
    // Get the trait definitions
    const traitDefinitions = getTraitDefinitions();

    // Extract the traits from the image description and the new trait
    const traits = [...request.baseImage.traits];
    if (request.newTraits) {
      traits.push(...request.newTraits);
    }

    console.log(`traits are: ${JSON.stringify(traits)}`);

    try {
      let sentences = await generateSentences({ traits }, traitDefinitions);

      console.log(`sentences derived from traits are: ${sentences}`);

      // Generate the final prompt
      let finalPrompt = await generateFinalPromptFromSentences(basePrompt, sentences);
      finalPrompt = `DMT Prompt: ${finalPrompt}`;

      const seed = request.seed;
      if(seed) {
        finalPrompt = `${finalPrompt} Seed: ${seed}`;
      }


      console.log(`finalPrompt is: ${finalPrompt}`);

      // Generate the image data
      const imageDataPromise = runDalle(finalPrompt);

      const requestId = uuidv4();

      // Store the image data promise in the map
      this.imageMap.set(requestId, imageDataPromise.then(imageData => imageData.data[0].url));
      this.imageGenerationRequestMap.set(requestId, traits);

      const response = new ImageGenerationResponseOk();
      response.requestId = requestId;
      return response;
    } catch (error) {
      console.error(error);
      const response = new ImageGenerationResponseNotOk();
      response.error = error.message;
      return response;
    }

  }

  async getImageData(url: string, requestId: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(`./${requestId}.png`, response.data);
    return Buffer.from(response.data, 'binary').toString('base64');
  }

  async getImage(requestId: string): Promise<ImageQueryResponseOk | ImageQueryResponseNotOk> {

    try {
      const imageUrlPromise = this.imageMap.get(requestId);
      if (!imageUrlPromise) {
        throw new Error(`No image found for request ID: ${requestId}`);
      }

      const requestTraits = this.imageGenerationRequestMap.get(requestId);
      if (!requestTraits) {
        throw new Error(`No traits found for request ID: ${requestId}`);
      }

      const imageUrl = await imageUrlPromise;

      console.log(`Image URL for request ID: ${requestId} is: ${imageUrl}`);

      // Fetch the image from the URL
      const response = await fetch(imageUrl);

      // Convert the data stream to a Buffer
      const array = await streamToArray(response.body);
      const buffer = Buffer.concat(array);

      // Convert the Buffer to a base64 string
      const base64Image = buffer.toString('base64');

      // Create a data URL
      const dataUrl = `data:image/png;base64,${base64Image}`;

      //prepare ImageQueryResponseOk
      const responseOk = new ImageQueryResponseOk();
      const imageDescriptionResponse = new ImageDescription();
      imageDescriptionResponse.traits = requestTraits;
      imageDescriptionResponse.image = base64Image;
      responseOk.images = [imageDescriptionResponse];
      responseOk.images[0].extraData = imageUrl;

      return responseOk;
    } catch (error) {
      // return ImageQueryResponseNotOk
      const response = new ImageQueryResponseNotOk();
      response.error = error.message;
      return response;
    }
  }

}