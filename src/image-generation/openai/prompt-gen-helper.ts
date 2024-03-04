import { validate } from "class-validator";
import fs from 'fs';
import { Trait, TraitValue } from "../types/image-gen-types";

export const generateSentences = async (request: { traits: Trait[] }, traitDefinitions: Map<string, TraitValue>): Promise<string[]> => {
    let sentences: string[] = [];
    for (let trait of request.traits) {
        const traitName = trait.name;
        let traitDef = traitDefinitions.get(traitName);
        if (traitDef) {
            // Create a new TraitValue object with the trait's value
            let traitValue = new TraitValue();
            traitValue.name = trait.name;
            traitValue.values = [trait.value];
            traitValue.variation = traitDef.variation;

            // Validate the TraitValue object
            let errors = await validate(traitValue);
            if (errors.length > 0) {
                throw new Error(`Validation failed during Generate Sentences for trait: ${JSON.stringify(traitValue)}`);
            }

            if (traitDef.values.includes(trait.value)) {
                sentences.push(traitDef.variation.replace('%s', trait.value));
            } else {
                throw new Error(`Trait value \`${trait.value}\` is not found under TraitName: \`${traitName}\` in trait definitions -> valid TraitValues are: ${traitDef.values}`);
            }
        } else {
            throw new Error(`Trait ${traitName} not found in trait definitions`);
        }
    }

    console.log(`sentences derived from traits are: ${sentences}`);

    if(!sentences || sentences.length === 0) {
        throw new Error('Dalle3 - No sentences were generated from traits');
    }


    return sentences;
}

export const basePrompt = "Rephrase the following to create a logical sentence: ";

export function getTraitDefinitions(): Map<string, TraitValue> {
    // Read the JSON file and parse it into an array of TraitValue
    let traitArray: TraitValue[] = JSON.parse(fs.readFileSync('traits.json', 'utf-8'));

    // Convert the array into a Map
    let traitDefinitions = new Map<string, TraitValue>();
    for (let traitValue of traitArray) {
        traitDefinitions.set(traitValue.name, traitValue);
    }

    return traitDefinitions;
}