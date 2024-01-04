//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IMintConfig
interface IMintConfig {
    event MintConfigurationChanged();

    struct MintPhase {
        uint32 startTime;
        uint32 endTime;
        uint32 maxPerWallet;
        uint128 maxSupply;
        address currency;
        uint96 price;
    }

    function contractURI() external view returns (string memory);

    function getMintPhases() external view returns (MintPhase[] memory);
}
