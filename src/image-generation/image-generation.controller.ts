// image-generation.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ImageGenerationService } from './image-generation.service';
import { ImageGenerationRequest, ImageGenerationResponseOk, ImageGenerationResponseNotOk, ImageQueryResponseOk, ImageQueryResponseNotOk, ImageQueryRequest } from './types/image-gen-types';

@Controller('/image')
export class ImageGenerationController {
  constructor(private readonly imageGenerationService: ImageGenerationService) {}

  @Post('/generate')
  generateImage(@Body() request: ImageGenerationRequest): Promise<ImageGenerationResponseOk|ImageGenerationResponseNotOk> {
    return this.imageGenerationService.generateImage(request);
  }

  @Post('/query')
  getImage(@Body() imageQueryRequest: ImageQueryRequest): Promise<ImageQueryResponseOk|ImageQueryResponseNotOk> {
    return this.imageGenerationService.getImage(imageQueryRequest);
  }
}