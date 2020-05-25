const Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer, networkName) {
  if (networkName === "test" || networkName === "testCi") {
    return;
  }
  deployer.deploy(Migrations);
};
