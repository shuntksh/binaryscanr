import { expect } from "chai";
import formatStringToBits from "./formatStringToBits";

describe("formatStringToBits", () => {
    it("shall return corresponding bit len", () => {
        expect(formatStringToBits("a")).to.eq(8);
        expect(formatStringToBits("a2H3H2H*")).to.eq(16);
        expect(formatStringToBits("w16*")).to.eq(64 * 16);
    });

    it("shall return -1 for * and 0 for invalid characters", () => {
        expect(formatStringToBits("a*")).to.eq(-1);
        expect(formatStringToBits("e16")).to.eq(0);
    });
});
