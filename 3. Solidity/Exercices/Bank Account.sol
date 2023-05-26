// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BankAccount is Ownable {

    uint depositId;
    mapping (uint => uint) deposits;
    uint time;

    function deposit() public payable onlyOwner {
        balance += msg.value;
        deposits[depositId] = msg.value;
        depositId += 1;
    }

    function withdraw(uint _amount) public payable onlyOwner {
        require (_amount >= balance, "Insufficient Founds");
        require ();
        (bool sent,) = msg.sender.call{value: _amount}("Success");
        require(sent, "Failed");
    }
}