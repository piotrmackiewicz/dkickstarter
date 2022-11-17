import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { Campaign, CampaignFactory } from "../../web/typechain-types";

const minimumContribution = 100;

describe('Campaign', async () => {
    let accounts: SignerWithAddress[];
    let campaignCreator: SignerWithAddress;
    let contributor1: SignerWithAddress;
    let contributor2: SignerWithAddress;
    let contributor3: SignerWithAddress;
    let requestRecipient: SignerWithAddress;
    let factory: CampaignFactory;
    let campaignAddress: string;
    let campaign: Campaign;

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        campaignCreator = accounts[0]
        contributor1 = accounts[1]
        contributor1 = accounts[2]
        contributor1 = accounts[3]
        requestRecipient = accounts[4]
        const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
        factory = await CampaignFactory.deploy();
        await factory.connect(campaignCreator).createCampaign(minimumContribution);
        [campaignAddress] = await factory.getDeployedCampaigns();
        campaign = await ethers.getContractAt("Campaign", campaignAddress);
    })

    it('deploys CampaignFactory and Campaign', () => {
        assert.isOk(factory, 'CampaignFactory has not been deployed');
        assert.isOk(campaign, 'Campaign has not been deployed');
    })

    it('marks caller as the campaign manager', async () => {
        expect(await campaign.manager()).equal(campaignCreator.address)
    })

    it('allows to contribute and marks caller as the approver', async () => {
        await campaign.connect(contributor1).contribute({ value: minimumContribution });
        expect(await campaign.approvers(contributor1.address)).to.be.true;
        expect(await campaign.approversCount()).to.equal(1);
    })

    it('doesn\'t allow contribute with value less than minimum', async () => {
        await expect(campaign.connect(contributor1).contribute({ value: minimumContribution - 1 })).to.be.reverted;;
        expect(await campaign.approvers(contributor1.address)).to.be.false;
        expect(await campaign.approversCount()).to.equal(0);
    })

    it('allow manager to make a payment request', async () => {
        await campaign.connect(campaignCreator).createRequest('Test request', 80, requestRecipient.address);
        const testRequest = await campaign.requests(0);
        expect(testRequest.description).to.equal('Test request');
        expect(testRequest.amount).to.equal(80);
        expect(testRequest.recipient).to.equal(requestRecipient.address);
        expect(testRequest.complete).to.be.false;
        expect(testRequest.approvalCount).to.equal(0);
    })

    // TODO: replace this test with multiple smaller tests
    it('processes requests', async () => {
        await campaign.connect(contributor1).contribute({ value: minimumContribution });
        await campaign.connect(campaignCreator).createRequest('Test request', 80, requestRecipient.address);
        await campaign.connect(contributor1).approveRequest(0);

        const approval = await campaign.connect(contributor1).getRequestApproval(0, contributor1.address)
        expect(approval).to.be.true;
    })

    // TODO: add more tests
});
