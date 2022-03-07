// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ITartiAMM.sol";
import "./ITartiSwap.sol";

/// Constant Product Automated Market Maker Liquidity Pool for TartiSwap DEX
contract TartiAMM is ITartiAMM, Ownable {
    /// Whether the pair has already been initialized
    bool private hasBeenInitialized = false;

    // Tokens forming the pair
    IERC20Metadata private token1;
    IERC20Metadata private token2;
    address private token1Address;
    address private token2Address;

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

        token1 = IERC20Metadata(_token1Address);
        token2 = IERC20Metadata(_token2Address);
        token1Address = _token1Address;
        token2Address = _token2Address;

        token1Liquidity = _initialToken1Liquidity;
        token2Liquidity = _initialToken2Liquidity;
        kFactor = _initialToken1Liquidity * _initialToken2Liquidity;
    }

    modifier wasInitialized() {
        require(hasBeenInitialized);
        _;
    }

    function initializePair(address dexAddress) public onlyOwner {
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

        // Register AMM to DEX
        ITartiSwap(dexAddress).addPairListing();

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

    function getExpectedReturnFromToken1Trade(uint256 amount)
        private
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
        private
        view
        wasInitialized
        returns (uint256)
    {
        require(amount > 0);

        uint256 newToken2Liquidity = token2Liquidity + amount;
        uint256 token1LiquidityToObtain = kFactor / newToken2Liquidity;
        return token1Liquidity - token1LiquidityToObtain;
    }

    function getToken1Symbol() external view override returns (string memory) {
        return token1.symbol();
    }

    function getToken2Symbol() external view override returns (string memory) {
        return token2.symbol();
    }

    function getToken1Address() external view override returns (address) {
        return token1Address;
    }

    function getToken2Address() external view override returns (address) {
        return token2Address;
    }

    function getToken1Liquidity()
        external
        view
        override
        wasInitialized
        returns (uint256)
    {
        return token1Liquidity;
    }

    function getToken2Liquidity()
        external
        view
        override
        wasInitialized
        returns (uint256)
    {
        return token2Liquidity;
    }

    function simulateToken1Trade(uint256 amount)
        external
        view
        override
        wasInitialized
        returns (uint256)
    {
        return getExpectedReturnFromToken1Trade(amount);
    }

    function simulateToken2Trade(uint256 amount)
        external
        view
        override
        wasInitialized
        returns (uint256)
    {
        return getExpectedReturnFromToken2Trade(amount);
    }

    function tradeToken1ForToken2(uint256 amount)
        external
        override
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
        external
        override
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
