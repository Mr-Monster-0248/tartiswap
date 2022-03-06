// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Biscotte is ERC20, Ownable {
    bool private _isFaucetEnabled;

    constructor(bool enableFaucet) ERC20("Biscotte", "BSCT") {
        _isFaucetEnabled = enableFaucet;
    }

    // Access control modifers
    modifier isFaucetEnabled() {
        require(_isFaucetEnabled);
        _;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function faucet(uint256 amount) public isFaucetEnabled {
        _mint(msg.sender, amount);
    }
}
