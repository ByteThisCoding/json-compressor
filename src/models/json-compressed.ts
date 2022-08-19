import { JsonObject } from "./json";

export interface iJsonCompressedKeyMap {
    c: {[key: string]: string};
    l: string;
}

/**
 * The type definition for a RAW key compressed JSON
 */
export interface iJsonCompressed {

    /**
     * A map of compressed keys to their original keys
     */
    k: iJsonCompressedKeyMap;

    /**
     * The actual payload of the object
     */
    p: JsonObject

}