// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    mapping(address => bool) public hasVoted;
    mapping(string => uint256) public votes;
    string[] public votedCandidates;

    function vote(string memory candidate) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        votes[candidate]++;
        hasVoted[msg.sender] = true;
        votedCandidates.push(candidate);
    }

    function getVotesForCandidate(string memory candidate) public view returns (uint256) {
        return votes[candidate];
    }

    function getVotedCandidates() public view returns (string[] memory) {
        return votedCandidates;
    }
}
