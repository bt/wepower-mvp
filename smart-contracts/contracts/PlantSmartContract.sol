pragma solidity ^0.4.11;

import "./libs/StandardToken.sol";
import "./libs/Ownable.sol";


contract PlantSmartContract is StandardToken, Ownable {

  string public name;
  string public symbol = "KWH";
  uint256 public amountInKWH;

  uint validTill;
  uint256 public price;
  address public plant;

  function PlantSmartContract(
      address _plant,
      uint256 _initAmount,
      uint256 _price,
      string _name,
      uint256 _amountInKWH,
      uint _validTill) {

    plant = _plant;
    price = _price;
    name = _name;
    amountInKWH = _amountInKWH;
    validTill = _validTill;

    totalSupply = _initAmount;
    balances[plant] = _initAmount;
    Transfer(this, plant, _initAmount);

  }

  function buy(address _from, address _to, uint256 _amount) onlyOwner {

    if (now > validTill) {
      throw;
    }

    if (balances[_from] < _amount) {
      throw;
    }

    balances[_to] = balances[_to].add(_amount);
    balances[_from] = balances[_from].sub(_amount);
    Transfer(_from, _to, _amount);
  }

  function getAvailableAmount() returns(uint256) {
    if (now > validTill) {
      return 0;
    }

    return balanceOf(plant);
  }
}
