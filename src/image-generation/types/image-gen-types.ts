import { ApiProperty } from '@nestjs/swagger';

export class Trait {
    @ApiProperty({ description: 'The name of the trait.' })
    name: string;

    @ApiProperty({ description: 'The value of the trait.' })
    value: string;
}

export class ImageDescription {
    @ApiProperty({ description: 'The image data.' })
    image: string;

    @ApiProperty({ description: 'The traits of the image.', type: [Trait] })
    traits: Trait[];

    @ApiProperty({ description: 'The extra data for the image.' })
    extraData: string;
}

export class ImageGenerationRequest {
    @ApiProperty({ description: 'The seed for image generation.' })
    seed: string;

    @ApiProperty({ description: 'The new traits for the image.', type: [Trait] })
    newTraits: Trait[];

    @ApiProperty({ description: 'The base image description.', type: ImageDescription })
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