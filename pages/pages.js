const { waitFor } = require("../puppeteer-better-utils");

async function homePage(browser, bundleInfo) {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${bundleInfo.extensionId}/home.html`);

  return page;
}

const homePageElements = {
  networkSwitcher: {
    button: "div.app-header__network-component-wrapper > div",
    networkName:
      "div.app-header__network-component-wrapper > div > div > div.network-name",
    nthElement: (n) => `.network-droppo > div > li:nth-child(${3 + n})`,
  },
  accountSwitcher: {
    button: ".account-menu__icon",
    menuItems: {
      importAccount:
        "#app-content > div > div.menu.account-menu > div:nth-child(7)",
    },
  },
  overlay: {
    text: "div.loading-overlay > div > span",
  },
  // home page can show announcement about "new" version on first open
  announcement: {
    visible: ".welcome-page",
  },
  // ...or can be a lock screen
  lock: {
    visible: ".unlock-page",
    passwordInput: "#password",
    unlockButton:
      "#app-content > div > div.main-container-wrapper > div > div > button",
  },
  // connect wallet for tests with predifined wallet
  connectWallet: {
    identIcon:
      "#app-content .app-header__account-menu-container .account-menu__icon",
    importAccount: "#app-content > div > div.account-menu > div:nth-child(7)",
  },
};

const switchNetworkElements = {
  selectedNetwork:
    "#app-content > div > div.app-header.app-header--back-drop > div > div.app-header__account-menu-container > div.app-header__network-component-wrapper > div",
  robstenSelection:
    "#app-content > div > div.menu-droppo-container.network-droppo > div > li:nth-child(4)",
};

const importAccountPageElements = {
  privateKeyBox: "#private-key-box",
  importButton:
    "#app-content > div > div.main-container-wrapper > div > div.new-account__form > div > div.new-account-import-form__private-key > div.new-account-import-form__buttons > button.button.btn-secondary.btn--large.new-account-create-form__button",
};

async function findNotificationPage(browser, bundleInfo) {
  return waitFor(async () => {
    await browser.waitForTarget((target) =>
      target.url().startsWith(
        `chrome-extension://${bundleInfo.extensionId}/notification.html`
      ) || 
      target.url().startsWith(
        `chrome-extension://${bundleInfo.extensionId}/home.html`
      )
    );
    const pages = await browser.pages();

    const notificationPages = pages.filter((p) =>
      p.url().startsWith(
        `chrome-extension://${bundleInfo.extensionId}/notification.html`
      ) || p.url().startsWith(
        `chrome-extension://${bundleInfo.extensionId}/home.html`
      )
    );

    console.assert(
      notificationPages.length === 1,
      "Couldn't find notification page!"
    );

    return notificationPages[0];
  });
}

const notificationPageElements = {
  selectAccount: {
    nextButton: "#app-content .permissions-connect .btn-primary",
    cancelButton: "#app-content .permissions-connect .btn-secondary",
  },
  connectAccount: {
    nextButton: "#app-content .permissions-connect .btn-primary",
    cancelButton: "#app-content .permissions-connect .btn-secondary",
  },
  connectApproval: {
    connectButton: "#app-content .permissions-connect .btn-primary",
    cancelButton: "#app-content .permissions-connect .btn-default",
  },
  requestSignature: {
    signButton:
      "#app-content .main-container-wrapper .request-signature__container .btn-secondary",
    cancelButton:
      "#app-content .main-container-wrapper .rrequest-signature__container .btn-default",
  },
  confirmTransaction: {
    confirmButton: "#app-content footer .btn-primary",
    rejectButton: "#app-content footer .btn-default",
  },
};

module.exports = {
  homePage,
  homePageElements,
  importAccountPageElements,
  switchNetworkElements,
  findNotificationPage,
  notificationPageElements,
};
