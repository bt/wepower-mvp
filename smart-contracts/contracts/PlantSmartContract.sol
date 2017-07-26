pragma solidity ^0.4.11;

import "./libs/Ownable.sol";

contract PlantSmartContract is Ownable {

  event Transfer(address indexed from, address indexed to, uint256 value);

  struct Wepwr {
    string name;
    uint date;
    uint256 amount;
    address plant;
  }

  uint constant SECONDS_IN_DAY = 86400;

  uint256 public price;
  address public plant;
  uint8 public source;

  mapping (address => Wepwr[]) tokens;

  function PlantSmartContract(address _plant, uint256 _price, uint8 _source) {
    plant = _plant;
    price = _price;
    source = _source;
  }

  function setPrice(uint256 _price) {
    price = _price;
  }

  //TODO: if there are token for a day then we will get duplicates. Should merge those two.
  function mint(string name, uint256 _amount, uint _date) {
    tokens[plant].push(Wepwr(name, _date / SECONDS_IN_DAY, _amount, plant));
    Transfer(this, plant, _amount);
  }

  function balanceOf(address _address, uint _date) returns(uint256) {
    uint256 balance = 0;

    for (uint i = 0; i < tokens[_address].length; i++) {
      Wepwr token = tokens[_address][i];
      if (token.date == _date / SECONDS_IN_DAY && token.date >= now) {
        balance = balance + token.amount;
      }
    }

    return balance;
  }

  function transfer(address _from, address _to, uint256 _amount, uint _date) onlyOwner {

    for (uint i = 0; i < tokens[_from].length; i++) {
      Wepwr token = tokens[_from][i];
      if (token.date == _date / SECONDS_IN_DAY && token.date >= now) {
        if (token.amount < _amount) {
          throw;
        }

        token.amount = token.amount - _amount;
        tokens[_to].push(Wepwr(token.name, token.date, _amount, token.plant));

        Transfer(_from, _to, _amount);
      }
    }


  }

}
