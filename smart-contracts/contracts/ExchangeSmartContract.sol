pragma solidity ^0.4.11;

import "./PlantSmartContract.sol";

contract ExchangeSmartContract  {

  event CreatePlant(address _plant);
  event Transfer(address indexed from, address indexed to, uint256 value);

  address[] plants;
  mapping (address => address) plantContracts;

  function createPlantContract(address _plant, uint256 _price, uint _source, uint256[] _amounts, uint[] _dates) {
    if (_amounts.length != _dates.length) {
      throw;
    }
    CreatePlant(_plant);
    if (plantContracts[_plant] == 0) {
      PlantSmartContract plantContract =
        new PlantSmartContract(_plant, _price, PlantSmartContract.Source(_source), _amounts, _dates);
      plantContracts[_plant] = plantContract;
      plants.push(_plant);
    }
  }

  function getLowestPrice(uint256 _amount, uint _date, uint8 _source) constant returns (address) {
    PlantSmartContract.Source source = PlantSmartContract.Source(_source);
    address bestAddress;
    uint256 bestPrice = 0;

    for (uint i = 0; i < plants.length; i++) {
      address plant = plants[i];
      PlantSmartContract plantContract = PlantSmartContract(plantContracts[plant]);

      if (plantContract.balanceOf(plant, _date) >= _amount &&
      plantContract.source() == source &&
      (plantContract.price() < bestPrice || bestPrice == 0)) {

        bestAddress = plant;
        bestPrice = plantContract.price();
      }
    }

    return bestAddress;
  }

  function getBalance(address _consumer, uint _date) constant returns(uint256){
    uint256 balance = 0;
    for (uint i = 0; i < plants.length; i++) {
      address plant = plants[i];
      address contractAddress = plantContracts[plant];
      PlantSmartContract plantContract = PlantSmartContract(contractAddress);
      balance = balance + plantContract.balanceOf(_consumer, _date);
    }
    return balance;
  }

  function getSourceOf(address _consumer, uint _date) constant returns(PlantSmartContract.Source){
    PlantSmartContract.Source source;
    for (uint i = 0; i < plants.length; i++) {
      address plant = plants[i];
      address contractAddress = plantContracts[plant];
      PlantSmartContract plantContract = PlantSmartContract(contractAddress);
      if (plantContract.balanceOf(_consumer, _date) > 0) {
        source = plantContract.source();
      }
    }
    return source;
  }

  function getAvailableAmount(address _plant, uint _date) returns (uint256) {
    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);
    return plantContract.balanceOf(_plant, _date);
  }

  function getTotalAmount(address _plant, uint _date) returns (uint256) {
    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);
    return plantContract.totalOf(_date);
  }

  function setPrice(address _plant, uint256 _price) {
    if (plantContracts[_plant] == 0) {
      throw;
    }

    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);
    plantContract.setPrice(_price);
  }

  function getPrice(address _plant) constant returns (uint256) {
    if (plantContracts[_plant] == 0) {
      throw;
    }

    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);
    return plantContract.price();
  }

  function send(address _plant, address _to, uint _date, uint256 _amount) returns (uint256) {
    Transfer(msg.sender, _to, _amount);
    if (plantContracts[_plant] == 0) {
      throw;
    }

    PlantSmartContract plantContract = PlantSmartContract(plantContracts[_plant]);

    if (plantContract.balanceOf(_plant, _date) < _amount) {
      throw;
    }

    plantContract.transfer(msg.sender, _to, _amount, _date);
  }

  function buy(address _plant, uint _date, uint256 _amount) payable returns (uint256) {
    Transfer(_plant, msg.sender, _amount);
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
