// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

contract GoodFallbackReceive {

    mapping (address => uint) balances;
    event DepositCorrect(address _address, uint _amount);
    event DepositIncorrect(address _address, uint _amount);

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    receive() external payable {
        emit DepositCorrect(msg.sender, msg.value);
    }

    fallback() external payable {
        emit DepositIncorrect(msg.sender, msg.value);
    }
} 