const ERC721Patronage = artifacts.require("ERC721Patronage");
const HarbergerSteward = artifacts.require("HarbergerSteward");

const patronageNumerator = 2400000000000;

const receiptGenerationRate = 11574074074074; // This is just less (rounded down) than one token a day (ie. 10^18 / 86400)

module.exports = function(deployer, networkName, accounts) {
  deployer.then(async () => {
    // Don't try to deploy/migrate the contracts for tests
    if (networkName === "test") {
      return;
    }

    const steward = await HarbergerSteward.deployed();

    await steward.listNewTokens(
      [0, 1],
      [accounts[0], accounts[0]],
      [patronageNumerator, patronageNumerator],
      [receiptGenerationRate, receiptGenerationRate],
      { from: accounts[0] }
    );
  });
};
