pragma solidity ^0.4.0;

import "./libs/StandardToken.sol";
import "./libs/Ownable.sol";


contract PlantSmartContract is StandardToken, Ownable {



  string public name;
  string public symbol = "KWH";
  uint256 public amountInKWH;

  uint256 public price;
  address public plant;

  function PlantSmartContract(
      address _plant,
      uint256 _initAmount,
      uint256 _price,
      string _name,
      uint256 _amountInKWH) {

    plant = _plant;
    price = _price;
    name = _name;
    amountInKWH = _amountInKWH;

    totalSupply = _initAmount;
    balances[plant] = _initAmount;
    Transfer(this, plant, _initAmount);

  }

  function buy(address _from, address _to, uint256 _amount) onlyOwner {
    if (balances[_from] < _amount) {
      throw;
    }

    balances[_to] = balances[_to].add(_amount);
    balances[_from] = balances[_from].sub(_amount);
    Transfer(_from, _to, _amount);
  }

  function getPrice() returns (uint256) {
    return price;
  }

  function getPlant() returns (address) {
    return plant;
  }

  function getAvailableAmount() returns(uint256) {
    return balanceOf(plant);
  }
}
