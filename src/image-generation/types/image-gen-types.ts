import { ApiProperty } from '@nestjs/swagger';

export class Trait {
    @ApiProperty({ description: 'The name of the trait.', example: 'hat' })
    name: string;

    @ApiProperty({ description: 'The value of the trait.', example: 'alpine hat' })
    value: string;
}

export class ImageDescription {
    @ApiProperty({ description: 'The image data.', example: 'base64ImageData' })
    image: string;

    @ApiProperty({ description: 'The traits of the image.', type: [Trait], example: [{ name: 'hat', value: 'alpine hat' }, { name: 'eye', value: 'is wearing 3d glasses' }] })
    traits: Trait[];

    @ApiProperty({ description: 'The extra data for the image.', example: 'extraData' })
    extraData: string;
}

export class ImageGenerationRequest {
    @ApiProperty({ description: 'The seed for image generation.', example: '123343434' })
    seed: string;

    @ApiProperty({ description: 'The new traits for the image.', type: [Trait], example: [{ name: 'mouth', value: 'bewitching' }] })
    newTraits: Trait[];

    @ApiProperty({ description: 'The base image description.', type: ImageDescription, example: { traits: [{ name: 'hat', value: 'alpine hat' }, { name: 'eye', value: 'is wearing 3d glasses' }] } })
    baseImage: ImageDescription;
}

export class ImageGenerationResponseOk {
    @ApiProperty({ description: 'The request ID.' })
    requestId: string;
}

export class ImageGenerationResponseNotOk {
    @ApiProperty({ description: 'The error message.' })
    error: string;
}

export class ImageQueryRequest {
    @ApiProperty({ description: 'The request ID.' })
    requestId: string;
}

export class ImageQueryResponseOk {
    @ApiProperty({ description: 'The list of image descriptions.', type: [ImageDescription] })
    images: ImageDescription[];
}

export class ImageQueryResponseNotOk {
    @ApiProperty({ description: 'The error message.' })
    error: string;
}

export class TraitValue {
    @ApiProperty({ description: 'The name of the trait.' })
    name: string;

    @ApiProperty({ description: 'The possible values for the trait.' })
    values: string[];

    @ApiProperty({ description: 'The variation of the trait.' })
    variation: string;
}

export class TraitDefinition {
    [key: string]: TraitValue;
}