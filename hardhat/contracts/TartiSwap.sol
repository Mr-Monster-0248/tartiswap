// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ITartiSwap.sol";
import "./ITartiAMM.sol";

contract TartiSwap is ITartiSwap {
    ITartiAMM[] private amms;

    constructor() {}

    function addPairListing() external override returns (uint256) {
        ITartiAMM pair = ITartiAMM(msg.sender);

        amms.push(pair);

        return amms.length - 1;
    }

    function getNumberOfPairs() external view returns (uint256) {
        return amms.length;
    }

    function getPairDetailsAtIndex(uint256 index)
        external
        view
        returns (
            address,
            string memory,
            string memory,
            address,
            address,
            uint256,
            uint256
        )
    {
        require(index >= 0 && index < amms.length);

        ITartiAMM amm = amms[index];

        return (
            address(amm),
            amm.getToken1Symbol(),
            amm.getToken2Symbol(),
            amm.getToken1Address(),
            amm.getToken2Address(),
            amm.getToken1Liquidity(),
            amm.getToken2Liquidity()
        );
    }
}
