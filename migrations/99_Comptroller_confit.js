// ++++++++++++++++ Define Contracts ++++++++++++++++ 

const proxyImpl = artifacts.require("Comptroller");

let proxyAddress = "0xbB78719C0d175B9c523650d1d2C1A9D5a4cf1668";
let contract_proxy = new web3.eth.Contract(proxyImpl.abi, proxyAddress);
let gtokens = ["0x096F5e3256045C5d000486062360292DB0476D79","0x21636d81864809a335ABE1618De54768cc2142B9","0xDac781B50F9F61BD1c0E0eE2c547F083D5FA7e7d"];
let collateralFactors = ["750000000000000000","0","750000000000000000"];

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


  for(let i = 0; i < gtokens.length; i++ ){
    await Promise.all(
      contract_proxy.methods._setCollateralFactor(gtokens[i], collateralFactors[i]).send({ from: fromAccount, gasPrice: gas_price, gas: 400000}, function(err, txId) {
        if (err != null) {
          console.log(i+" _setCollateralFactor error: " + err);
        }
        console.log(i+" _setCollateralFactor txid: "+txId);
      }),
    ]);
  }

 
}
