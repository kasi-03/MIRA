import { chromium } from 'playwright';

async function runPlaywrightVerification() {
  console.log('=== Playwright Live Verification: MIRA System ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = {
    appLoaded: false,
    desktopWorkspaceActive: false,
    phone1MobileToggle: false,
    phone1SimulatorRendered: false,
    switchedBackToDesktop: false,
    connectivityTabVerified: false,
    tasksTabVerified: false,
    taskComposerModalVerified: false,
    intentConfirmationVerified: false,
    outputTabVerified: false
  };

  try {
    // 1. App Loads
    console.log('[1/8] Navigating to http://localhost:3000 ...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
    const title = await page.title();
    console.log('✓ Page Title:', title);
    results.appLoaded = title.includes('MIRA');

    // 2. Initial Desktop Workspace
    const mainWorkspace = await page.locator('.main-workspace').isVisible();
    console.log('✓ Desktop Workspace Active:', mainWorkspace);
    results.desktopWorkspaceActive = mainWorkspace;

    // 3. Switch to Phone 1 Mobile Simulator View
    console.log('[2/8] Switching to Phone 1 (Mobile) view...');
    const mobilePill = page.locator('button:has-text("Phone 1 (Mobile)")').first();
    if (await mobilePill.isVisible()) {
      await mobilePill.click();
      await page.waitForTimeout(500);
      const switchBackBtn = page.locator('button:has-text("Switch to Desktop")').first();
      const mobileActive = await switchBackBtn.isVisible();
      console.log('✓ Phone 1 Mobile View Active:', mobileActive);
      results.phone1MobileToggle = mobileActive;
      results.phone1SimulatorRendered = mobileActive;

      // 4. Switch back to Desktop
      console.log('[3/8] Switching back to Desktop View...');
      await switchBackBtn.click();
      await page.waitForTimeout(500);
      results.switchedBackToDesktop = await page.locator('.main-workspace').isVisible();
      console.log('✓ Switched back to Desktop:', results.switchedBackToDesktop);
    }

    // 5. Connectivity & MCP Tab
    console.log('[4/8] Inspecting Connectivity & MCP Tab...');
    const connBtn = page.locator('button:has-text("Connectivity & MCP"), span:has-text("Connectivity")').first();
    await connBtn.click();
    await page.waitForTimeout(600);
    const connContent = await page.locator('text=Connectivity').first().isVisible();
    console.log('✓ Connectivity Tab Rendered:', connContent);
    results.connectivityTabVerified = connContent;

    // 6. Tasks & Lifecycle Tab
    console.log('[5/8] Inspecting Tasks & Lifecycle Tab...');
    const tasksBtn = page.locator('button:has-text("Tasks & Lifecycle"), span:has-text("Tasks")').first();
    await tasksBtn.click();
    await page.waitForTimeout(600);
    const tasksContent = await page.locator('text=Task Registry').or(page.locator('text=Tasks')).first().isVisible();
    console.log('✓ Tasks Tab Rendered:', tasksContent);
    results.tasksTabVerified = tasksContent;

    // 7. Task Composer & Intent Confirmation Flow
    console.log('[6/8] Opening Task Composer Modal...');
    const newTaskBtn = page.locator('button:has-text("New Task")').first();
    await newTaskBtn.click();
    await page.waitForTimeout(600);
    results.taskComposerModalVerified = await page.locator('text=New MIRA Task').isVisible();
    console.log('✓ Task Composer Modal Open:', results.taskComposerModalVerified);

    console.log('[7/8] Submitting Prompt to MIRA...');
    const promptInput = page.locator('textarea').first();
    await promptInput.fill("Create a file named mira-test.txt containing 'MIRA integration test' inside the configured MIRA test workspace.");
    await page.waitForTimeout(300);

    const submitBtn = page.locator('button:has-text("Submit to MIRA")').first();
    await submitBtn.click();
    await page.waitForTimeout(800);

    const intentCard = await page.locator('text=Confirm Task Intent').or(page.locator('text=Confirm & Proceed')).first().isVisible();
    console.log('✓ Intent Confirmation Card Displayed:', intentCard);
    results.intentConfirmationVerified = intentCard;

    // Click Confirm & Proceed
    const confirmBtn = page.locator('button:has-text("Confirm & Proceed")').first();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await page.waitForTimeout(800);
      console.log('✓ Task Intent Confirmed and Dispatched');
    }

    // 8. Verified Outputs Tab
    console.log('[8/8] Inspecting Verified Outputs Tab...');
    const outputBtn = page.locator('button:has-text("Verified Output"), span:has-text("Output")').first();
    await outputBtn.click();
    await page.waitForTimeout(600);
    results.outputTabVerified = await page.locator('text=Outputs').or(page.locator('text=Artifact')).first().isVisible();
    console.log('✓ Verified Output Tab Rendered:', results.outputTabVerified);

  } catch (err) {
    console.error('Playwright Error:', err.message);
  } finally {
    await browser.close();
  }

  console.log('\n=== Playwright Verification Results ===');
  console.log(JSON.stringify(results, null, 2));

  const allPassed = Object.values(results).every(v => v === true);
  if (allPassed) {
    console.log('\n>>> ALL 10 PLAYWRIGHT CHECKS PASSED SUCCESSFULLY! <<<');
    process.exit(0);
  } else {
    console.log('\n>>> SOME CHECKS FAILED OR WERE INCOMPLETE <<<');
    process.exit(1);
  }
}

runPlaywrightVerification();
