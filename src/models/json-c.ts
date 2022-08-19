import { JsonPrimitive, JsonObject } from "./json";
import { iJsonCompressed } from "./json-compressed";

export type iJsonCRetrieval = 
    | JsonPrimitive
    | iJsonC;

export interface iJsonC {

    /**
     * Check if this object has a particular key
     */
    hasKey(key: string | number): boolean;

    /**
     * Get the value associated with a key
     */
    get(key: string | number): iJsonCRetrieval | undefined;

    /**
     * Set the value associated with a key
     */
    set(key: string | number, value: JsonObject | JsonPrimitive): void;

    /**
     * Get the number of keys / indices
     */
    getKeyLength(): number;

    /**
     * Convert this object to a compressed json object
     */
    toCompressedJson(): iJsonCompressed;

}