// Load zos scripts and truffle wrapper function
const { scripts, ConfigManager } = require("@openzeppelin/cli");
const { add, push, create } = scripts;

async function deploy(options, accounts) {
  add({
    contractsData: [
      { name: "ERC721Patronage", alias: "ERC721Patronage" },
      { name: "HarbergerSteward", alias: "HarbergerSteward" },
    ],
  });

  await push({ ...options, force: true });

  const steward = await create(
    Object.assign({ contractAlias: "HarbergerSteward" }, options)
  );
  const patronageToken = await create({
    ...options,
    contractAlias: "ERC721Patronage",
    methodName: "setup",
    methodArgs: [steward.address, "WildcardsTokens", "WT", accounts[0]],
  });
}

module.exports = function(deployer, networkName, accounts) {
  deployer.then(async () => {
    // Don't try to deploy/migrate the contracts for tests
    if (networkName === "test" || networkName === "testCi") {
      return;
    }
    const { network, txParams } = await ConfigManager.initNetworkConfiguration({
      network: networkName,
      from: accounts[0],
    });
    await deploy({ network, txParams }, accounts);
  });
};
