import { Button, FormElement, Input, Modal, Text } from "@nextui-org/react";
import { ChangeEvent, useState } from "react";
import { useAppLoadingContext } from "../context/AppLoadingContext";
import { useWebProvider } from "../hooks/useWebProvider";
import { Campaign__factory } from "../typechain-types";

interface Props {
  onClose: () => void;
  open: boolean;
  minimumContribution: number;
  campaignAddress: string;
}

const ContributeModal = ({
  open,
  onClose,
  minimumContribution,
  campaignAddress,
}: Props) => {
  const { signer } = useWebProvider();
  const [contributionValue, setContributionValue] = useState<string | number>(
    ""
  );
  const [error, setError] = useState("");
  const { setLoading } = useAppLoadingContext();

  const handleChange = (e: ChangeEvent<FormElement>) => {
    setError("");
    setContributionValue(Number(e.target.value));
  };

  const handleSubmit = async () => {
    if (!contributionValue) {
      setError("Contribution is required");
      return;
    }
    if (Number(contributionValue) < minimumContribution) {
      setError("Contribution can't be lower than minimum");
      return;
    }
    if (!signer) return;

    // TODO: loading screen is appearing beneath the modal
    setLoading(true);
    try {
      const campaignContract = Campaign__factory.connect(
        campaignAddress as string,
        signer
      );
      await campaignContract.contribute({ value: Number(contributionValue) });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal closeButton onClose={onClose} open={open}>
      <Modal.Header>
        <Text size={18}>Contribute to Campaign</Text>
      </Modal.Header>
      <Modal.Body>
        <Text>
          Minimum contribution for this campaign is {minimumContribution}
        </Text>
        <Input
          bordered
          label="Contribution (wei)"
          type="number"
          width="100%"
          value={contributionValue}
          helperText={error}
          helperColor="error"
          onChange={handleChange}
        />
        <Button onPress={handleSubmit} css={{ marginTop: "12px" }}>
          Contribute
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export { ContributeModal };
