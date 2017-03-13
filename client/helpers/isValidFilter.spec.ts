import { expect } from "chai";
import isValidFilter from "./isValidFilter";

describe("isValidFormat", () => {
    it("shall return true (valid) if no string is passed", () => {
        expect(isValidFilter("")).to.eq(true);
    });

    it("shall return true (valid) if format is valid", () => {
        const validInputs = ["*", "a", "a*", "a3", "a333", "aab", "H3a2H4f5a*"];
        for (const input of validInputs) {
            expect(isValidFilter(input)).to.eq(true);
        }
    });

    it("shall return false (invalid) if format is invalid", () => {
        const invalidInputs = ["z", "a3z", "a3*"];
        for (const input of invalidInputs) {
            expect(isValidFilter(input)).to.eq(false);
        }
    });
});
