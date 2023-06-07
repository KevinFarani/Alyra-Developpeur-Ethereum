// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Notation is Ownable {
    // ------------------------------------------------------------- Init

    struct Etudiant {
        string nom;
        uint note;
    }

    enum Classe {
        sixieme,
        cinquieme,
        quatrieme
    }

    Classe public classe;

    mapping (address => Etudiant) public etudiants_mapping;
    Etudiant[] public etudiants_array;

    // ------------------------------------------------------------- Getter Functions

    function getEtudiantFromMapping(address _address) public view returns(Etudiant memory) {
        return etudiants_mapping[_address];
    }

    function getEtudiantFromArray(string calldata _nom) public view returns(Etudiant memory) {
        for (uint i = 0 ; i < etudiants_array.length ; i++) {
            if (keccak256(abi.encodePacked(_nom)) ==  keccak256(abi.encodePacked(etudiants_array[i].nom))) {
                return etudiants_array[i];
            }
        }
    }

    // ------------------------------------------------------------- Main Functions

    function setEtudiant(address _address, string memory _nom, uint _note) external onlyOwner() {
        etudiants_mapping[_address] = Etudiant(_nom, _note);
        etudiants_array.push(Etudiant(_nom, _note));
    }

    function deleteEtudiant(address _address) external onlyOwner() {
        for (uint i = 0 ; i < etudiants_array.length ; i++) {
            if (keccak256(abi.encodePacked(etudiants_array[i].nom)) ==  keccak256(abi.encodePacked(etudiants_mapping[_address].nom))) {
                delete etudiants_array[i];
            }
        }
        delete etudiants_mapping[_address];
    }

    function setClasse(Classe _classe) external onlyOwner() {
        classe = Classe(_classe);
    }
}