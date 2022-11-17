import { ethers } from "ethers";
import { CAMPAIGN_FACTORY_ADDRESS } from "../consts";
import { CampaignFactory__factory } from "../typechain-types";

export const useCampaignFactory = () => {

  // TODO: this function raises following error (but transaction completed):
  // Error: Transaction reverted: function selector was not recognized and there's no fallback function
    const createCampaign = async (signer: ethers.providers.JsonRpcSigner, minimumValue: number) => {
      const campaignFactory = signer && CampaignFactory__factory.connect(
        CAMPAIGN_FACTORY_ADDRESS,
        signer
      );
      await campaignFactory.createCampaign(minimumValue);
    }

   
    
      return { createCampaign }
}