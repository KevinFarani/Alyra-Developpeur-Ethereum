// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ButeToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("ButeToken", "BTN")  {
        _mint(msg.sender, initialSupply);
    }

    function freeMint() public {
        _mint(msg.sender, 10);
    }
}