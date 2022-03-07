// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ITartiAMM {
    function getToken1Symbol() external view returns (string memory);

    function getToken2Symbol() external view returns (string memory);

    function getToken1Address() external view returns (address);

    function getToken2Address() external view returns (address);

    /// Get the liquidity of first token in the pool
    function getToken1Liquidity() external view returns (uint256);

    /// Get the liquidity of second token in the pool
    function getToken2Liquidity() external view returns (uint256);

    /// Get expected token 2 amount from token 1 trade
    function simulateToken1Trade(uint256 amount)
        external
        view
        returns (uint256);

    /// Get expected token 1 amount from token 1 trade
    function simulateToken2Trade(uint256 amount)
        external
        view
        returns (uint256);

    /// Trade token 1 for token 2
    function tradeToken1ForToken2(uint256 amount) external returns (uint256);

    /// Trade token 2 for token 1
    function tradeToken2ForToken1(uint256 amount) external returns (uint256);
}
