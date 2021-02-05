// ++++++++++++++++ Define Contracts ++++++++++++++++ 

//Token First
const interestRateModel = artifacts.require("CommonInterestRateModel");
const gEther = artifacts.require("GEther");

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

  let baseRate = "20000000000000000"; // per year
  let multiplier = "100000000000000000"; // per year
  await deployer.deploy(interestRateModel, baseRate, multiplier);

  let interestRateModelAddress = interestRateModel.address;
  let comptrollerAddress = "0xbB78719C0d175B9c523650d1d2C1A9D5a4cf1668";
  let rateMantissa = "200000000000000000000000000";
  // ComptrollerInterface comptroller_, 
  // InterestRateModel interestRateModel_, 
  // uint initialExchangeRateMantissa_, 
  // string memory name_, 
  // string memory symbol_, 
  // uint decimals_
  await deployer.deploy(gEther, comptrollerAddress, interestRateModelAddress, rateMantissa, "Golff Ether", "gETH", 8, fromAccount);
  let getherAddress = gEther.address;
  
  // set reserveFactor 200000000000000000 储备系数
  let reserveFactorMantissa = "200000000000000000";
  let contract_gether = new web3.eth.Contract(gEther.abi, getherAddress);

  await Promise.all([
    contract_gether.methods._setReserveFactor(reserveFactorMantissa).send({ from: fromAccount, gasPrice: gas_price, gas: 100000}, function(err, txId) {
      if (err != null) {
        console.log("CEther _setReserveFactor error: " + err);
      }
      console.log("CEther _setReserveFactor txid: "+txId);
    }),

  ]);
}