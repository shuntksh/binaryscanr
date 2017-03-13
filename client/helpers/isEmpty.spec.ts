import { expect } from "chai";
import isEmpty from "./isEmpty";

describe("isValidFormat", () => {
    it("shall validate empty string", () => {
        expect(isEmpty("")).to.eq(true);
        expect(isEmpty("false")).to.eq(false);
    });

    it("shall validate empty array", () => {
        expect(isEmpty([])).to.eq(true);
        expect(isEmpty(["NOT EMPTY"])).to.eq(false);
    });

    it("shall validate empty object", () => {
        expect(isEmpty({})).to.eq(true);
        expect(isEmpty({ not: "empty" })).to.eq(false);
    });

    it("shall validate invalid value types", () => {
        expect(isEmpty(1)).to.eq(true);
        expect(isEmpty(undefined)).to.eq(true);
    });
});
