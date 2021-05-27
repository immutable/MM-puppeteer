const Puppeteer = require("puppeteer-core");
const STANDARD_DELAY = 500;

async function get(page, selector, options) {
  await page.waitForSelector(selector, options, { timeout: 50000 });
  const handle = await page.$(selector);

  if (!handle) {
    throw new Error(`Couldnt find ${selector}`);
  }

  return handle;
}

async function click(page, selector, delayMs) {
  if (delayMs) {
    await delay(delayMs);
  }
  await page.waitForSelector(selector);
  await page.click(selector);
}

async function type(page, selector, input) {
  await page.waitForSelector(selector);
  await page.focus(selector);
  await page.type(selector, input);
}

async function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

/**
 * /**
 * This is different than page.waitFor b/c fn is executed in node context
 * @param fn — returns error string or undefined for success
 */
async function waitFor(fn, repeat = 5) {
  let lastError;
  for (let i = 0; i < repeat; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
    }

    await delay(STANDARD_DELAY);
  }

  throw new Error(lastError);
}

async function waitForText(page, selector, expectedText, options) {
  return waitFor(
    async () => {
      const actualText = await page.evaluate(
        // @ts-ignore
        (selector) =>
          document.querySelector(selector) &&
          document.querySelector(selector).textContent,
        selector
      );

      if (typeof expectedText === "string" && actualText === expectedText) {
        return;
      } else if (
        expectedText instanceof RegExp &&
        expectedText.test(actualText)
      ) {
        return;
      }

      throw new Error(
        `Couldnt find ${selector} with ${expectedText}. Last value was: ${actualText}`
      );
    },
    options ? options.timeout / STANDARD_DELAY : undefined
  );
}

module.exports = {
  get,
  click,
  type,
  delay,
  waitFor,
  waitForText,
  STANDARD_DELAY,
};
