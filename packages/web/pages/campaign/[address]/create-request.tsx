import { Button, Input, Text, Textarea } from "@nextui-org/react";
import { ethers } from "ethers";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { Layout } from "../../../components/Layout";
import { useAppLoadingContext } from "../../../context/AppLoadingContext";
import { useWebProvider } from "../../../hooks/useWebProvider";
import { Campaign__factory } from "../../../typechain-types";
import { NextPageWithLayout } from "../../_app";

// TODO: fix these types
interface Props {}

const CreateRequest: NextPageWithLayout<Props> = () => {
  const router = useRouter();
  const { address } = router.query;
  const { signer } = useWebProvider();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<undefined | number>(undefined);
  const [recipient, setRecipient] = useState("");
  const { setLoading } = useAppLoadingContext();

  const handleSubmit = async () => {
    if (!description || !amount || !recipient || !signer) {
      // TODO: form validation
      return;
    }

    try {
      setLoading(true);
      const campaignContract = Campaign__factory.connect(
        address as string,
        signer
      );
      await campaignContract.createRequest(description, amount, recipient);
      // TODO: add some toast with success message and link to created campaign
      // TODO: this doesnt work, it doesnt clear the input
      setDescription("");
      setAmount(undefined);
      setRecipient("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text h1>Create Payment Request</Text>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "40%",
        }}
      >
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          bordered
          label="Amount"
          type="number"
          width="100%"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <Input
          bordered
          label="Recipient Address"
          width="100%"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Button onPress={handleSubmit}>Create</Button>
      </div>
    </>
  );
};

CreateRequest.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CreateRequest;
