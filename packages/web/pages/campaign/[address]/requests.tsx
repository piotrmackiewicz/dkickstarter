import { Button, Link, Loading, Table, Text } from "@nextui-org/react";
import { ethers } from "ethers";
import { NextPageContext } from "next";
import { ReactElement, useEffect, useState } from "react";
import { Layout } from "../../../components/Layout";
import { PaymentRequestStatusBadge } from "../../../components/PaymentRequestStatusBadge";
import { ROUTES } from "../../../consts";
import { useAppLoadingContext } from "../../../context/AppLoadingContext";
import { parseRequests } from "../../../helpers";
import { useWebProvider } from "../../../hooks/useWebProvider";
import { Campaign__factory } from "../../../typechain-types";
import { PaymentRequest } from "../../../types";
import { NextPageWithLayout } from "../../_app";

// TODO: fix these types
interface Props {
  address: string;
  requests?: any;
  manager?: string;
}

const Requests: NextPageWithLayout<Props> = ({
  address,
  requests,
  manager,
}) => {
  const { signer } = useWebProvider();
  const { setLoading } = useAppLoadingContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isUserCampaignManager, setIsUserCampaignManager] = useState<boolean>();
  const [isUserContributing, setIsUserContributing] = useState<boolean>();
  const [parsedRequests, setParsedRequests] = useState<PaymentRequest[]>([]);

  const handleApprove = async (requestIdx: number) => {
    if (!signer) return;

    const campaignContract = Campaign__factory.connect(
      address as string,
      signer
    );
    try {
      setLoading(true);
      await campaignContract.approveRequest(requestIdx);
      setParsedRequests((prev) =>
        prev.map((r, idx) =>
          idx === requestIdx
            ? { ...r, approved: true, approvalCount: r.approvalCount + 1 }
            : r
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async (requestIdx: number) => {
    if (!signer) return;

    const campaignContract = Campaign__factory.connect(
      address as string,
      signer
    );
    try {
      setLoading(true);
      await campaignContract.finalizeRequest(requestIdx);
      setParsedRequests((prev) =>
        prev.map((r, idx) =>
          idx === requestIdx ? { ...r, complete: true } : r
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadRequests = async () => {
      if (!signer) return;
      setIsLoading(true);
      try {
        const parsedRequests = parseRequests(requests);
        const campaignContract = Campaign__factory.connect(
          address as string,
          signer
        );
        for (let i = 0; i < parsedRequests.length; i++) {
          const isApproved = await campaignContract.isRequestApprovedBySigner(
            i
          );
          parsedRequests[i].approved = isApproved;
        }
        console.log(parsedRequests);
        setParsedRequests(parsedRequests);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRequests();
  }, [address, requests, signer]);

  useEffect(() => {
    const checkIfUserIsManager = async () => {
      if (!signer) return;
      const userAddress = await signer.getAddress();
      const campaignContract = Campaign__factory.connect(
        address as string,
        signer
      );
      const isContributing = await campaignContract.approvers(userAddress);
      setIsUserContributing(isContributing);
      setIsUserCampaignManager(manager === userAddress);
    };
    checkIfUserIsManager();
  }, [address, manager, signer]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Text h1>Campaign Requests</Text>
      <Table css={{ height: "auto", minWidth: "100%" }}>
        <Table.Header>
          <Table.Column>Description</Table.Column>
          <Table.Column>Amount</Table.Column>
          <Table.Column>Recipient</Table.Column>
          <Table.Column>Complete</Table.Column>
          <Table.Column>Approval Count</Table.Column>
          <Table.Column> </Table.Column>
        </Table.Header>
        <Table.Body>
          {parsedRequests.map((request, idx) => (
            // TODO: this should be proper key
            <Table.Row key={`${request.description}-${request.recipient}`}>
              <Table.Cell>{request.description}</Table.Cell>
              <Table.Cell>{request.amount}</Table.Cell>
              <Table.Cell>{request.recipient}</Table.Cell>
              <Table.Cell>
                <PaymentRequestStatusBadge complete={request.complete} />
              </Table.Cell>
              <Table.Cell>{request.approvalCount}</Table.Cell>
              <Table.Cell>
                {isUserCampaignManager && !request.complete && (
                  <Button
                    size="xs"
                    color="success"
                    onClick={() => handleFinalize(idx)}
                  >
                    Finalize
                  </Button>
                )}
                {!isUserCampaignManager &&
                  isUserContributing &&
                  !request.approved && (
                    <Button
                      size="xs"
                      color="success"
                      onClick={() => handleApprove(idx)}
                    >
                      Approve
                    </Button>
                  )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {isUserCampaignManager && (
        <Button
          css={{ marginTop: "12px" }}
          as={Link}
          href={ROUTES.CreateRequest.replace(":address", address)}
        >
          Create Request
        </Button>
      )}
    </>
  );
};

Requests.getInitialProps = async (ctx: NextPageContext) => {
  const { address } = ctx.query;

  const fetchData = async () => {
    const campaignContract = Campaign__factory.connect(
      address as string,
      new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
    );

    try {
      const requests = await campaignContract.getRequests();
      const manager = await campaignContract.manager();
      return { requests: requests, manager: manager };
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const data = await fetchData();

  return {
    address: address as string,
    requests: data?.requests,
    manager: data?.manager,
  };
};

Requests.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Requests;
