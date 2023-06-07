// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

/*
ATTENTION : Cette solution n'est pas sécurisée et comporte des failles permettant de deviner le numéro random
Une bonne façon de faire est de passer par un oracle
*/

contract Random {
    uint nonce;

    function random() external returns(uint) {
        nonce ++;
        return uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 100;
    }
}