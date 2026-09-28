import type { Page } from "@playwright/test";

export class SignInPage {
  constructor(private readonly page: Page) {}

  async open(url: string) {
    await this.page.goto(`${url}/sign-in`);
  }

  async signIn(email: string, password: string) {
    await this.page.getByLabel("Email").fill(email);
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
  }
}
