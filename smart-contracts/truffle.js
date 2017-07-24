module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    demo : {
      host: "192.168.50.157",
      port: 8545,
      network_id: "8888"
    }
  }
};
