import { expect, test, type Page } from "@playwright/test";

/**
 * End-to-end flows against the production build.
 * Selects options until the current question's required picks are made
 * (single/true-false need 1, "Select TWO" questions need 2).
 */
async function answerCurrentQuestion(page: Page) {
  const options = page.getByRole("radio").or(page.getByRole("checkbox"));
  await options.first().click();
  const check = page.getByTestId("check-answer");
  if ((await check.count()) > 0 && (await check.isDisabled())) {
    await options.nth(1).click();
  }
}

test.describe("home", () => {
  test("shows the hero, official format and all five chapters", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Pass the Life in the UK Test" })
    ).toBeVisible();
    await expect(page.getByTestId("cta-mock")).toBeVisible();
    for (const chapter of ["values", "uk", "history", "society", "government"]) {
      await expect(page.getByTestId(`chapter-${chapter}`)).toBeVisible();
    }
  });
});

test.describe("practice flow", () => {
  test("answers a question, sees feedback, ends session with results", async ({
    page,
  }) => {
    await page.goto("/practice");
    await page.getByTestId("chapter-history").click();
    await expect(
      page.getByRole("heading", { name: "A Long and Illustrious History" })
    ).toBeVisible();

    await page.getByTestId("start-practice").click();
    await expect(page.getByTestId("question-text")).toBeVisible();

    // Check answer is gated until a full selection is made.
    await expect(page.getByTestId("check-answer")).toBeDisabled();
    await answerCurrentQuestion(page);
    await page.getByTestId("check-answer").click();

    // Instant feedback with an explanation appears.
    await expect(page.getByTestId("feedback")).toBeVisible();
    await expect(page.getByTestId("feedback")).toContainText(/Correct|Incorrect/);

    await page.getByTestId("next-question").click();
    await expect(page.getByTestId("question-text")).toBeVisible();

    // Quit after one answered question → the session is saved and scored
    // (the answer may have been right or wrong — the total must be 1).
    await page.getByTestId("quit-button").click();
    await page.getByTestId("confirm-quit").click();
    await expect(page.getByTestId("results")).toBeVisible();
    await expect(page.getByTestId("results")).toContainText(/[01] of 1/);
  });
});

test.describe("mock test flow", () => {
  test("runs under the 45-minute clock and submits early for a marked result", async ({
    page,
  }) => {
    await page.goto("/mock-test");
    await expect(
      page.getByRole("heading", { name: "Ready for exam conditions?" })
    ).toBeVisible();

    await page.getByTestId("start-mock").click();
    await expect(page.getByText("Question 1 of 24")).toBeVisible();
    await expect(page.getByTestId("timer")).toContainText(/4[45]:/);

    // Answer the first question, then jump to review and submit early.
    await answerCurrentQuestion(page);
    await page.getByTestId("mock-next").click();
    await expect(page.getByText("Question 2 of 24")).toBeVisible();

    await page.getByTestId("open-summary").click();
    await expect(
      page.getByRole("heading", { name: "Review your answers" })
    ).toBeVisible();
    await expect(page.getByText("1 of 24 answered")).toBeVisible();

    await page.getByTestId("submit-test").click();
    // Unanswered questions trigger a confirmation.
    await page.getByTestId("confirm-submit").click();

    await expect(page.getByTestId("results")).toBeVisible();
    await expect(page.getByTestId("results")).toContainText(/Pass|Fail/);
    await expect(page.getByText("of 24", { exact: false }).first()).toBeVisible();
  });
});

test.describe("progress", () => {
  test("shows the empty state before any sessions", async ({ page }) => {
    await page.goto("/progress");
    await expect(
      page.getByRole("heading", { name: "No progress yet" })
    ).toBeVisible();
  });
});
