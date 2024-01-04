//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IMintConfig} from "./IMintConfig.sol";

/// @title NFTMock
contract NFTMock is ERC721, IMintConfig {
    struct MintPhase {
        uint32 startTime;
        uint32 endTime;
        uint32 maxPerWallet;
        uint128 maxSupply;
        address currency;
        uint96 price;
    }

    uint256 private _mintPhasesCount;

    mapping(uint256 => MintPhase) private _mintPhases;

    function contractURI() external view override returns (string memory) {
        return "ipfs://Qmx....";
    }

    function getMintPhases() external view returns (MintPhase[] memory) {
        MintPhase[] memory mintPhases = MintPhase[](_mintPhasesCount);
        for (uint i; i < _mintPhasesCount; i++) {
            mintPhases[i] = _mintPhases[i];
        }

        return mintPhases;
    }

    function setMintPhases(MintPhase[] calldata mintPhases) external onlyOwner {
        uint256 length = mintPhases.length;
        for (uint i; i < mintPhases.length; i++) {
            _mintPhases[i] = mintPhases[i];
        }

        _mintPhasesCount = length;
    }
}
