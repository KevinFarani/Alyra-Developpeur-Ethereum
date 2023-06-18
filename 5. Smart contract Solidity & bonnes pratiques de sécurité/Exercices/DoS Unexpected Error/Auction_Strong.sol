// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";

/** @dev Afin d'éviter l'attaque, on implémente une nouvelle fonction de remboursement qui devra être déclenchée par les enchérisseurs directement
*/
contract Auction_Strong is ReentrancyGuard {
    address highestBidder;
    uint highestBid;
    mapping (address => uint) previousBidders;
 
    function bid() payable public {
        require(msg.value >= highestBid);
 
        if (highestBidder != address(0)) {
            previousBidders[highestBidder] += highestBid;
        }
 
       highestBidder = msg.sender;
       highestBid = msg.value;
    }

    function reimburse() public nonReentrant() {
        require(msg.sender != highestBidder, "You're the highest bidder");
        require(previousBidders[msg.sender] > 0, "No funds to reimburse");
        (bool success, ) = msg.sender.call{value:previousBidders[msg.sender]}("");
        require(success, "Transaction failed");
        previousBidders[msg.sender] = 0;
    }
}