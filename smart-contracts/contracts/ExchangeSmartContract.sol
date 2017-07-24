pragma solidity ^0.4.11;

import "./PlantSmartContract.sol";

contract ExchangeSmartContract is Ownable {

  address[] public tokens;

  function addTokens(address _plant, string _name, uint256 _price, uint256 _initAmount, uint _validTill) returns(address[]) {
    address token = new PlantSmartContract(_plant, _initAmount, _price, _name, 1, _validTill);
    tokens.push(token);
    return tokens;
  }

  function getAvailableAmount(address _tokenAddress) returns (uint256) {
    PlantSmartContract token = PlantSmartContract(_tokenAddress);
    return token.getAvailableAmount();
  }

  function getPrice(address _tokenAddress, uint256 _amount) returns (uint256) {
    PlantSmartContract token = PlantSmartContract(_tokenAddress);

    if (token.getAvailableAmount() < _amount) {
      throw;
    }

    return _amount * token.price();
  }

  function buyTokens(address _tokenAddress, uint256 _amount) payable returns (uint256) {
    PlantSmartContract token = PlantSmartContract(_tokenAddress);

    if (token.getAvailableAmount() < _amount) {
      throw;
    }

    uint256 price = _amount * token.price();
    if (price > msg.value) {
      throw;
    }

    address plant = token.plant();

    plant.transfer(price);

    token.buy(plant, msg.sender, _amount);

    /*uint256 left = price - msg.value;
    if (left > 0) {
      msg.sender.transfer(left);
    }*/

  }

}
