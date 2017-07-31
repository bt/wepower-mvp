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

  modifier onlyOwner() {
    if (msg.sender != owner) {
      throw;
    }
    _;
  }

  function PlantSmartContract(address _plant, uint256 _price, Source _source) {
    owner = msg.sender;

    plant = _plant;
    price = _price;
    source = _source;
  }

  function setPrice(uint256 _price) {
    price = _price;
  }

  function mint(uint256 _amount, uint _date) {
    tokens[plant][_date] = Wepwr(_date, _amount, plant);
    Transfer(this, plant, _amount);
  }

  function balanceOf(address _address, uint _date) returns(uint256) {
    if (_date < now) {
      throw;
    }

    Wepwr token = tokens[_address][_date];
    return token.amount;
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
    tokens[_to][_date] = Wepwr(token.date, _amount, token.plant);

    Transfer(_from, _to, _amount);
  }
}
