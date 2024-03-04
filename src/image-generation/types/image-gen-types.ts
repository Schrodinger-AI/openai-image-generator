export interface Trait {
    name: string;
    value: string;
}

export interface ImageGenerationRequest {
    seed: string;
    newTrait: Trait;
    baseImage: ImageDescription;
}

export interface ImageGenerationResponseOk {
    requestId: string;
}

export interface ImageGenerationResponseNotOk {
    error: string;
}

export interface ImageQueryRequest {
    requestId: string;
}

export interface ImageQueryResponseOk {
    images: ImageDescription[];
}

export interface ImageQueryResponseNotOk {
    error: string;
}

export interface ImageDescription {
    image: string;
    traits: Trait[];
    extraData: string;
}