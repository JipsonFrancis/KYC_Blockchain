var Customer = artifacts.require("Customer");

module.exports = function(deployer) {
  deployer.deploy(Customer);
};