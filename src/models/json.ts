/**
 * Type definitions for JSON objects
 */

export type JsonPrimitive = string | number | boolean | null;

export type JsonObject = {
    [key: string | number]: JsonPrimitive | JsonObject;
} | (JsonPrimitive | JsonObject)[];