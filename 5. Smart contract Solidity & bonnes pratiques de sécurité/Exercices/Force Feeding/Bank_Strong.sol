// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;
 
 /// @dev On modifie le require avec égalité stricte en mettant >= pour ne pas de retrouver bloquer par un envoie forcé d'ETH
contract Bank_Weak {
 
    address owner;
 
    // Set msg.sender as owner
    constructor() {
        owner = msg.sender;
    }
 
    // Deposit 1 ETH in the smart contract
    function deposit() public payable {
        require(msg.sender == owner);
				require(msg.value == 1 ether);
				require(address(this).balance <= 10 ether);
    }
 
    // Withdraw the entire smart contract balance
    function withdrawAll() public {
        require(msg.sender == owner);
				require(address(this).balance >= 10 ether);
        payable(owner).send(address(this).balance);
    }
}