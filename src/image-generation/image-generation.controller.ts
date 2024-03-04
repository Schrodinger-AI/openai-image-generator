// image-generation.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ImageGenerationService } from './image-generation.service';
import { ImageGenerationRequest, ImageGenerationResponseOk, ImageGenerationResponseNotOk, ImageQueryResponseOk, ImageQueryResponseNotOk } from './types/image-gen-types';

@Controller('/image')
export class ImageGenerationController {
  constructor(private readonly imageGenerationService: ImageGenerationService) {}

  @Post('/generate')
  generateImage(@Body() request: ImageGenerationRequest): Promise<ImageGenerationResponseOk|ImageGenerationResponseNotOk> {
    return this.imageGenerationService.generateImage(request);
  }

  @Get('/query')
  getImage(@Query('requestId') requestId: string): Promise<ImageQueryResponseOk|ImageQueryResponseNotOk> {
    return this.imageGenerationService.getImage(requestId);
  }
}