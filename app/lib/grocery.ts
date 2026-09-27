export function normalizeGroceryItemText(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";

  if (!text || text.length > 200) {
    throw new Error("Item text must be between 1 and 200 characters.");
  }

  return text;
}
