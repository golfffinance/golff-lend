// ++++++++++++++++ Define Contracts ++++++++++++++++ 

//Token First
const gErc20Delegate = artifacts.require("GErc20Delegate");
const gErc20Delegator = artifacts.require("GErc20Delegator");

const interestRateModel = artifacts.require("JumpRateModelV2");


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

  // Rate Model parameter
  let baseRatePerYear = "0";
  let multiplierPerYear = "40000000000000000";
  let jumpMultiplierPerYear = "1090000000000000000";
  let kink_ = "800000000000000000";
  let owner_ = accounts[0];
  await deployer.deploy(interestRateModel, baseRatePerYear, multiplierPerYear, jumpMultiplierPerYear, kink_, owner_);

  await deployer.deploy(gErc20Delegate);

  // cUSDT custruct parameter
  let underlying_ = "0x1E122Cc141f9Cd659A9BB6931fafECCA98E12C5a";
  let comptroller_ = "0xbB78719C0d175B9c523650d1d2C1A9D5a4cf1668";
  let interestRateModel_ = interestRateModel.address;
  let initialExchangeRateMantissa_ = "200000000000000";
  let name_ = "Golff USDT";
  let symbol_ = "gUSDT";
  let decimals_ = 8;
  let admin_ = accounts[0];
  let implementation_ = gErc20Delegate.address;
  let becomeImplementationData = "0x0";

  await deployer.deploy(gErc20Delegator, underlying_, comptroller_, interestRateModel_, initialExchangeRateMantissa_, name_, symbol_, decimals_, admin_, implementation_, becomeImplementationData);

  // // set reserveFactor 75000000000000000 储备系数
  let reserveFactorMantissa = "75000000000000000";
  let contract_gtoken = new web3.eth.Contract(gErc20Delegator.abi, gErc20Delegator.address);

  await Promise.all([
    contract_gtoken.methods._setReserveFactor(reserveFactorMantissa).send({ from: fromAccount, gasPrice: gas_price, gas: 100000}, function(err, txId) {
      if (err != null) {
        console.log("GEther _setReserveFactor error: " + err);
      }
      console.log("GEther _setReserveFactor txid: "+txId);
    }),

  ]);
}