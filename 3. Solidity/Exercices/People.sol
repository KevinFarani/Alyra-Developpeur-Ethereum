// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract People {

    struct Person {
        string name;
        uint age;
    }
    Person public moi;

    function modifyPerson(string memory _name, uint _age) public {
        moi = Person(_name, _age);
    }
} 