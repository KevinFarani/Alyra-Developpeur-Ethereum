// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Administration is Ownable {
    mapping (address => bool) Whitelist;
    mapping (address => bool) Blacklist;

    event Whitelisted(address _address); 
    event Blacklisted(address voterAddress); 

    function whitelist(address _address) external onlyOwner {
        require (Whitelist[_address] == false , "Already whitelisted");
        Whitelist[_address] = true;
        Blacklist[_address] = false;
        emit Whitelisted(_address);
    }

    function blacklist(address _address) external onlyOwner {
        require (Blacklist[_address] == false , "Already blacklisted");
        Blacklist[_address] = true;
        Whitelist[_address] = false;
        emit Blacklisted(_address);
    }

    function isWhitelisted(address _address) external view returns(bool) {
        return Whitelist[_address];
    }

    function isBlacklisted(address _address) external view returns(bool) {
        return Blacklist[_address];
    }
}