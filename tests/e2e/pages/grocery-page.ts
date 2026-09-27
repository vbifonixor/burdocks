import type { Page } from "@playwright/test";

export class GroceryPage {
  constructor(private readonly page: Page) {}

  async add(text: string) {
    await this.page.getByLabel("Add item").fill(text);
    await this.page.getByRole("button", { exact: true, name: "Add" }).click();
  }

  item(text: string) {
    return this.page.getByRole("listitem").filter({ hasText: text });
  }

  async itemId(text: string) {
    return this.item(text).locator('input[name="itemId"]').first().inputValue();
  }

  async complete(text: string) {
    await this.item(text)
      .getByRole("button", { name: "Cross out item" })
      .click();
  }

  async delete(text: string) {
    await this.item(text).getByRole("button", { name: "Delete item" }).click();
  }

  async edit(text: string, replacement: string) {
    await this.item(text)
      .getByRole("button", { exact: true, name: "e" })
      .click();
    const editInput = this.page.locator('li input[name="text"]');
    await editInput.fill(replacement);
    await editInput.locator("..").getByRole("button", { name: "Save" }).click();
  }

  async signOut() {
    await this.page.getByRole("button", { name: "Sign out" }).click();
  }
}
