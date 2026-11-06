import { test, expect } from "@playwright/test";

test.describe("PUBLIC CONVERSION FUNNELS & ANTI-BOT DEFENSE", () => {
  test("Test 1.1: Hero Quick Form generates Case Ref and WhatsApp deep-link", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const heroForm = page.locator("#eligibility-form");
    await heroForm.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // ensure React hydration

    // Select Issue and Debt Tier first
    await heroForm.locator('button:has-text("Credit Card")').evaluate((el: HTMLElement) => el.click());
    await heroForm.locator('button:has-text("₹3L–₹7L")').evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(200);

    const nameInput = heroForm.locator('input[placeholder="Your full name"]');
    const phoneInput = heroForm.locator('input[placeholder="9876543210"]');
    const cityInput = heroForm.locator('input[placeholder="e.g. Mumbai, Delhi"]');

    await nameInput.fill("Aakash Mehta");
    await phoneInput.fill("9876543210");
    await cityInput.fill("Mumbai");
    await expect(nameInput).toHaveValue("Aakash Mehta");
    await expect(phoneInput).toHaveValue("9876543210");
    await expect(cityInput).toHaveValue("Mumbai");

    // Submit form and intercept API call
    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes("/api/leads") && res.request().method() === "POST"),
      heroForm.locator('button[type="submit"]').evaluate((el: HTMLElement) => el.click()),
    ]);

    expect(response.status()).toBe(200);

    // Verify Case Ref ID & WhatsApp Link
    const refBadge = page.locator("text=/Ref #DSE-[A-Z0-9]+/");
    await expect(refBadge).toBeVisible({ timeout: 10000 });

    const whatsappButton = page.locator('a:has-text("Open Case on WhatsApp")');
    await expect(whatsappButton).toBeVisible();
    const href = await whatsappButton.getAttribute("href");
    expect(href).toContain("https://wa.me/");
  });

  test("Test 1.2: Honeypot Anti-Bot Defense silently drops spam bots", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const heroForm = page.locator("#eligibility-form");
    await heroForm.scrollIntoViewIfNeeded();
    await expect(heroForm.locator('input[placeholder="Your full name"]')).toBeVisible();
    await page.waitForTimeout(500); // ensure React hydration

    // Fill Honeypot field
    const honeypot = heroForm.locator('input[name="website"]');
    await honeypot.fill("https://malicious-spam-bot.xyz");
    await expect(honeypot).toHaveValue("https://malicious-spam-bot.xyz");

    await heroForm.locator('input[placeholder="Your full name"]').fill("Spam Bot User");
    await heroForm.locator('input[placeholder="9876543210"]').fill("9876543210");
    await heroForm.locator('input[placeholder="e.g. Mumbai, Delhi"]').fill("Kolkata");

    // Click submit
    await heroForm.locator('button[type="submit"]').click({ force: true });

    // Honeypot blocks client-side submission; success screen should NOT show
    await page.waitForTimeout(1000);
    const refBadge = heroForm.locator("text=/Ref #DSE-[A-Z0-9]+/");
    await expect(refBadge).not.toBeVisible();

    // Direct API Honeypot rejection
    const apiResponse = await page.request.post("/api/leads", {
      data: {
        fullName: "API Bot",
        phone: "9876543210",
        city: "Delhi",
        website: "http://bot-attack.net",
      },
    });
    // Silent drop / fake reference ID returned with 200 without DB pollution
    expect([200, 400]).toContain(apiResponse.status());
  });

  test("Test 1.3: 60-Second Eligibility Wizard at /check-eligibility (Skip Preview & Lead Submit)", async ({ page }) => {
    const clickBtn = async (locator: any) => {
      await locator.evaluate((el: HTMLElement) => el.click());
    };

    // Part A: Skip & Preview Roadmap without phone
    await page.goto("/check-eligibility");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    // Q1: Debt Type
    await clickBtn(page.locator('button:has-text("Personal Loan")').first());
    await clickBtn(page.locator('button:has-text("Continue")'));
    await expect(page.locator("text=Question 2 of 6")).toBeVisible();

    // Q2: Total Debt
    await clickBtn(page.locator('button:has-text("₹3L – ₹7 Lakh")'));
    await clickBtn(page.locator('button:has-text("Continue")'));

    // Q3: Lenders
    await clickBtn(page.locator('button:has-text("HDFC")'));
    await clickBtn(page.locator('button:has-text("Continue")'));

    // Q4: Overdue Status
    await clickBtn(page.locator('button:has-text("3 – 6 Months (NPA)")'));
    await clickBtn(page.locator('button:has-text("Continue")'));

    // Q5: Biggest Worry
    await clickBtn(page.locator('button:has-text("Abusive Recovery Calls & Home Visits")'));
    await clickBtn(page.locator('button:has-text("Continue")'));

    // Q6: Readiness
    await clickBtn(page.locator('button:has-text("Need 2 to 3 monthly installments to pay")'));
    await clickBtn(page.locator('button:has-text("View My Legal Strategy")'));

    // Step 7: Test Skip & Preview Guidance
    const skipBtn = page.locator('button:has-text("Skip registration & preview full legal guidance immediately")');
    await expect(skipBtn).toBeVisible();
    await clickBtn(skipBtn);

    // Verify roadmap preview is unlocked without requiring phone number
    await expect(page.locator("text=Connect with Advocate on WhatsApp")).toBeVisible();
    await expect(page.locator("text=Retake Assessment with Different Portfolio")).toBeVisible();

    // Part B: Submit Lead with phone to generate Case File ID
    await page.goto("/check-eligibility");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);
    for (let i = 0; i < 5; i++) {
      await clickBtn(page.locator('button:has-text("Continue")'));
      await page.waitForTimeout(200);
    }
    await clickBtn(page.locator('button:has-text("View My Legal Strategy")'));

    await page.locator('input[placeholder="Your Full Name"]').fill("Pooja Iyer");
    await page.locator('input[placeholder="10-Digit Mobile"]').fill("9876543210");
    await page.locator('input[placeholder*="City"]').fill("Bengaluru");

    await clickBtn(page.locator('button:has-text("Generate Case File & Assign Senior Advocate")'));
    await expect(page.locator("text=/Case File Ref #DSE-[A-Z0-9]+/")).toBeVisible({ timeout: 10000 });
  });

  test("Test 1.4: Interactive Settlement Calculator at /calculator updates 3-month staged breakdown", async ({ page }) => {
    await page.goto("/calculator");
    await page.waitForLoadState("domcontentloaded");

    // Drag / set slider to ₹12,00,000
    const slider = page.locator('input[type="range"]');
    await expect(slider).toBeVisible();
    await slider.fill("1200000");
    await slider.dispatchEvent("input");
    await slider.dispatchEvent("change");

    // Select Personal Loan & Job Loss
    await page.locator('button:has-text("Personal Loan")').first().evaluate((el: HTMLElement) => el.click());
    await page.locator('button:has-text("Job Loss")').first().evaluate((el: HTMLElement) => el.click());

    // Verify 3-Month Installment Breakdown updates dynamically
    await expect(page.locator("text=3-Month Installment Breakdown").first()).toBeVisible();
    await expect(page.locator("text=Part 1").first()).toBeVisible();
    await expect(page.locator("text=Part 2").first()).toBeVisible();
    await expect(page.locator("text=Part 3").first()).toBeVisible();

    // Assert currency formatted values are rendered
    const installmentCards = page.locator(".grid.grid-cols-3 >> text=/₹[0-9,]+/");
    await expect(installmentCards.first()).toBeVisible();
  });

  test("Test 1.5: Contact Page Dual Tabs and Weekday Date Picker Validation", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500); // ensure React hydration

    // Tab 1: Fill Advocate Debt Assessment form
    const nameInput = page.locator('input[placeholder="e.g. Vikramaditya Rathore"]');
    const phoneInput = page.locator('form input[placeholder="9876543210"]').first();
    const cityInput = page.locator('input[placeholder="e.g. Mumbai, Maharashtra"]');

    await nameInput.scrollIntoViewIfNeeded();
    await nameInput.fill("Rohan Kapoor");
    await phoneInput.fill("9876543210");
    await cityInput.fill("Pune");

    await expect(nameInput).toHaveValue("Rohan Kapoor");
    await expect(phoneInput).toHaveValue("9876543210");
    await expect(cityInput).toHaveValue("Pune");

    // Submit Tab 1
    const [tab1Res] = await Promise.all([
      page.waitForResponse((res) => res.url().includes("/api/leads") && res.request().method() === "POST"),
      page.locator('button:has-text("Submit Case for Legal Evaluation")').click({ force: true }),
    ]);
    expect(tab1Res.status()).toBe(200);

    // Assert summary modal appears with Case Reference ID
    await expect(page.locator("text=Assigned Legal File Number")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=/DSE-[A-Z0-9]+/").first()).toBeVisible();
    await expect(page.locator("text=Rohan Kapoor").first()).toBeVisible();

    // Close modal via Escape key
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);

    // Tab 2: Switch to Consultation booking tab
    await page.locator('button:has-text("Book 1-on-1 Call")').click();

    const datePicker = page.locator('input[name="consultationDate"]');
    const submitBtn = page.locator('button:has-text("Confirm 1-on-1 Consultation Call")');

    // Select a weekend date (Saturday: 2026-11-07)
    await datePicker.fill("2026-11-07");
    await datePicker.dispatchEvent("change");

    // Assert validation error and disabled submit button
    const dateError = page.locator('[data-testid="date-error"]');
    await expect(dateError).toBeVisible();
    await expect(dateError).toContainText("weekdays");
    await expect(submitBtn).toBeDisabled();

    // Select a valid weekday (Monday: 2026-11-09)
    await datePicker.fill("2026-11-09");
    await datePicker.dispatchEvent("change");

    // Assert error cleared and booking enabled
    await expect(dateError).not.toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });
});
