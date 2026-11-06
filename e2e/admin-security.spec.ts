import { test, expect } from "@playwright/test";

test.describe("ADMIN AUTHENTICATION & ZERO-TRUST SECURITY BOUNDARIES", () => {
  test("Test 2.1: Admin Login Success & Layout Isolation", async ({ page, context }) => {
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500); // ensure React client hydration

    // Fill seeded credentials
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await emailInput.fill("admin@debtsupportexpert.com");
    await passwordInput.fill("Admin@12345");
    await expect(emailInput).toHaveValue("admin@debtsupportexpert.com");
    await expect(passwordInput).toHaveValue("Admin@12345");

    await Promise.all([
      page.waitForURL((url) => url.pathname === "/admin"),
      page.locator('button[type="submit"]').click({ force: true }),
    ]);

    // Assert URL redirected to /admin
    expect(page.url()).toContain("/admin");

    // Assert presence of HTTP-only session cookie
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === "dse_admin_token");
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.httpOnly).toBe(true);

    // Assert absence of public Navbar & Footer
    await expect(page.locator("nav.public-navbar, #rbi-ticker, #sticky-mobile-cta")).not.toBeVisible();
    await expect(page.locator("footer.public-footer")).not.toBeVisible();

    // Assert Executive Command Center / CRM frame is active
    await expect(page.locator("text=Command Center").first()).toBeVisible();
  });

  test("Test 2.2: Anti-Enumeration Defense on Failed Auth", async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500); // ensure React client hydration

    // Non-existent email & wrong password
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await emailInput.fill("nonexistent.counsel@fakebar.com");
    await passwordInput.fill("WrongPassword@999");
    await expect(emailInput).toHaveValue("nonexistent.counsel@fakebar.com");
    await expect(passwordInput).toHaveValue("WrongPassword@999");

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes("/api/auth/login")),
      page.locator('button[type="submit"]').click({ force: true }),
    ]);

    expect(response.status()).toBe(401);

    // Standardized generic error to prevent account enumeration
    const errorAlert = page.locator("text=Invalid email or password.");
    await expect(errorAlert).toBeVisible();
  });

  test("Test 2.3: Unauthenticated Route Protection redirects to Login", async ({ page, context }) => {
    // Clear cookies
    await context.clearCookies();

    // Access protected route /admin/leads
    await page.goto("/admin/leads");
    await page.waitForURL((url) => url.pathname === "/admin/login");
    expect(page.url()).toContain("/admin/login");

    // Access protected route /admin/whatsapp
    await page.goto("/admin/whatsapp");
    await page.waitForURL((url) => url.pathname === "/admin/login");
    expect(page.url()).toContain("/admin/login");
  });

  test("Test 2.4: RBAC Boundary Verification for LEGAL_ADVISOR", async ({ page }) => {
    // Log in as Legal Advisor
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500); // ensure React client hydration
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await emailInput.fill("advocate.sharma@debtsupportexpert.com");
    await passwordInput.fill("Advisor@12345");
    await expect(emailInput).toHaveValue("advocate.sharma@debtsupportexpert.com");
    await expect(passwordInput).toHaveValue("Advisor@12345");

    await Promise.all([
      page.waitForURL((url) => url.pathname === "/admin"),
      page.locator('button[type="submit"]').click({ force: true }),
    ]);

    // Attempt to access /admin/settings (Restricted to SUPER_ADMIN)
    await page.goto("/admin/settings");
    await page.waitForURL((url) => url.pathname === "/admin");
    // Assert redirect away from /admin/settings to /admin
    expect(page.url()).not.toContain("/admin/settings");

    // Attempt to trigger GET /api/admin/leads/export (Restricted to SUPER_ADMIN)
    const exportResponse = await page.request.get("/api/admin/leads/export");
    expect(exportResponse.status()).toBe(403);
    const body = await exportResponse.json();
    expect(body.error).toContain("Super Administrator authority required");
  });
});
