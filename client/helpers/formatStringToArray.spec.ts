import { expect } from "chai";
import formatStringToArray from "./formatStringToArray";

describe("isValidFormat", () => {
    it("shall split input", () => {
        expect(formatStringToArray("aaaa")).to.eql(["a", "a", "a", "a"]);
        expect(formatStringToArray("a1H3H2H*")).to.eql(["a1", "H3", "H2", "H*"]);
    });

    it("shall return an empty array if invalid input is passed", () => {
        expect(formatStringToArray("a2e")).to.eql([]);
        expect(formatStringToArray("")).to.eql([]);
    });

    it("shall skip X if skipX flag is on", () => {
        expect(formatStringToArray("x1a2xw")).to.eql(["a2", "w"]);
    });

});
