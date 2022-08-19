import { JsonC } from "./json-c";

describe("JsonC", () => {

    it("should return undefined for a value not set", () => {
        const jsonC = JsonC.new();
        expect(jsonC.get("badValue")).toBeUndefined();
    });

    it("should set then get a value", () => {
        const jsonC = JsonC.new();
        jsonC.set("test", true);
        expect(jsonC.get("test")).toBe(true);
    });

    it("should set then get multiple values", () => {
        const tests = [
            ["a", true],
            ["b", false],
            ["c", 12],
            ["d", 13]
        ] as ([string, any])[];

        const jsonC = JsonC.new();
        tests.forEach(tc => jsonC.set(tc[0], tc[1]));
        tests.forEach(tc => expect(jsonC.get(tc[0])).toBe(tc[1]));

        expect(jsonC.getKeyLength()).toBe(tests.length);
    });

    it("should set then get a large number of generated values", () => {
        const tests = [] as ([string, any])[];
        for (let i=0; i<1_000; i++) {
            tests.push([""+i, Math.floor(Math.random()*500_000)]);
        }


        const jsonC = JsonC.new();
        tests.forEach(tc => jsonC.set(tc[0], tc[1]));
        tests.forEach(tc => expect(jsonC.get(tc[0])).toBe(tc[1]));

        expect(jsonC.getKeyLength()).toBe(tests.length);
    });

    it("should set, then update a value", () => {
        const jsonC = JsonC.new();
        jsonC.set("test", true);
        expect(jsonC.get("test")).toBe(true);

        jsonC.set("test", false);
        expect(jsonC.get("test")).toBe(false);
    });

    it("should create from a compressed json", () => {
        const compressed = {"k":{"c":{"a":" ","b":"!","c":"\"","d":"#"},"l":"#"},"p":{" ":true,"!":false,"\"":12,"#":13}};
        const jsonC = JsonC.fromCompressed(compressed);

        expect(jsonC.getKeyLength()).toBe(4);
        expect(jsonC.get("a")).toBe(true);
        expect(jsonC.get("b")).toBe(false);
        expect(jsonC.get("c")).toBe(12);
        expect(jsonC.get("d")).toBe(13);
    });

    it("should set with an empty nested object", () => {
        const jsonC = JsonC.new();
        jsonC.set("a", true);
        jsonC.set("b", {});

        expect(typeof jsonC.get("b")).toBe("object");
        expect((jsonC.get("b") as JsonC).getKeyLength()).toBe(0);
    });

    it("should set with a non empty nested object", () => {
        const jsonC = JsonC.new();
        jsonC.set("a", true);
        jsonC.set("b", {
            "a": true,
            "b": false
        });

        const jsonNested = jsonC.get("b") as JsonC;

        expect(typeof jsonNested).toBe("object");
        expect(jsonNested.getKeyLength()).toBe(2);
        expect(jsonNested.get("a")).toBe(true);
        expect(jsonNested.get("b")).toBe(false);
    });

    it("should set with an empty array", () => {
        const jsonC = JsonC.new();
        jsonC.set("a", true);
        jsonC.set("b", []);

        expect(typeof jsonC.get("b")).toBe("object");
        expect((jsonC.get("b") as JsonC).getKeyLength()).toBe(0);
    });

    it("should set with a non empty array", () => {
        const jsonC = JsonC.new();
        jsonC.set("a", true);
        jsonC.set("b", [true, false]);

        const jsonNested = jsonC.get("b") as JsonC;

        expect(typeof jsonNested).toBe("object");
        expect(jsonNested.getKeyLength()).toBe(2);
        expect(jsonNested.get(0)).toBe(true);
        expect(jsonNested.get(1)).toBe(false);
    });

});