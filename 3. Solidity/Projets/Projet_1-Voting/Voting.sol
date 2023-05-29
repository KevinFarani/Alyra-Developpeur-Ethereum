// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

/*
* @title Democracy 3.0
* @author Kevin Collorig
* @notice This contract implements a voting system for small organization
* @dev Proposal IDs = Array index + 1
*/

contract Voting is Ownable {

    // ------------------------------------------------------------- Mandatory Variables

    uint winningProposalId;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }
    
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    // ------------------------------------------------------------- Custom Variables

    WorkflowStatus currentWorkflowStatus;
    mapping (address => Voter) VoterWhitelist;
    Proposal[] proposals;

    // ------------------------------------------------------------- Main Functions

    modifier onlyRegistered() {
        require(VoterWhitelist[msg.sender].isRegistered == true, "Sorry buddy, you're not registered.");
        _;
    }

    modifier checkWorkflowStatus(WorkflowStatus _workflowStatus) {
        require(currentWorkflowStatus == _workflowStatus, "You can't use this function at this time of the process.");
        _;
    }

    constructor() {
        currentWorkflowStatus = WorkflowStatus.RegisteringVoters;
    }

    // @notice Change process phase to ProposalsRegistrationStarted
    function startProposalsRegistration() external onlyOwner() checkWorkflowStatus(WorkflowStatus.RegisteringVoters) {
        currentWorkflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    // @notice Change process phase to ProposalsRegistrationEnded
    function endProposalsRegistration() external onlyOwner() checkWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        currentWorkflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    // @notice Change process phase to VotingSessionStarted
    function startVotingSession() external onlyOwner() checkWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded) {
        currentWorkflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    // @notice Change process phase to VotingSessionEnded
    function endVotingSession() external onlyOwner() checkWorkflowStatus(WorkflowStatus.VotingSessionStarted) {
        currentWorkflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    // @notice Tally votes and change process phase to VotesTallied
    function tallyVotes() external onlyOwner() checkWorkflowStatus(WorkflowStatus.VotingSessionEnded) {
        require(proposals.length > 0, "There is no proposal to tally.");
        winningProposalId = 1;
        for (uint i = 0 ; i < proposals.length ; i++) {
            if (proposals[i].voteCount > proposals[winningProposalId - 1].voteCount) {
                winningProposalId = i + 1;
            }
        }
        currentWorkflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    // @notice Register a new voter in the whitelist
    // @param _voterAddress the address of the new voter
    function registerVoter(address _voterAddress) external onlyOwner() {
        require(VoterWhitelist[_voterAddress].isRegistered == false, "Voter already registered ! Enjoy the gas economy ;)");
        VoterWhitelist[_voterAddress] = Voter(true, false, 0);
        emit VoterRegistered(_voterAddress);
    }

    // @notice Register a new proposal
    // @param _proposalDescription the description of the new proposal
    function registerProposal(string memory _proposalDescription) external onlyRegistered() checkWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        require(bytes(_proposalDescription).length > 0, "A proposal cannot be empty.");
        for (uint i = 0 ; i < proposals.length ; i++) {
            if (keccak256(abi.encodePacked(_proposalDescription)) ==  keccak256(abi.encodePacked(proposals[i].description))) {
                revert("This proposal already exists.");
            }
        }

        proposals.push(Proposal(_proposalDescription, 0));
        emit ProposalRegistered(proposals.length);
    }

    // @notice Vote for a proposal
    // @param _proposalId the ID of the voted proposal
    function voteProposal(uint _proposalId) external onlyRegistered() checkWorkflowStatus(WorkflowStatus.VotingSessionStarted) {
        require(VoterWhitelist[msg.sender].hasVoted == false, "You already voted.");
        require(_proposalId <= proposals.length, "This proposal doesn't exist.");

        proposals[_proposalId - 1].voteCount ++;
        VoterWhitelist[msg.sender].hasVoted = true;
        VoterWhitelist[msg.sender].votedProposalId = _proposalId;
        emit Voted(msg.sender, _proposalId);
    }

    // ------------------------------------------------------------- Getter Functions

    // @notice Return the current workflow status
    // @return string the lib of the current workflow status
    function getWorkflowStatus() external view returns(string memory) {
        if (currentWorkflowStatus == WorkflowStatus.RegisteringVoters) return "RegisteringVoters";
        if (currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationStarted) return "ProposalsRegistrationStarted";
        if (currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationEnded) return "ProposalsRegistrationEnded";
        if (currentWorkflowStatus == WorkflowStatus.VotingSessionStarted) return "VotingSessionStarted";
        if (currentWorkflowStatus == WorkflowStatus.VotingSessionEnded) return "VotingSessionEnded";
        if (currentWorkflowStatus == WorkflowStatus.VotesTallied) return "VotesTallied";
        return "";
    }

    // @notice Return all registered proposals
    // @return Proposal[] array of registered proposals
    function getProposals() external view returns(Proposal[] memory) {
        return proposals;
    }

    // @notice Return a voter's info
    // @param _voterAddress the address of the voter
    // @return Voter the voter details
    function getVoter(address _voterAddress) external view onlyRegistered() returns(Voter memory) {
        return VoterWhitelist[_voterAddress];
    }

    // @notice Return the winning proposal info
    // @return Proposal the winning proposal details
    function getWinningProposal() external view checkWorkflowStatus(WorkflowStatus.VotesTallied) returns(Proposal memory) {
        return proposals[winningProposalId - 1];
    }

    // ------------------------------------------------------------- Payable Functions

    receive() external payable {
        revert("Corruption is not accepted :P");
    }

    fallback() external payable {
        revert("Corruption is not accepted :P");
    }

}