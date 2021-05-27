const { join } = require("path");

// interface MetamaskBundleInfo {
//   absPath: string;
//   // how to find it: https://stackoverflow.com/questions/8946325/chrome-extension-id-how-to-find-it
//   extensionId: string;

//   walletSeed: string;
//   walletPass: string;
// }

const bundledMetamaskInfo = {
  absPath: join(__dirname, "./bundle"),
  extensionId: "nkbihfbeogaeaoehlefnkodbefgpgknn",
  walletSeed:
    "jungle elevator february polar wash tower sword come mosquito goose awesome length",
  walletPass: "test1234",
};

module.exports = bundledMetamaskInfo;
