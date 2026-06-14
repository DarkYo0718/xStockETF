import { expect, test } from "@playwright/test";

test("ETF list page renders and supports navigation", async ({ page }) => {
  await page.goto("/etfs");
  await expect(page.getByRole("heading", { name: "主動式 ETF 清單" })).toBeVisible();

  await page.getByRole("link", { name: "00981A" }).first().click();
  await expect(page).toHaveURL(/\/etfs\/00981A$/);
});
