// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JourneyTracker {
    struct Journey {
        uint256 startTime;
        bytes32 tripDataHash;
        address traveler;
        bool isCompleted;
    }

    mapping(uint256 => Journey) public journeys;
    uint256 private nextJourneyId;

    event JourneyCreated(uint256 journeyId, address traveler, bytes32 tripDataHash, uint256 startTime);
    event JourneyCompleted(uint256 journeyId);

    function createJourney(string memory _tripData) public returns (uint256) {
        uint256 journeyId = nextJourneyId++;
        bytes32 tripDataHash = keccak256(abi.encode(_tripData));
        journeys[journeyId] = Journey({
            startTime: block.timestamp,
            tripDataHash: tripDataHash,
            traveler: msg.sender,
            isCompleted: false
        });
        emit JourneyCreated(journeyId, msg.sender, tripDataHash, block.timestamp);
        return journeyId;
    }
    function completeJourney(uint256 _journeyId) public {
        require(!journeys[_journeyId].isCompleted, "Journey already completed");
        require(msg.sender == journeys[_journeyId].traveler, "Not the traveler");
        journeys[_journeyId].isCompleted = true;
        emit JourneyCompleted(_journeyId);
    }
}