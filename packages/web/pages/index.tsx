import { ethers } from "ethers";
import { CampaignFactory__factory } from "../typechain-types";
import type { ReactElement } from "react";
import { Layout } from "../components/Layout";
import type { NextPageWithLayout } from "./_app";
import { Button, Link, Table, Text } from "@nextui-org/react";
import { CAMPAIGN_FACTORY_ADDRESS, ROUTES } from "../consts";

interface Props {
  campaignAddresses?: string[];
}

const Home: NextPageWithLayout<Props> = ({ campaignAddresses }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Text h1>Home</Text>
      {campaignAddresses ? (
        <Table aria-label="Table with campaign" style={{ minWidth: "100%" }}>
          <Table.Header>
            <Table.Column>Campaign Address</Table.Column>
            <Table.Column> </Table.Column>
          </Table.Header>
          <Table.Body>
            {campaignAddresses?.map((campaignAddress) => (
              <Table.Row key={campaignAddress}>
                <Table.Cell>{campaignAddress}</Table.Cell>
                <Table.Cell css={{ width: "0.1%", whiteSpace: "nowrap" }}>
                  <Button
                    as={Link}
                    href={ROUTES.Campaign.replace(":address", campaignAddress)}
                  >
                    View
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Text h3>No campaigns at the moment</Text>
      )}
    </div>
  );
};

Home.getInitialProps = async () => {
  const fetchData = async () => {
    const campaignFactoryContract = CampaignFactory__factory.connect(
      CAMPAIGN_FACTORY_ADDRESS,
      new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
    );

    try {
      const fetchedData = await campaignFactoryContract.getDeployedCampaigns();
      return fetchedData;
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const campaignAddresses = await fetchData();

  return {
    campaignAddresses: campaignAddresses,
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
