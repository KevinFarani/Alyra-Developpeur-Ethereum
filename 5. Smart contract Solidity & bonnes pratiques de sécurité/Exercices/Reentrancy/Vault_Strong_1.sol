// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;
 
 /** @dev Afin d'éviter l'attaque, on modifie avant l'appel de la fonction call la balance des addresses appelant la fonction redeem
*/
contract Vault_Strong_1 {
    mapping(address => uint) public balances;
 
    function store() public payable {
        balances[msg.sender]+=msg.value;
    }
    
    function redeem() public {
        uint tmp_balance = balances[msg.sender];
        balances[msg.sender]=0;
        msg.sender.call{ value: tmp_balance }("");
    }
}