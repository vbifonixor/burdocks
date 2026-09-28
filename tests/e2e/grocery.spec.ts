import { expect } from "@playwright/test";
import { test } from "./fixture";
import { AdminPage } from "./pages/admin-page";
import { GroceryPage } from "./pages/grocery-page";
import { SignInPage } from "./pages/sign-in-page";

test("users manage only their own grocery items", async ({ app, page }) => {
  const signInPage = new SignInPage(page);
  const groceryPage = new GroceryPage(page);
  const adminPage = new AdminPage(page);

  await signInPage.open(app.url);
  const signUpStatus = await page.evaluate(async () => {
    const response = await fetch("/api/auth/sign-up/email", {
      body: JSON.stringify({
        email: "public-signup@example.com",
        name: "Public signup",
        password: "public-signup-password",
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    return response.status;
  });
  expect(signUpStatus).toBe(400);

  await signInPage.signIn(app.adminEmail, app.adminPassword);
  await expect(
    page.getByRole("heading", { name: "Grocery list" }),
  ).toBeVisible();

  await groceryPage.add("Milk");
  await groceryPage.add("Bread");
  await groceryPage.edit("Bread", "Baguette");
  await expect(groceryPage.item("Baguette")).toHaveCount(1);
  await groceryPage.complete("Milk");
  const milkId = await groceryPage.itemId("Milk");
  await expect(groceryPage.item("Milk").locator("del")).toHaveText("Milk");
  await groceryPage.delete("Baguette");
  await expect(groceryPage.item("Baguette")).toHaveCount(0);

  await adminPage.open();
  const playerEmail = `player-${Date.now()}@example.com`;
  await adminPage.createUser(
    "Player",
    playerEmail,
    "playwright-player-password",
  );
  await page.goto(app.url);
  await groceryPage.signOut();

  await signInPage.signIn(playerEmail, "playwright-player-password");
  await expect(
    page.getByRole("heading", { name: "Grocery list" }),
  ).toBeVisible();
  await expect(groceryPage.item("Milk")).toHaveCount(0);
  const deletionStatus = await page.evaluate(async (itemId) => {
    const response = await fetch(`/api/grocery/${itemId}`, {
      credentials: "include",
      method: "DELETE",
    });
    return response.status;
  }, milkId);
  expect(deletionStatus).toBe(404);
  await groceryPage.signOut();
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
