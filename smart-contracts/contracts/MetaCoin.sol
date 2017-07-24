pragma solidity ^0.4.11;

import "./ConvertLib.sol";

// Empty contract used for testing Angular/Solidity integration

contract MetaCoin {
	mapping (address => uint) balances;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	function MetaCoin() {
		balances[tx.origin] = 10000;
	}

	function getBalance() returns(uint) {
		return 10000;
	}
}