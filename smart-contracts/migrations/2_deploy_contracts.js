var PlantSmartContract = artifacts.require("./PlantSmartContract.sol");
var ExchangeSmartContract = artifacts.require("./ExchangeSmartContract.sol");

module.exports = function(deployer) {
  deployer.deploy(PlantSmartContract);
  deployer.link(PlantSmartContract, ExchangeSmartContract);
  deployer.deploy(ExchangeSmartContract);
};
