import { IsString, IsArray, IsObject, ValidateNested, IsNotEmpty, IsBase64, validate, IsOptional } from 'class-validator';

export class Trait {
    name: string;
    value: string;
}

export class ImageGenerationRequest {
    seed: string;
    newTraits: Trait[];
    baseImage: ImageDescription;
}

export class ImageGenerationResponseOk {
    requestId: string;
}

export class ImageGenerationResponseNotOk {
    error: string;
}

export class ImageQueryRequest {
    requestId: string;
}

export class ImageQueryResponseOk {
    images: ImageDescription[];
}

export class ImageQueryResponseNotOk {
    error: string;
}

export class ImageDescription {
    image: string;
    traits: Trait[];
    extraData: string;
}

export class TraitValue {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsString({ each: true })
    values: string[];

    @IsString()
    @IsNotEmpty()
    variation: string;
}

export class TraitDefinition {
    [key: string]: TraitValue;
}
