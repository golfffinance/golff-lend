//++ read config from .env file
const dotenv = require('dotenv');
const result = dotenv.config()
if (result.error) {
  throw result.error
}
console.log(result.parsed)

//++ define Wallet Provider
const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  compilers: {
    solc: {
      version: "0.5.16",
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        // evmVersion: "byzantium"
      }
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    private: {
      provider: new HDWalletProvider(process.env.TEST_NET_PRIVATE_MNEMONIC, process.env.TEST_NET_PRIVATE_API),
      network_id: 101,
      gas: 8000000,
      gasPrice: 4000000000
    },
    ropsten: {
      provider: new HDWalletProvider(process.env.TEST_NET_ROPSTEN_MNEMONIC, process.env.TEST_NET_ROPSTEN_API),
      network_id: 3,
      gas: 3001238,
      gasPrice: 4000000000,
      networkCheckTimeout: 60000,
      from: process.env.DEPLOYER_ACCOUNT
    },
    rinkeby: {
      provider: new HDWalletProvider(process.env.TEST_NET_RINKEBY_MNEMONIC, process.env.TEST_NET_RINKEBY_API),
      network_id: 4,
      gas: 6600000,
      gasPrice: 1000000000,
      networkCheckTimeout: 60000,
      from: process.env.DEPLOYER_ACCOUNT
    },
    main: {
      provider: new HDWalletProvider(process.env.MAIN_NET_MNEMONIC, process.env.MAIN_NET_API),
      network_id: 1,
      gas: 3012388,
      gasPrice: 1000000000,
      networkCheckTimeout: 60000,
      from: process.env.DEPLOYER_ACCOUNT
    }
  }
};
