// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract Parent {

   uint internal number;

    function setParentValue(uint _number) external {
        number = _number;
    }
}

contract Enfant is Parent {

    function getParentValue() public view returns (uint) {
        return number;
        // Parent.number works also
    }
}

contract Caller {
    Enfant enfant = new Enfant();

    function testHeritage(uint _number) public returns (uint) {
        enfant.setParentValue(_number);
        return enfant.getParentValue();
    }

}