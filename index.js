const {
  homePage,
  homePageElements,
  importAccountPageElements,
  switchNetworkElements,
  findNotificationPage,
  notificationPageElements,
} = require("./pages/pages");
const {
  get,
  click,
  waitForText,
  type,
  delay,
} = require("./puppeteer-better-utils");
const { setupWalletAction } = require("./pages/actions");
require("dotenv").config();

// export type MetamaskNetwork = "main" | "ropsten" | "kovan" | "rinkeby" | "localhost";
// export type MetamaskStatus = "unlocked" | "locked" | "uninitialized";
const networkToPos = {
  main: 0,
  ropsten: 1,
  kovan: 2,
  rinkeby: 3,
  localhost: 4,
};

class PuppeteerMetamask {
  constructor(browser, metamaskBundleInfo) {
    this.browser = browser;
    this.metamaskBundleInfo = metamaskBundleInfo;
  }

  extensionURL() {
    return `chrome-extension://${this.metamaskBundleInfo.extensionId}/`;
  }

  async getMetamaskPages() {
    const pages = await this.browser.pages();
    console.log("extension url", this.extensionURL());
    pages.map((p) => console.log(p.url()));
    return pages.filter((page) => page.url().startsWith(this.extensionURL()));
  }

  async closeAll() {
    const pages = await this.getMetamaskPages();
    for (const page of pages) {
      await page.close();
    }
  }

  async setupWallet() {
    await setupWalletAction(this.browser, this.metamaskBundleInfo);
  }

  /**
   * Useful in some environments (ie. cypress dev mode) that cache browser extension data between the runs.
   */
  async getStatus() {
    const page = await homePage(this.browser, this.metamaskBundleInfo);

    const hasLock = await page
      .waitFor(homePageElements.lock.visible, { timeout: 1000 })
      .then(() => true)
      .catch(() => false);

    const hasWelcomeAnnouncement = await page
      .waitFor(homePageElements.announcement.visible, { timeout: 1000 })
      .then(() => true)
      .catch(() => false);

    await page.close();

    if (hasLock) {
      return "locked";
    } else if (hasWelcomeAnnouncement) {
      return "uninitialized";
    } else {
      return "unlocked";
    }
  }

  async getURL() {
    const pages = await this.getMetamaskPages();
    if (pages.length < 1) {
      console.log("GET URL - no page");
      return null;
    }
    const url = pages.pop().url();
    const cleanURL = url.replace(this.extensionURL(), "");
    console.log("GET URL", cleanURL);
    return cleanURL;
  }

  async unlockAccount(password = this.metamaskBundleInfo.walletPass) {
    console.log("metamaskBundleInfo", this.metamaskBundleInfo);
    const page = await homePage(this.browser, this.metamaskBundleInfo);
    await type(page, homePageElements.lock.passwordInput, password);
    await click(page, homePageElements.lock.unlockButton);

    await page.close();
  }

  async loadPrivateKey(privateKey) {
    const page = await homePage(this.browser, this.metamaskBundleInfo);

    await click(page, homePageElements.accountSwitcher.button);
    await click(page, homePageElements.accountSwitcher.menuItems.importAccount);

    await type(page, importAccountPageElements.privateKeyBox, privateKey);
    await click(page, importAccountPageElements.importButton);

    await page.close();
  }

  async changeNetwork(network) {
    const networkName = network === "localhost" ? "Private" : network;
    const page = await homePage(this.browser, this.metamaskBundleInfo);

    await click(page, homePageElements.networkSwitcher.button);
    await click(
      page,
      homePageElements.networkSwitcher.nthElement(networkToPos[network])
    );

    await waitForText(
      page,
      homePageElements.networkSwitcher.networkName,
      new RegExp(`${networkName}`, "i")
    );

    await page.close();
  }

  async getNotificationPage() {
    const notificationPage = await findNotificationPage(
      this.browser,
      this.metamaskBundleInfo
    );
    await notificationPage.bringToFront();
    return notificationPage;
  }

  async waitToCloseNotiPage() {
    const notificationPage = await findNotificationPage(
      this.browser,
      this.metamaskBundleInfo
    );
    await notificationPage.bringToFront();

    return notificationPage;
  }

  async selectWallet() {
    const notificationPage = await this.getNotificationPage();
    await click(
      notificationPage,
      notificationPageElements.selectAccount.nextButton
    );
  }

  async allowToConnect() {
    const notificationPage = await this.getNotificationPage();
    await click(
      notificationPage,
      notificationPageElements.connectApproval.connectButton
    );
  }

  async disallowToConnect() {
    const notificationPage = await this.getNotificationPage();

    await click(
      notificationPage,
      notificationPageElements.connectAccount.cancelButton
    );
  }

  async signTX() {
    const notificationPage = await this.getNotificationPage();
    await click(
      notificationPage,
      notificationPageElements.requestSignature.signButton
    );
  }

  async rejectTX() {
    const notificationPage = await this.getNotificationPage();

    await click(
      notificationPage,
      notificationPageElements.confirmTransaction.rejectButton
    );
  }

  async confirmTx() {
    const notificationPage = await this.getNotificationPage();

    await click(
      notificationPage,
      notificationPageElements.confirmTransaction.confirmButton
    );
  }

  async connectAlice() {
    const page = await homePage(this.browser, this.metamaskBundleInfo);
    await click(page, homePageElements.connectWallet.identIcon);
    await click(page, homePageElements.connectWallet.importAccount);
    await click(page, switchNetworkElements.selectedNetwork);
    await click(page, switchNetworkElements.robstenSelection);
    await type(
      page,
      importAccountPageElements.privateKeyBox,
      process.env.ALICE_WALLET_KEY
    );
    await click(page, importAccountPageElements.importButton);
    await page.close();
  }

  async connectTest() {
    const page = await homePage(this.browser, this.metamaskBundleInfo);
    await click(page, homePageElements.connectWallet.identIcon);
    await click(page, homePageElements.connectWallet.importAccount);
    await click(page, switchNetworkElements.selectedNetwork);
    await click(page, switchNetworkElements.robstenSelection);
    await type(
      page,
      importAccountPageElements.privateKeyBox,
      process.env.TEST_WALLET_KEY
    );
    await click(page, importAccountPageElements.importButton);
    await page.close();
  }

  async connectRevathi() {
    const page = await homePage(this.browser, this.metamaskBundleInfo);
    await click(page, homePageElements.connectWallet.identIcon);
    await click(page, homePageElements.connectWallet.importAccount);
    await click(page, switchNetworkElements.selectedNetwork);
    await click(page, switchNetworkElements.robstenSelection);
    await type(
      page,
      importAccountPageElements.privateKeyBox,
      process.env.TEST_REVATHI_KEY
    );
    await click(page, importAccountPageElements.importButton);
    await page.close();
  }

  async connectNew() {
    const page = await homePage(this.browser, this.metamaskBundleInfo);
    await click(page, switchNetworkElements.selectedNetwork);
    await click(page, switchNetworkElements.robstenSelection);
    await page.close();
  }

  async mintAssets() {
    const page = await homePage(this.browser, this.metamaskBundleInfo);
    console.log(page);
    await page.close();
  }

  async selectRopsten() {
    const page = await homePage(this.browser, this.metamaskBundleInfo);
    await click(page, homePageElements.networkSwitcher.button);
    await click(page, switchNetworkElements.robstenSelection);
    await page.close();
  }
}

module.exports = { PuppeteerMetamask };
