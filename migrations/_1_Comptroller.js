// ++++++++++++++++ Define Contracts ++++++++++++++++ 

//Token First
const comptroller = artifacts.require("Comptroller");
const proxyObj = artifacts.require("ComptrollerProxy");

// ++++++++++++++++  Main Migration ++++++++++++++++ 

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployToken(deployer, network, accounts),
  ]);
};

module.exports = migration;

// ++++++++++++++++  Deploy Functions ++++++++++++++++ 
async function deployToken(deployer, network, accounts) {
  let gas_price = 1000000000;
  let fromAccount = accounts[0];

  await deployer.deploy(comptroller);
  await deployer.deploy(proxyObj);

  let comptrollerAddress = comptroller.address;
  let proxyAddress = proxyObj.address;
  
  let contract_comptroller = new web3.eth.Contract(comptroller.abi, comptrollerAddress);
  let contract_proxy = new web3.eth.Contract(proxyObj.abi, proxyAddress);

  await Promise.all([
    contract_proxy.methods._setPendingImplementation(comptrollerAddress).send({ from: fromAccount, gasPrice: gas_price, gas: 100000}, function(err, txId) {
      if (err != null) {
        console.log("_setPendingImplementation error: " + err);
      }
      console.log("_setPendingImplementation txid: "+txId);
    }),

    contract_comptroller.methods._become(proxyAddress).send({ from: fromAccount, gasPrice: gas_price, gas: 100000}, function(err, txId) {
      if (err != null) {
        console.log("_become error: " + err);
      }
      console.log("_become txid: "+txId);
    }),

  ]);
}