import { test, expect } from "@playwright/test";

test.describe("CRM WORKSPACE & IN-APP WHATSAPP CONSOLE", () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate as Super Admin before each CRM test
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);
    await page.locator('input[type="email"]').fill("admin@debtsupportexpert.com");
    await page.locator('input[type="password"]').fill("Admin@12345");
    await Promise.all([
      page.waitForURL((url) => url.pathname === "/admin"),
      page.locator('button[type="submit"]').click({ force: true }),
    ]);
  });

  test("Test 3.1: Leads Table Search & Priority Filter", async ({ page }) => {
    await page.goto("/admin/leads");
    await page.waitForLoadState("domcontentloaded");

    const searchInput = page.locator('input[placeholder*="Search Name, Mobile, City"]');
    await expect(searchInput).toBeVisible();

    // Fast search for "Rahul"
    await searchInput.fill("Rahul");
    await page.waitForTimeout(300);

    // Verify filtered table results
    const rahulRow = page.locator("table tbody tr:has-text('Rahul Sharma')");
    await expect(rahulRow.first()).toBeVisible();

    // Clear search and test priority filter "HOT"
    await searchInput.fill("");
    await page.waitForTimeout(200);

    const hotFilterBtn = page.locator("button:text-is('HOT')").first();
    await hotFilterBtn.click();
    await page.waitForTimeout(300);

    // Assert rows displayed possess HOT tags or harassment emergency indicators
    const hotBadges = page.locator("table tbody tr >> text=HOT");
    await expect(hotBadges.first()).toBeVisible();
  });

  test("Test 3.2: 360° Lead Drawer Workflow & Fee Proposal Generator", async ({ page }) => {
    await page.goto("/admin/leads");
    await page.waitForLoadState("domcontentloaded");

    // Click on a lead to open slide-over drawer
    const firstRow = page.locator("table tbody tr").first();
    await expect(firstRow).toBeVisible();
    await firstRow.click();

    // Assert drawer dialog is open
    const drawer = page.locator('div[role="dialog"]');
    await expect(drawer).toBeVisible();

    // Test Adding an Internal Note
    const notesTab = drawer.locator('button:has-text("Advocate Notes")');
    await notesTab.click();

    const noteInput = drawer.locator("textarea");
    const testNoteText = `Client agreed to 45% compromise settlement terms at ${Date.now()}.`;
    await noteInput.fill(testNoteText);

    await drawer.locator('button:has-text("Add Internal Note")').click();

    // Assert note persists in the UI timeline optimistically
    await expect(drawer.locator("p", { hasText: testNoteText }).first()).toBeVisible();

    // Test 1-Click Fee Proposal Buttons: Switch to Case Details tab
    const detailsTab = drawer.locator('button:has-text("Case Details")');
    await detailsTab.click();

    // Intercept window.open
    let openedUrl = "";
    await page.exposeFunction("mockWindowOpen", (url: string) => {
      openedUrl = url;
    });
    await page.evaluate(() => {
      window.open = (url?: string | URL) => {
        if (url && (window as any).mockWindowOpen) {
          (window as any).mockWindowOpen(String(url));
        }
        return null;
      };
    });

    // Click ₹5,000 Essential Plan
    const proposal5k = drawer.locator('button:has-text("₹5,000")').first();
    await expect(proposal5k).toBeVisible();
    await proposal5k.click();

    expect(openedUrl).toContain("https://wa.me/");
    const decodedUrl = decodeURIComponent(openedUrl);
    expect(decodedUrl).toContain("LEGAL FEE PROPOSAL");
    expect(decodedUrl).toContain("₹5,000");

    // Click ₹10,000 Full Rebuilding Plan
    const proposal10k = drawer.locator('button:has-text("₹10,000")').first();
    await proposal10k.click();
    const decoded10k = decodeURIComponent(openedUrl);
    expect(decoded10k).toContain("₹10,000");
  });

  test("Test 3.3: In-App WhatsApp Console & Quick Legal Action Reply", async ({ page }) => {
    await page.goto("/admin/whatsapp");
    await page.waitForLoadState("domcontentloaded");

    // Wait for conversation item
    const firstConversation = page.locator(".cursor-pointer:has(h3)").first();
    await expect(firstConversation).toBeVisible({ timeout: 10000 });
    await firstConversation.click();

    // Verify message bubble thread loads
    const chatContainer = page.locator(".flex-1.overflow-y-auto").last();
    await expect(chatContainer).toBeVisible();

    // Click a Quick Reply from Legal Action Bar
    const quickReplyBtn = page.locator('button:has-text("📋 Document Checklist")');
    await expect(quickReplyBtn).toBeVisible();
    await quickReplyBtn.click();

    // Assert text is populated in composer
    const composer = page.locator('textarea[placeholder*="Type your legal response"]');
    await expect(composer).not.toBeEmpty();
    const currentText = await composer.inputValue();
    expect(currentText).toContain("loan sanction letters");
    const sentText = currentText + ` [Batch: ${Date.now()}]`;
    await composer.fill(sentText);

    // Send reply
    const sendBtn = page.locator('button:has-text("Send")');
    await sendBtn.click();

    // Assert message bubble appends to chat stream with outbound tick status
    const outboundMessage = chatContainer.locator(`text=${sentText}`).first();
    await expect(outboundMessage).toBeVisible({ timeout: 5000 });
  });
});
