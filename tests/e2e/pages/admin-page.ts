import type { Page } from "@playwright/test";

export class AdminPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.getByRole("link", { name: "Admin" }).click();
  }

  async createUser(name: string, email: string, password: string) {
    await this.page.getByLabel("Name").fill(name);
    await this.page.getByLabel("Email").fill(email);
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: "Create account" }).click();
  }
}
