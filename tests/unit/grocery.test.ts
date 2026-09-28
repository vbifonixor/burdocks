import { describe, expect, it } from "vitest";
import { normalizeGroceryItemText } from "../../app/lib/grocery";

describe("normalizeGroceryItemText", () => {
  it("trims valid item text", () => {
    expect(normalizeGroceryItemText("  apples  ")).toBe("apples");
  });

  it("rejects empty and overlong values", () => {
    expect(() => normalizeGroceryItemText("  ")).toThrow();
    expect(() => normalizeGroceryItemText("a".repeat(201))).toThrow();
  });
});
