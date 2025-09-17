// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract TouristID {
    struct TouristInfo {
        bytes32 personalDataHash;
        uint256 registrationTimestamp;
    }
    mapping(uint256 => TouristInfo) internal  registeredTourists;
    mapping(bytes32 => bool) private isHashRegistered;
    event TouristRegistered(uint256 indexed touristId, bytes32 dataHash);
    function registerTourist(uint256 _touristId, string memory _personalData) internal  {
        bytes32 dataHash = keccak256(abi.encode(_personalData));
        require(!isHashRegistered[dataHash], "Personal data is already registered.");
        require(registeredTourists[_touristId].registrationTimestamp == 0, "Tourist ID already exists.");

        registeredTourists[_touristId] = TouristInfo(dataHash, block.timestamp);
        isHashRegistered[dataHash] = true;
        emit TouristRegistered(_touristId, dataHash);
    }
}