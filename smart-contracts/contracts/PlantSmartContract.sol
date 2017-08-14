pragma solidity ^0.4.11;

contract PlantSmartContract {

  event Transfer(address indexed from, address indexed to, uint256 value);

  enum Source { SUN, WIND, WATER }

  struct Wepwr {
    uint date;
    uint256 amount;
    address plant;
  }

  address public owner;

  uint256 public price;
  address public plant;
  Source public source;

  mapping (address => mapping(uint => Wepwr)) tokens;
  mapping (uint => uint) totalAmount;

  modifier onlyOwner() {
    if (msg.sender != owner) {
      throw;
    }
    _;
  }

  function PlantSmartContract(address _plant, uint256 _price, Source _source, uint256[] _amounts, uint[] _dates) {
    owner = msg.sender;

    plant = _plant;
    price = _price;
    source = _source;

    for (uint256 i = 0; i < _amounts.length; i++) {
      uint256 amount = _amounts[i];
      uint date = _dates[i];
      tokens[plant][date] = Wepwr(date, amount, _plant);
      totalAmount[date] = amount;
    }
  }

  function setPrice(uint256 _price) {
    price = _price;
  }

  function balanceOf(address _address, uint _date) returns(uint256) {
    Wepwr token = tokens[_address][_date];
    return token.amount;
  }

  function totalOf(uint _date) returns(uint256) {
    return totalAmount[_date];
  }

  function transfer(address _from, address _to, uint256 _amount, uint _date) onlyOwner {
    if (_date < now) {
      throw;
    }

    Wepwr token = tokens[_from][_date];
    if (token.amount < _amount) {
      throw;
    }

    token.amount = token.amount - _amount;

    tokens[_from][_date] = token;
    tokens[_to][_date] = Wepwr(token.date, _amount, token.plant);

    Transfer(_from, _to, _amount);
  }
}
