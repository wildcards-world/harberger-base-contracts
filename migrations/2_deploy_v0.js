// Load zos scripts and truffle wrapper function
const { scripts, ConfigManager } = require("@openzeppelin/cli");
const { add, push, create } = scripts;
const ERC20PatronageReceipt = artifacts.require("ERC20PatronageReceipt");
const HarbergerSteward = artifacts.require("HarbergerSteward");
const ERC721Patronage = artifacts.require("ERC721Patronage");

// for more details about zeppelin-sdk migrations see the example: https://github.com/OpenZeppelin/openzeppelin-sdk/tree/master/examples/truffle-migrate

async function deploy(options, accounts, erc20PatronageReceipt) {
  add({
    contractsData: [
      { name: "ERC721Patronage", alias: "ERC721Patronage" },
      { name: "HarbergerSteward", alias: "HarbergerSteward" },
      { name: "MintManager", alias: "MintManager" },
    ],
  });

  await push({ ...options, force: true });

  // NOTE: from a security standpoint it isn't ideal that the steward isn't initialized earlier.
  //       unfortunately zeppelinOs/sdk doesn't make it easy to create/get the other contract addresses before they are initialized (but of course it definitely can be done!)
  const steward = await create(
    Object.assign({ contractAlias: "HarbergerSteward" }, options)
  );

  const [mintManager, patronageToken] = await Promise.all([
    create(
      Object.assign(
        {
          contractAlias: "MintManager",
          methodName: "initialize",
          methodArgs: [
            accounts[0],
            steward.address,
            erc20PatronageReceipt.address,
          ],
        },
        options
      )
    ),
    create({
      ...options,
      contractAlias: "ERC721Patronage",
      methodName: "setup",
      methodArgs: [steward.address, "WildcardsTokens", "WT", accounts[0]],
    }),
  ]);

  const harbergerStewardInstance = await HarbergerSteward.at(steward.address);

  await harbergerStewardInstance.initialize(
    patronageToken.address,
    accounts[0],
    mintManager.address
  );

  const erc721PatronageInstance = await ERC721Patronage.at(
    patronageToken.address
  );

  await erc721PatronageInstance.addMinter(steward.address, {
    from: accounts[0],
  });
  await erc721PatronageInstance.renounceMinter({ from: accounts[0] });
  await erc20PatronageReceipt.addMinter(mintManager.address, {
    from: accounts[0],
  });
  await erc20PatronageReceipt.renounceMinter({ from: accounts[0] });
}

module.exports = function(deployer, networkName, accounts) {
  deployer.then(async () => {
    // Don't try to deploy/migrate the contracts for tests
    if (networkName === "test") {
      return;
    }

    const erc20PatronageReceipt = await deployer.deploy(
      ERC20PatronageReceipt,
      "Test Receipt Harberger Tokens",
      "TRHT",
      18
    );

    const { network, txParams } = await ConfigManager.initNetworkConfiguration({
      network: networkName,
      from: accounts[0],
    });
    await deploy({ network, txParams }, accounts, erc20PatronageReceipt);
  });
};
