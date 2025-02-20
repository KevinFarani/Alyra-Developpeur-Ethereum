module.exports = {
  plugins: ["solidity-coverage"],
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
  },

  mocha: {
  },

  compilers: {
    solc: {
      version: "0.8.20",      // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        }
      }
    }
  }
};
