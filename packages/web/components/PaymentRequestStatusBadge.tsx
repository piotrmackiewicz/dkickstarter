import { Badge } from "@nextui-org/react";

interface Props {
  complete: boolean;
}

const PaymentRequestStatusBadge = ({ complete }: Props) => (
  <Badge color={complete ? "success" : "warning"}>
    {complete ? "YES" : "NO"}
  </Badge>
);

export { PaymentRequestStatusBadge };
