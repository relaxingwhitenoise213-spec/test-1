import { test, expect } from "@playwright/test";

test.describe("Vocalis Studio", () => {
  test("renders the studio and updates live counters", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /turn text into lifelike speech/i })
    ).toBeVisible();

    const editor = page.getByLabel("Text to convert to speech");
    await editor.fill("Hello world. This is a Playwright test.");

    // Character counter reflects the input.
    await expect(page.getByText(/39 \//)).toBeVisible();
    // Generate button is enabled once there is text.
    await expect(page.getByRole("button", { name: /generate speech/i })).toBeEnabled();
  });

  test("navigates to dashboard and history", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Dashboard" }).first().click();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await page.getByRole("link", { name: "History" }).first().click();
    await expect(
      page.getByRole("heading", { name: "History", exact: true })
    ).toBeVisible();
  });

  test("toggles theme without errors", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /switch to (dark|light) mode/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark|light/);
  });
});
