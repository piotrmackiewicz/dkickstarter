import {
  Button,
  Card,
  Grid,
  Link,
  Loading,
  Text,
  useTheme,
} from "@nextui-org/react";
import { ethers } from "ethers";
import { NextPageContext } from "next";
import { ReactElement, useEffect, useState } from "react";
import { ContributeModal } from "../../../components/ContributeModal";
import { Layout } from "../../../components/Layout";
import { ROUTES } from "../../../consts";
import { bigNumberToNumber } from "../../../helpers";
import { useWebProvider } from "../../../hooks/useWebProvider";
import { Campaign__factory } from "../../../typechain-types";
import { NextPageWithLayout } from "../../_app";

// TODO: fix these types
interface Props {
  address: any;
  campaignData: any;
}

const Campaign: NextPageWithLayout<Props> = ({ address, campaignData }) => {
  const { theme } = useTheme();
  const { signer } = useWebProvider();
  const managerAddress = campaignData[0];
  const minimumContribution = bigNumberToNumber(campaignData[1]);
  const approversCount = bigNumberToNumber(campaignData[2]);
  const [isUserCampaignManager, setIsUserCampaignManager] = useState<boolean>();
  const [isUserContributing, setIsUserContributing] = useState<boolean>();
  const [isButtonLoading, setIsButtonLoading] = useState(true);
  const [contributeModalVisible, setContributeModalVisible] = useState(false);

  useEffect(() => {
    const loadSignerAddress = async () => {
      if (!signer) return;

      const signerAddress = await signer.getAddress();
      const campaignContract = Campaign__factory.connect(
        address as string,
        signer
      );
      const isContributing = await campaignContract.approvers(signerAddress);
      setIsUserCampaignManager(signerAddress === managerAddress);
      setIsUserContributing(isContributing);
    };

    loadSignerAddress();
  }, [setIsUserCampaignManager, managerAddress, signer, address]);

  useEffect(() => {
    if (
      isUserCampaignManager !== undefined &&
      isUserContributing !== undefined
    ) {
      setIsButtonLoading(false);
    }
  }, [isUserCampaignManager, isUserContributing]);

  return (
    <>
      <Text h1>Campaign {address}</Text>
      <Grid.Container gap={2}>
        <Grid xs={9}>
          <Card>
            <Card.Body>
              <div>
                <Text>Manager: {managerAddress}</Text>
                <Text>Minimum Contribution: {minimumContribution}</Text>
                <Text>Contributors: {approversCount}</Text>
                <Button
                  size="sm"
                  css={{ marginTop: theme?.space[10] }}
                  as={Link}
                  href={ROUTES.CampaignRequests.replace(":address", address)}
                >
                  Payment requests
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={3} justify="center">
          {isButtonLoading && <Loading />}
          {isUserCampaignManager === false && !isUserContributing && (
            <Button size="xl" onClick={() => setContributeModalVisible(true)}>
              Contribute!
            </Button>
          )}
          {isUserCampaignManager === true && (
            <Button size="xl" as={Link} href="">
              Manage
            </Button>
          )}
        </Grid>
      </Grid.Container>
      <ContributeModal
        open={contributeModalVisible}
        onClose={() => setContributeModalVisible(false)}
        minimumContribution={minimumContribution}
        campaignAddress={address}
      />
    </>
  );
};

Campaign.getInitialProps = async (ctx: NextPageContext) => {
  const { address } = ctx.query;

  const fetchData = async () => {
    const campaignContract = Campaign__factory.connect(
      address as string,
      new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
    );

    try {
      const fetchedData = await Promise.all([
        campaignContract.manager(),
        campaignContract.minimumContribution(),
        campaignContract.approversCount(),
      ]);
      return fetchedData;
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const campaignData = await fetchData();

  return { address, campaignData };
};

Campaign.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Campaign;
