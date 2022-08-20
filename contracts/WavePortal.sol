// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 numOfUniqueWaves;
    mapping(address => uint256) ownerToWaveCount;

    constructor() {
        console.log("Welcome to my Wave Portal");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        // check if the sender is a new one
        if (ownerToWaveCount[msg.sender] == 0) {
            numOfUniqueWaves++;
        }

        // tracking waves for each sender
        ownerToWaveCount[msg.sender]++;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getTotalWavesFromAccount(address account)
        public
        view
        returns (uint256)
    {
        console.log(
            "We have %d total waves from %s!",
            ownerToWaveCount[account],
            account
        );
        return ownerToWaveCount[account];
    }

    function getNumOfUniqueWaves() public view returns (uint256) {
        console.log("We have %d total unique waves!", numOfUniqueWaves);
        return numOfUniqueWaves;
    }
}
