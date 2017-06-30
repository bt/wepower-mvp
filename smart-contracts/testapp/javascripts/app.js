// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import exchange_artifacts from '../../build/contracts/ExchangeSmartContract.json'
import token_artifacts from '../../build/contracts/PlantSmartContract.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var ExchangeContract = contract(exchange_artifacts);
var PlantSmartContract = contract(token_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    ExchangeContract.setProvider(web3.currentProvider);
    PlantSmartContract.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      web3.eth.defaultAccount = account;
      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;
    var account_element = document.getElementById("account");
    account_element.innerHTML = account;
    web3.eth.getBalance(web3.eth.coinbase, function(error, result) {
      if(!error) {
        var eth_balance_element = document.getElementById("ethBalance");
        eth_balance_element.innerHTML = web3.fromWei(result.valueOf());
      } else {
        console.error(error);
      }
    });

    ExchangeContract.deployed().then(function(instance) {
      return instance.getTokens.call();
    }).then(function (result) {
        console.log(result);
        for (var i = 0; i < result.length; i++) {
          var token = result[i];
          console.log(token);
          PlantSmartContract.at(token).balanceOf(web3.eth.coinbase)
          .then(function(balance) {
            if (balance.valueOf() > 0) {
              var token_balance_element = document.getElementById("tokenBalance");
              token_balance_element.innerHTML = token_balance_element.innerHTML + "<br><span>"+token+"</span> - <span>"+balance.valueOf()+"</span>";
            }
          }).catch(function(e) {
            console.log(e);
            self.status("Error getting token balance");
          });

        }
    }).catch(function(e) {
        console.log(e);
        self.status("Error getting token balance");
    });
  },

  createTokens: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var address = document.getElementById("sendAddress").value;

    ExchangeContract.deployed().then(function(instance) {
      return instance.addTokens.sendTransaction(address,"TEST", web3.toWei(2), amount, {from: web3.eth.coinbase});
    }).then(function(result) {
      console.log(result);
      self.setStatus("Transaction complete new token added " + result);
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error generating Tokens; see log.");
    });
  },

  buy: function() {
    var self = this;

    var address = document.getElementById("buyFrom").value;
    var amount = parseInt(document.getElementById("buyAmount").value);

    ExchangeContract.deployed().then(function(instance) {
      return instance.buyTokens.sendTransaction(address, amount, {from: web3.eth.coinbase, value: web3.toWei(amount*2)});
    }).then(function(e) {
      console.log(e);
      self.setStatus("Bought " + amount + " of elektra");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error while buying");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
