/**
 * If action gets too long inside PuppeteerMetamask, export it here.
 */

const {
  click,
  type,
  get,
  delay,
  waitForText,
} = require("../puppeteer-better-utils");
const { homePage } = require("./pages");

async function setupWalletAction(browser, bundleInfo) {
  const page = await browser.newPage();
  // open welcome page
  await page.goto(`chrome-extension://${bundleInfo.extensionId}/home.html`);

  // click on "Get started"
  await click(page, "#app-content .welcome-page .first-time-flow__button");

  // click on "Create wallet"
  await click(
    page,
    "#app-content .first-time-flow .select-action .select-action__select-button:last-child button"
  );

  // click on "No thanks"
  await click(
    page,
    "#app-content .metametrics-opt-in .page-container__footer-button:first-child"
  );

  // type in wallet password and confirmation
  await type(page, "#create-password", bundleInfo.walletPass);
  await type(page, "#confirm-password", bundleInfo.walletPass);

  // click on "I have read and agree to TOS" checkbox
  await click(page, "#app-content .first-time-flow__checkbox");

  // click on "Create" button
  await click(
    page,
    "#app-content .first-time-flow__form button.btn-primary",
    500
  );

  await waitForText(page, ".first-time-flow__header", "Secret Backup Phrase");
  // click on "Remind me later"
  await click(page, "#app-content .reveal-seed-phrase__buttons .btn-secondary");

  // NOTE: is popover happening all the time? If it's dynamic - we may need to detect
  // its presence before attempting to close it
  //
  // Click on close icon of intro popover
  await click(page, "#popover-content .intro-popup__popover button.fa-times");

  await page.close();
}

module.exports = {
  setupWalletAction,
};
