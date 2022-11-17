import { Button, Input, Text } from "@nextui-org/react";
import { ReactElement, useState } from "react";
import { Layout } from "../components/Layout";
import { useAppLoadingContext } from "../context/AppLoadingContext";
import { useCampaignFactory } from "../hooks/useCampaignFactory";
import { useWebProvider } from "../hooks/useWebProvider";
import { NextPageWithLayout } from "./_app";

const CreateCampaign: NextPageWithLayout = () => {
  const [minimumValue, setMinimumValue] = useState<undefined | number>(
    undefined
  );
  const { signer } = useWebProvider();
  const { createCampaign } = useCampaignFactory();
  const { setLoading } = useAppLoadingContext();

  const handleSubmit = async () => {
    if (!minimumValue || !signer) {
      // TODO: form validation
      return;
    }

    try {
      setLoading(true);
      await createCampaign(signer, minimumValue);
      // TODO: add some toast with success message and link to created campaign
      // TODO: this doesnt work, it doesnt clear the input
      setMinimumValue(undefined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text h1>Create Campaign</Text>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "40%",
        }}
      >
        <Input
          bordered
          label="Minimum contribution (wei)"
          type="number"
          width="100%"
          value={minimumValue}
          onChange={(e) => setMinimumValue(Number(e.target.value))}
        />
        <Button onPress={handleSubmit}>Create</Button>
      </div>
    </>
  );
};

CreateCampaign.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CreateCampaign;
