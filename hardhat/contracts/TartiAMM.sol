// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// Constant Product Automated Market Maker Liquidity Pool for TartiSwap DEX
contract TartiAMM is Ownable {
    /// Whether the pair has already been initialized
    bool private hasBeenInitialized = false;

    // Tokens forming the pair
    IERC20 private token1;
    IERC20 private token2;

    /// Constant Product Factor
    uint256 private kFactor;

    /// Token 1 Liquidity in the pool
    uint256 private token1Liquidity;

    /// Token 2 Liquidity in the pool
    uint256 private token2Liquidity;

    constructor(
        address _token1Address,
        address _token2Address,
        uint256 _initialToken1Liquidity,
        uint256 _initialToken2Liquidity
    ) {
        require(_initialToken1Liquidity > 0);
        require(_initialToken2Liquidity > 0);

        token1 = IERC20(_token1Address);
        token2 = IERC20(_token2Address);

        token1Liquidity = _initialToken1Liquidity;
        token2Liquidity = _initialToken2Liquidity;
        kFactor = _initialToken1Liquidity * _initialToken2Liquidity;
    }

    modifier wasInitialized() {
        require(hasBeenInitialized);
        _;
    }

    function initializePair() public onlyOwner {
        require(!hasBeenInitialized);

        require(
            token1.allowance(msg.sender, address(this)) >= token1Liquidity,
            "Token1 allowance not high enough (let's go to the moon)"
        );
        require(
            token2.allowance(msg.sender, address(this)) >= token2Liquidity,
            "Token2 allowance not high enough (let's go to the moon)"
        );

        require(
            token1.transferFrom(msg.sender, address(this), token1Liquidity)
        );
        require(
            token2.transferFrom(msg.sender, address(this), token2Liquidity)
        );

        hasBeenInitialized = true;
    }

    function receiveToken1Amount(uint256 amount) private returns (bool) {
        require(token1.allowance(msg.sender, address(this)) >= amount);
        require(token1.transferFrom(msg.sender, address(this), amount));

        token1Liquidity += amount;
        return true;
    }

    function receiveToken2Amount(uint256 amount) private returns (bool) {
        require(token2.allowance(msg.sender, address(this)) >= amount);
        require(token2.transferFrom(msg.sender, address(this), amount));

        token2Liquidity += amount;
        return true;
    }

    function sendToken1Amount(uint256 amount) private returns (bool) {
        require(token1.transfer(msg.sender, amount));

        token1Liquidity -= amount;
        return true;
    }

    function sendToken2Amount(uint256 amount) private returns (bool) {
        require(token2.transfer(msg.sender, amount));

        token2Liquidity -= amount;
        return true;
    }

    // TODO : PUT THESE FUNCTIONS IN AN INTERFACE

    function getToken1Liquidity() public view wasInitialized returns (uint256) {
        return token1Liquidity;
    }

    function getToken2Liquidity() public view wasInitialized returns (uint256) {
        return token2Liquidity;
    }

    function getExpectedReturnFromToken1Trade(uint256 amount)
        public
        view
        wasInitialized
        returns (uint256)
    {
        require(amount > 0);

        uint256 newToken1Liquidity = token1Liquidity + amount;
        uint256 token2LiquidityToObtain = kFactor / newToken1Liquidity;

        return token2Liquidity - token2LiquidityToObtain;
    }

    function getExpectedReturnFromToken2Trade(uint256 amount)
        public
        view
        wasInitialized
        returns (uint256)
    {
        require(amount > 0);

        uint256 newToken2Liquidity = token2Liquidity + amount;
        uint256 token1LiquidityToObtain = kFactor / newToken2Liquidity;
        return token1Liquidity - token1LiquidityToObtain;
    }

    function tradeToken1ForToken2(uint256 amount)
        public
        wasInitialized
        returns (uint256)
    {
        require(amount > 0);

        uint256 token2ToSend = getExpectedReturnFromToken1Trade(amount);

        require(receiveToken1Amount(amount));
        require(sendToken2Amount(token2ToSend));

        return token2ToSend;
    }

    function tradeToken2ForToken1(uint256 amount)
        public
        wasInitialized
        returns (uint256)
    {
        require(amount > 0);

        uint256 token1ToSend = getExpectedReturnFromToken2Trade(amount);

        require(receiveToken2Amount(amount));
        require(sendToken1Amount(token1ToSend));

        return token1ToSend;
    }
}
