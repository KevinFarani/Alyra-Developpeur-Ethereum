// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GuessWinGame is Ownable {

    string private word;
    string public indice;
    mapping (address => bool) players;
    address public winner;

    constructor() {
        owner = msg.sender;
    }

    function changeWord(string memory _word, string memory _indice) public onlyOwner {
        word = _word;
        indice = _indice;
    }

    function guessWord(string memory _word) public returns(bool) {
        players[msg.sender] = true;

        if(_word == word) {
            winner = msg.sender;
            return true;
        } else {
            return false;
        }
    }

    function checkPlayer(address _player) public view returns(bool){
        if(players[msg.sender] == true) {
            return true;
        } else {
            return false;
        }
    }
} 