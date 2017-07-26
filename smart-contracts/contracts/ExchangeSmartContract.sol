pragma solidity ^0.4.11;

import "./PlantSmartContract.sol";

contract ExchangeSmartContract is Ownable {

  address[] plants;
  mapping (address => address) plantContracts;

  /**
    source 0 - sun, 1 - water, 2 - wind
  */
  function createPlantContract(address _plant, uint256 _price, uint8 _source) {
    if (plantContracts[_plant] == 0) {
      plantContracts[_plant] = new PlantSmartContract(_plant, _price, _source);
      plants.push(_plant);
    }
  }

  function getPlantContract(address _plant) constant returns(address) {
    return plantContracts[_plant];
  }

  function addTokens(address _plant, string _name, uint256 _amount, uint _date) {
    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);
    plantContract.mint(_name, _amount, _date);
  }

  function getBestPrice(uint256 _amount, uint _date, uint8 _source) constant returns (address) {
    address bestAddress;
    uint256 bestPrice = 1000000000 ether;
    for (uint i = 0; i < plants.length; i++) {
      PlantSmartContract plantContract = PlantSmartContract(plantContracts[plants[i]]);

      //TODO: check if amount for date is enough
      if (plantContract.source() == _source && plantContract.price() < bestPrice) {
        bestAddress = plants[i];
        bestPrice = plantContract.price();
      }
    }

    return bestAddress;
  }

  function getBalance(address _consumer, uint _date) constant returns(uint256){
    uint256 balance = 0;
    for (uint i = 0; i < plants.length; i++) {
      PlantSmartContract plantContract = PlantSmartContract(plantContracts[plants[i]]);
      balance = balance + plantContract.balanceOf(_consumer, _date);
    }
    return balance;
  }

  function getAvailableAmount(address _plant, uint _date) returns (uint256) {
    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);
    return plantContract.balanceOf(_plant, _date);
  }

  function getTotalPrice(address _plant, uint256 _amount) returns (uint256) {
    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);
    return _amount * plantContract.price();
  }

  function setPrice(address _plant, uint256 _price) {
    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);
    plantContract.setPrice(_price);
  }

  function getPrice(address _plant) constant returns (uint256) {
    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);
    return plantContract.price();
  }

  function send(address _plant, uint _date, uint256 _amount) returns (uint256) {
    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);

    if (plantContract.balanceOf(_plant, _date) < _amount) {
      throw;
    }
    plantContract.transfer(_plant, msg.sender, _amount, _date);
  }

  function buy(address _plant, uint _date, uint256 _amount) payable returns (uint256) {
    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);

    if (plantContract.balanceOf(_plant, _date) < _amount) {
      throw;
    }

    uint256 price = _amount * plantContract.price();
    if (price > msg.value) {
      throw;
    }

    _plant.transfer(price);
    plantContract.transfer(_plant, msg.sender, _amount, _date);

    /*uint256 left = price - msg.value;
    if (left > 0) {
      msg.sender.transfer(left);
    }*/

  }

}
