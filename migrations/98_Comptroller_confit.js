// ++++++++++++++++ Define Contracts ++++++++++++++++ 

const proxyImpl = artifacts.require("Comptroller");

let proxyAddress = "0xbB78719C0d175B9c523650d1d2C1A9D5a4cf1668";
let contract_proxy = new web3.eth.Contract(proxyImpl.abi, proxyAddress);
let gtokens = ["0x096F5e3256045C5d000486062360292DB0476D79","0x21636d81864809a335ABE1618De54768cc2142B9","0xDac781B50F9F61BD1c0E0eE2c547F083D5FA7e7d"];
let collateralFactors = ["750000000000000000","0","750000000000000000"];
let gofSpeeds = ["10750000000000000","9650000000000000","67000000000000000"];
let borrowCaps = ["0","0","0"];
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

  let oracleAddress = "0x830185F80D3a1733B75b2339dD712442D784c9F3";
  let closeFactor = "500000000000000000";
  let liquidationIncentive = "1080000000000000000";
  await Promise.all([
    contract_proxy.methods._setPriceOracle(oracleAddress).send({ from: fromAccount, gasPrice: gas_price, gas: 100000}, function(err, txId) {
      if (err != null) {
        console.log("_setPriceOracle error: " + err);
      }
      console.log("_setPriceOracle txid: "+txId);
    }),
    
    contract_proxy.methods._setCloseFactor(closeFactor).send({ from: fromAccount, gasPrice: gas_price, gas: 100000}, function(err, txId) {
      if (err != null) {
        console.log("_setCloseFactor error: " + err);
      }
      console.log("_setCloseFactor txid: "+txId);
    }),
    
    contract_proxy.methods._setLiquidationIncentive(liquidationIncentive).send({ from: fromAccount, gasPrice: gas_price, gas: 100000}, function(err, txId) {
      if (err != null) {
        console.log("_setLiquidationIncentive error: " + err);
      }
      console.log("_setLiquidationIncentive txid: "+txId);
    }),

  ]);


  for(let i = 0; i < gtokens.length; i++ ){
    await Promise.all([
      contract_proxy.methods._supportMarket(gtokens[i]).send({ from: fromAccount, gasPrice: gas_price, gas: 300000}, function(err, txId) {
        if (err != null) {
          console.log(i+" _supportMarket error: " + err);
        }
        console.log(i+" _supportMarket txid: "+txId);
      }),
    
      contract_proxy.methods._setGofSpeed(gtokens[i], gofSpeeds[i]).send({ from: fromAccount, gasPrice: gas_price, gas: 1000000}, function(err, txId) {
        if (err != null) {
          console.log(i+" _setGofSpeed error: " + err);
        }
        console.log(i+" _setGofSpeed txid: "+txId);
      }),
    ]);
  }

  await Promise.all([
    contract_proxy.methods._setMarketBorrowCaps(gtokens, borrowCaps).send({ from: fromAccount, gasPrice: gas_price, gas: 1000000}, function(err, txId) {
      if (err != null) {
        console.log("_setMarketBorrowCaps error: " + err);
      }
      console.log("_setMarketBorrowCaps txid: "+txId);
    }),

  ]);
}
