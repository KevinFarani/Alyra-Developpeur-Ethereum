const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

const Voting = artifacts.require('Voting');

contract('Voting', accounts => {
    const owner = accounts[0];
    const nonRegisteredVoter = accounts[1];
    const registeredVoter = accounts[2];
    const newVoter = accounts[3];

    let VotingInstance;

    // ::::::::::::: REGISTRATION ::::::::::::: // 

    context('Workflow : RegisteringVoters', function () {
        describe('In Flow Function(s)', function () {
            describe('addVoter', function () {
                beforeEach(async () => {
                    VotingInstance = await Voting.new({from: owner});
                    await VotingInstance.addVoter(registeredVoter, {from: owner});
                });
                it("...expect revert if the caller is not the owner", async () => {
                    await expectRevert(VotingInstance.addVoter(newVoter, {from: nonRegisteredVoter}), "Ownable: caller is not the owner.");
                });
                it("...expect revert if the voter is already registered", async () => {
                    await expectRevert(VotingInstance.addVoter(registeredVoter, {from: owner}), "Already registered");
                });
                it("...expect the voter to be added", async function () {
                    await VotingInstance.addVoter(newVoter, {from: owner});
                    const storedData = await VotingInstance.getVoter(newVoter, {from: newVoter});
                    expect(storedData.isRegistered).to.be.true;
                });
                it('...expect event to be emitted', async function () {
                    const receiptEvent = await VotingInstance.addVoter(newVoter, {from: owner});
                    expectEvent(receiptEvent, 'VoterRegistered', {voterAddress: newVoter});

                });
            });

            describe('startProposalsRegistering', function () {
                beforeEach(async () => {
                    VotingInstance = await Voting.new({from: owner});
                    await VotingInstance.addVoter(registeredVoter, {from: owner});
                });
                it("...expect revert if the caller is not the owner", async () => {
                    await expectRevert(VotingInstance.startProposalsRegistering({from: nonRegisteredVoter}), "Ownable: caller is not the owner.");
                });
                it('...expect event to be emitted', async function () {
                    const receiptEvent = await VotingInstance.startProposalsRegistering({from: owner});
                    expectEvent(receiptEvent, 'WorkflowStatusChange', {previousStatus: new BN(0), newStatus: new BN(1)});
                });
            });
        });

        describe('Out of Flow Function(s)', function () {
            before(async () => {
                VotingInstance = await Voting.new({from: owner});
                await VotingInstance.addVoter(registeredVoter, {from: owner});
            });
            describe('endProposalsRegistering', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationStarted", async () => {
                    await expectRevert(VotingInstance.endProposalsRegistering({from: owner}), "Registering proposals havent started yet");
                });
            });
            describe('startVotingSession', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationEnded", async () => {
                    await expectRevert(VotingInstance.startVotingSession({from: owner}), "Registering proposals phase is not finished");
                });
            });
            describe('endVotingSession', function () {
                it("...expect revert if the workflow status is not VotingSessionStarted", async () => {
                    await expectRevert(VotingInstance.endVotingSession({from: owner}), "Voting session havent started yet");
                });
            });
            describe('addProposal', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationStarted", async () => {
                    await expectRevert(VotingInstance.addProposal('Test Proposal', {from: registeredVoter}), "Proposals are not allowed yet");
                });
            });
            describe('setVote', function () {
                it("...expect revert if the workflow status is not VotingSessionStarted", async () => {
                    await expectRevert(VotingInstance.setVote(0, {from: registeredVoter}), "Voting session havent started yet");
                });
            });
            describe('tallyVotes', function () {
                it("...expect revert if the workflow status is not VotingSessionStarted", async () => {
                    await expectRevert(VotingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
                });
            });
        });
    });


    // ::::::::::::: PROPOSAL - START ::::::::::::: // 

    context('Workflow : ProposalsRegistrationStarted', function () {
        describe('In Flow Function(s)', function () {
            describe('addProposal', function () {
                beforeEach(async () => {
                    VotingInstance = await Voting.new({from: owner});
                    await VotingInstance.addVoter(registeredVoter, {from: owner});
                    await VotingInstance.startProposalsRegistering({from: owner});
                });
                it("...expect revert if the caller is not a registered voter", async () => {
                    await expectRevert(VotingInstance.addProposal('Test Proposal', {from: nonRegisteredVoter}), "You're not a voter");
                });
                it("...expect revert if proposal is empty", async () => {
                    await expectRevert(VotingInstance.addProposal('', {from: registeredVoter}), "Vous ne pouvez pas ne rien proposer");
                });
                it("...expect the proposal to be added", async function () {
                    await VotingInstance.addProposal('Test Proposal', {from: registeredVoter});
                    const storedData = await VotingInstance.getOneProposal(1, {from: registeredVoter});
                    expect(storedData.description).to.be.equal('Test Proposal');
                });
                it('...expect event to be emitted', async function () {
                    const receiptEvent = await VotingInstance.addProposal('Test Proposal', {from: registeredVoter});
                    expectEvent(receiptEvent, 'ProposalRegistered', {proposalId: new BN(1)});

                });
            });

            describe('endProposalsRegistering', function () {
                beforeEach(async () => {
                    VotingInstance = await Voting.new({from: owner});
                    await VotingInstance.addVoter(registeredVoter, {from: owner});
                    await VotingInstance.startProposalsRegistering({from: owner});
                });
                it("...expect revert if the caller is not the owner", async () => {
                    await expectRevert(VotingInstance.endProposalsRegistering({from: nonRegisteredVoter}), "Ownable: caller is not the owner.");
                });
                it('...expect event to be emitted', async function () {
                    const receiptEvent = await VotingInstance.endProposalsRegistering({from: owner});
                    expectEvent(receiptEvent, 'WorkflowStatusChange', {previousStatus: new BN(1), newStatus: new BN(2)});
                });
            });
        });

        describe('Out of Flow Function(s)', function () {
            before(async () => {
                VotingInstance = await Voting.new({from: owner});
                await VotingInstance.addVoter(registeredVoter, {from: owner});
                await VotingInstance.startProposalsRegistering({from: owner});
            });
            describe('startProposalsRegistering', function () {
                it("...expect revert if the workflow status is not RegisteringVoters", async () => {
                    await expectRevert(VotingInstance.startProposalsRegistering({from: owner}), "Registering proposals cant be started now");
                });
            });
            describe('startVotingSession', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationEnded", async () => {
                    await expectRevert(VotingInstance.startVotingSession({from: owner}), "Registering proposals phase is not finished");
                });
            });
            describe('endVotingSession', function () {
                it("...expect revert if the workflow status is not VotingSessionStarted", async () => {
                    await expectRevert(VotingInstance.endVotingSession({from: owner}), "Voting session havent started yet");
                });
            });
            describe('addVoter', function () {
                it("...expect revert if the workflow status is not RegisteringVoters", async () => {
                    await expectRevert(VotingInstance.addVoter(newVoter, {from: owner}), "Voters registration is not open yet");
                });
            });
            describe('setVote', function () {
                it("...expect revert if the workflow status is not VotingSessionStarted", async () => {
                    await expectRevert(VotingInstance.setVote(0, {from: registeredVoter}), "Voting session havent started yet");
                });
            });
            describe('tallyVotes', function () {
                it("...expect revert if the workflow status is not VotingSessionStarted", async () => {
                    await expectRevert(VotingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
                });
            });
        });
    });


    // ::::::::::::: PROPOSAL - END ::::::::::::: // 

    context('Workflow : ProposalsRegistrationEnded', function () {
        describe('In Flow Function(s)', function () {
            describe('startVotingSession', function () {
                beforeEach(async () => {
                    VotingInstance = await Voting.new({from: owner});
                    await VotingInstance.addVoter(registeredVoter, {from: owner});
                    await VotingInstance.startProposalsRegistering({from: owner});
                    await VotingInstance.addProposal('Winning Proposal', {from: registeredVoter});
                    await VotingInstance.addProposal('Losing Proposal', {from: registeredVoter});
                    await VotingInstance.endProposalsRegistering({from: owner});
                });
                it("...expect revert if the caller is not the owner", async () => {
                    await expectRevert(VotingInstance.startVotingSession({from: nonRegisteredVoter}), "Ownable: caller is not the owner.");
                });
                it('...expect event to be emitted', async function () {
                    const receiptEvent = await VotingInstance.startVotingSession({from: owner});
                    expectEvent(receiptEvent, 'WorkflowStatusChange', {previousStatus: new BN(2), newStatus: new BN(3)});
                });
            });
        });

        describe('Out of Flow Function(s)', function () {
            before(async () => {
                VotingInstance = await Voting.new({from: owner});
                await VotingInstance.addVoter(registeredVoter, {from: owner});
                await VotingInstance.startProposalsRegistering({from: owner});
                await VotingInstance.addProposal('Winning Proposal', {from: registeredVoter});
                await VotingInstance.addProposal('Losing Proposal', {from: registeredVoter});
                await VotingInstance.endProposalsRegistering({from: owner});
            });
            describe('startProposalsRegistering', function () {
                it("...expect revert if the workflow status is not RegisteringVoters", async () => {
                    await expectRevert(VotingInstance.startProposalsRegistering({from: owner}), "Registering proposals cant be started now");
                });
            });
            describe('endProposalsRegistering', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationStarted", async () => {
                    await expectRevert(VotingInstance.endProposalsRegistering({from: owner}), "Registering proposals havent started yet");
                });
            });
            describe('endVotingSession', function () {
                it("...expect revert if the workflow status is not VotingSessionStarted", async () => {
                    await expectRevert(VotingInstance.endVotingSession({from: owner}), "Voting session havent started yet");
                });
            });
            describe('addVoter', function () {
                it("...expect revert if the workflow status is not RegisteringVoters", async () => {
                    await expectRevert(VotingInstance.addVoter(newVoter, {from: owner}), "Voters registration is not open yet");
                });
            });
            describe('addProposal', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationStarted", async () => {
                    await expectRevert(VotingInstance.addProposal('test', {from: registeredVoter}), "Proposals are not allowed yet");
                });
            });
            describe('setVote', function () {
                it("...expect revert if the workflow status is not VotingSessionStarted", async () => {
                    await expectRevert(VotingInstance.setVote(0, {from: registeredVoter}), "Voting session havent started yet");
                });
            });
            describe('tallyVotes', function () {
                it("...expect revert if the workflow status is not VotingSessionStarted", async () => {
                    await expectRevert(VotingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
                });
            });
        });
    });


    // ::::::::::::: VOTE : START ::::::::::::: //

    context('Workflow : VotingSessionStarted', function () {
        describe('In Flow Function(s)', function () {
            describe('setVote', function () {
                beforeEach(async () => {
                    VotingInstance = await Voting.new({from: owner});
                    await VotingInstance.addVoter(registeredVoter, {from: owner});
                    await VotingInstance.startProposalsRegistering({from: owner});
                    await VotingInstance.addProposal('Winning Proposal', {from: registeredVoter});
                    await VotingInstance.addProposal('Losing Proposal', {from: registeredVoter});
                    await VotingInstance.endProposalsRegistering({from: owner});
                    await VotingInstance.startVotingSession({from: owner});
                });
                it("...expect revert if the caller is not a registered voter", async () => {
                    await expectRevert(VotingInstance.setVote(1, {from: nonRegisteredVoter}), "You're not a voter");
                });
                it("...expect revert if the caller vote for an unexisting proposal", async () => {
                    await expectRevert(VotingInstance.setVote(3, {from: registeredVoter}), "Proposal not found");
                });
                it("...expect the vote to be registered", async function () {
                    await VotingInstance.setVote(1, {from: registeredVoter});
                    const storedData = await VotingInstance.getOneProposal(1, {from: registeredVoter});
                    expect(storedData.voteCount).to.be.bignumber.equal(new BN(1));
                });
                it("...expect revert if the caller has already voted", async () => {
                    await VotingInstance.setVote(1, {from: registeredVoter});
                    await expectRevert(VotingInstance.setVote(1, {from: registeredVoter}), "You have already voted");
                });
                it('...expect event to be emitted', async function () {
                    const receiptEvent = await VotingInstance.setVote(1, {from: registeredVoter});
                    expectEvent(receiptEvent, 'Voted', {voter: registeredVoter, proposalId: new BN(1)});

                });
            });

            describe('endVotingSession', function () {
                beforeEach(async () => {
                    VotingInstance = await Voting.new({from: owner});
                    await VotingInstance.addVoter(registeredVoter, {from: owner});
                    await VotingInstance.startProposalsRegistering({from: owner});
                    await VotingInstance.addProposal('Winning Proposal', {from: registeredVoter});
                    await VotingInstance.addProposal('Losing Proposal', {from: registeredVoter});
                    await VotingInstance.endProposalsRegistering({from: owner});
                    await VotingInstance.startVotingSession({from: owner});
                });
                it("...expect revert if the caller is not the owner", async () => {
                    await expectRevert(VotingInstance.endVotingSession({from: nonRegisteredVoter}), "Ownable: caller is not the owner.");
                });
                it('...expect event to be emitted', async function () {
                    const receiptEvent = await VotingInstance.endVotingSession({from: owner});
                    expectEvent(receiptEvent, 'WorkflowStatusChange', {previousStatus: new BN(3), newStatus: new BN(4)});
                });
            });
        });

        describe('Out of Flow Function(s)', function () {
            before(async () => {
                VotingInstance = await Voting.new({from: owner});
                await VotingInstance.addVoter(registeredVoter, {from: owner});
                await VotingInstance.startProposalsRegistering({from: owner});
                await VotingInstance.addProposal('Winning Proposal', {from: registeredVoter});
                await VotingInstance.addProposal('Losing Proposal', {from: registeredVoter});
                await VotingInstance.endProposalsRegistering({from: owner});
                await VotingInstance.startVotingSession({from: owner});
            });
            describe('startProposalsRegistering', function () {
                it("...expect revert if the workflow status is not RegisteringVoters", async () => {
                    await expectRevert(VotingInstance.startProposalsRegistering({from: owner}), "Registering proposals cant be started now");
                });
            });
            describe('endProposalsRegistering', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationStarted", async () => {
                    await expectRevert(VotingInstance.endProposalsRegistering({from: owner}), "Registering proposals havent started yet");
                });
            });
            describe('startVotingSession', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationEnded", async () => {
                    await expectRevert(VotingInstance.startVotingSession({from: owner}), "Registering proposals phase is not finished");
                });
            });
            describe('addVoter', function () {
                it("...expect revert if the workflow status is not RegisteringVoters", async () => {
                    await expectRevert(VotingInstance.addVoter(newVoter, {from: owner}), "Voters registration is not open yet");
                });
            });
            describe('addProposal', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationStarted", async () => {
                    await expectRevert(VotingInstance.addProposal('test', {from: registeredVoter}), "Proposals are not allowed yet");
                });
            });
            describe('tallyVotes', function () {
                it("...expect revert if the workflow status is not VotingSessionStarted", async () => {
                    await expectRevert(VotingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
                });
            });
        });
    });


    // ::::::::::::: VOTE : END ::::::::::::: //

    context('Workflow : VotingSessionEnded', function () {
        describe('In Flow Function(s)', function () {
            describe('tallyVotes', function () {
                beforeEach(async () => {
                    VotingInstance = await Voting.new({from: owner});
                    await VotingInstance.addVoter(registeredVoter, {from: owner});
                    await VotingInstance.startProposalsRegistering({from: owner});
                    await VotingInstance.addProposal('Winning Proposal', {from: registeredVoter});
                    await VotingInstance.addProposal('Losing Proposal', {from: registeredVoter});
                    await VotingInstance.endProposalsRegistering({from: owner});
                    await VotingInstance.startVotingSession({from: owner});
                    await VotingInstance.setVote(1, {from: registeredVoter});
                    await VotingInstance.endVotingSession({from: owner});
                });
                it("...expect revert if the caller is not the owner", async () => {
                    await expectRevert(VotingInstance.tallyVotes({from: nonRegisteredVoter}), "Ownable: caller is not the owner.");
                });
                it('...expect event to be emitted', async function () {
                    const receiptEvent = await VotingInstance.tallyVotes({from: owner});
                    expectEvent(receiptEvent, 'WorkflowStatusChange', {previousStatus: new BN(4), newStatus: new BN(5)});
                });
            });
        });

        describe('Out of Flow Function(s)', function () {
            before(async () => {
                VotingInstance = await Voting.new({from: owner});
                await VotingInstance.addVoter(registeredVoter, {from: owner});
                await VotingInstance.startProposalsRegistering({from: owner});
                await VotingInstance.addProposal('Winning Proposal', {from: registeredVoter});
                await VotingInstance.addProposal('Losing Proposal', {from: registeredVoter});
                await VotingInstance.endProposalsRegistering({from: owner});
                await VotingInstance.startVotingSession({from: owner});
                await VotingInstance.setVote(1, {from: registeredVoter});
                await VotingInstance.endVotingSession({from: owner});
            });
            describe('startProposalsRegistering', function () {
                it("...expect revert if the workflow status is not RegisteringVoters", async () => {
                    await expectRevert(VotingInstance.startProposalsRegistering({from: owner}), "Registering proposals cant be started now");
                });
            });
            describe('endProposalsRegistering', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationStarted", async () => {
                    await expectRevert(VotingInstance.endProposalsRegistering({from: owner}), "Registering proposals havent started yet");
                });
            });
            describe('startVotingSession', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationEnded", async () => {
                    await expectRevert(VotingInstance.startVotingSession({from: owner}), "Registering proposals phase is not finished");
                });
            });
            describe('addVoter', function () {
                it("...expect revert if the workflow status is not RegisteringVoters", async () => {
                    await expectRevert(VotingInstance.addVoter(newVoter, {from: owner}), "Voters registration is not open yet");
                });
            });
            describe('addProposal', function () {
                it("...expect revert if the workflow status is not ProposalsRegistrationStarted", async () => {
                    await expectRevert(VotingInstance.addProposal('test', {from: registeredVoter}), "Proposals are not allowed yet");
                });
            });
            describe('setVote', function () {
                it("...expect revert if the workflow status is not VotingSessionStarted", async () => {
                    await expectRevert(VotingInstance.setVote(0, {from: registeredVoter}), "Voting session havent started yet");
                });
            });
        });
    });
});