// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "./Campaign.sol";

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimumAmount) public {
        Campaign deployedCampaign = new Campaign(minimumAmount, msg.sender);
        deployedCampaigns.push(address(deployedCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory ref) {
        return deployedCampaigns;
    }
}
