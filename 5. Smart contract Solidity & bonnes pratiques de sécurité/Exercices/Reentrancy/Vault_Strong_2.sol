// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";
 
  /** @dev Afin d'éviter l'attaque, on utilise le contrat ReentrancyGuard d'OpenZeppelin qui met en place des gardes fous empêcher l'appel récursif de la fonction redeem
*/
contract Vault_Strong_2 is ReentrancyGuard {
    mapping(address => uint) public balances;
 
    function store() public payable {
        balances[msg.sender]+=msg.value;
    }
    
    function redeem() public nonReentrant() {
        msg.sender.call{ value: balances[msg.sender] }("");
        balances[msg.sender]=0;
    }
}