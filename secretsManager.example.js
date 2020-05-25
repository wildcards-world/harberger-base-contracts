const mnemonic =
  // NOTE: this key is public!! Change it and don't put it in git if you are doing something important!
  //       Please try leave some test eth in this account for others to test these contracts with :)
  "party quit pave nasty slim vacant coconut satoshi enact diet convince brand"; // 12 word mnemonic

const mainnetProviderUrl =
  "https://mainnet.infura.io/v3/c401b8ee3a324619a453f2b5b2122d7a";
const rinkebyProviderUrl =
  "https://rinkeby.infura.io/v3/c401b8ee3a324619a453f2b5b2122d7a";
const goerliProviderUrl =
  "https://goerli.infura.io/v3/c401b8ee3a324619a453f2b5b2122d7a";

module.exports = {
  mnemonic,
  mainnetProviderUrl,
  rinkebyProviderUrl,
  goerliProviderUrl,
};
