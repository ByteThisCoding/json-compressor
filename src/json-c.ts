import { JsonPrimitive, JsonObject } from "./models/json";
import { iJsonC, iJsonCRetrieval } from "./models/json-c";
import { iJsonCompressed, iJsonCompressedKeyMap } from "./models/json-compressed";

export class JsonC implements iJsonC {

    /**
     * Create a JsonC object from a compressed raw JSON object
     * @param compressed 
     * @returns 
     */
    public static fromCompressed(compressed: iJsonCompressed): JsonC {
        return new JsonC(compressed.k, compressed.p, false);
    }

    /**
     * Create a JsonC object from an uncomressed raw JSON object
     * @param json 
     */
    /*public static fromJson(json: JsonObject): JsonC {

    }*/

    /**
     * Create a new empty JsonC object
     */
    public static new(): JsonC {
        return new JsonC({
            c: {},
            l: ""
        }, {}, false);
    }

    private payload: {[key: string | number]: JsonPrimitive | JsonC} = {};

    /**
     * Private constructor to allow us to control managing this object
     */
    private constructor(
        private keyMap: iJsonCompressedKeyMap,
        p: JsonObject,
        doParse: boolean
    ) {
        if (doParse) {
            this.parseJsonObject(p);
        } else {
            this.acceptParsedJsonObject(p);
        }
    }

    hasKey(key: string | number): boolean {
        return typeof this.keyMap.c[key] !== 'undefined';
    }

    /**
     * Get a value from this object
     */
    get(key: string | number): iJsonCRetrieval | undefined {
        if (!this.hasKey(key)) {
            return void 0;
        }

        // get compressed key
        const cKey = this.getCKey(key);

        // grab value
        return this.payload[cKey];
    }

    /**
     * Set the value associated with a key
     */
    set(key: string | number, value: JsonObject | JsonPrimitive): void {
        // determine the appropriate key to use
        const cKey = this.getCKey(key);
        this.keyMap.c[key] = cKey;

        // set the object
        if (this.isJsonPrimitiveType(value)) {
            this.payload[cKey] = value;
        } else {
            this.payload[cKey] = new JsonC(this.keyMap, value, true);
        }
    }

    /**
     * Get the number of keys / indices
     */
    getKeyLength(): number {
        if (Array.isArray(this.payload)) {
            return this.payload.length;
        }
        return Object.keys(this.payload).length;
    }

    /**
     * Convert this object to a compressed json object
     */
    toCompressedJson(): iJsonCompressed {
        const p = Array.isArray(this.payload)
            // TODO: check if unknown is correct
            ? [...this.payload] as unknown as JsonObject
            : {...this.payload} as JsonObject;
        
        Object.keys(p).forEach((key: any) => {
            if (!this.isJsonPrimitiveType(p[key])) {
                // TODO: check if unknown is correct
                p[key] = (p[key] as unknown as JsonC).toCompressedJson().p;
            }
        });

        return {
            k: this.keyMap,
            p
        }
    }

    /**
     * Check if the value is a Json Primitive
     * If so, return a type indicating that this is the case
     */
    private isJsonPrimitiveType(value: any): value is JsonPrimitive {
        return value === null || typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number';
    }

    /**
     * Given a normal key, get the compressed key
     */
    private getCKey(key: string | number): string {
        let cKey = this.keyMap.c[key];
        if (!cKey) {
            cKey = this.getNextKey();
            this.keyMap.l = cKey;
        }
        return cKey;
    }

    private getNextKey(): string {
        // establish which chars can be used as keys
        const lowestChar = " ".charCodeAt(0);
        const highestChar = "~".charCodeAt(0);

        // base case, this is the first key
        if (this.keyMap.l === "") {
            return String.fromCharCode(lowestChar);
        }


        // loop through chars
        // if we find one which can be increment, do so and return
        for (let i=0; i<this.keyMap.l.length; i++) {
            const char = this.keyMap.l.charCodeAt(i);
            if (char !== highestChar) {
                const newKey = this.keyMap.l.substring(0, i)
                    + String.fromCharCode(char + 1) + this.keyMap.l.substring(i + 1);
                return newKey;
            }
        }

        return String.fromCharCode(lowestChar).repeat(this.keyMap.l.length) + String.fromCharCode(lowestChar);
    }

    /**
     * Convert a JSON object to its compressed key state
     * @param obj 
     * @returns 
     */
    private parseJsonObject(obj: JsonObject): void {
        Object.keys(obj).forEach((key: any) => {
            const value = obj[key];
            if (this.isJsonPrimitiveType(value)) {
                this.set(key, value);
            } else {
                const subJsonC = new JsonC(this.keyMap, value, true);
                const cKey = this.getCKey(key);
                this.payload[cKey] = subJsonC;
            }
        });
    }

    /**
     * Assuming the input was parsed before, add its data to ours with no additional processing
     */
    private acceptParsedJsonObject(obj: JsonObject): void {
        Object.keys(obj).forEach((cKey: any) => {
            const value = obj[cKey];
            if (this.isJsonPrimitiveType(value)) {
                this.payload[cKey] = value;
            } else {
                const subJsonC = new JsonC(this.keyMap, value, false);
                this.payload[cKey] = subJsonC;
            }
        });
    }
}