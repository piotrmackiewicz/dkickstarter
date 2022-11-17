import { BigNumber } from "ethers";
import { BlockchainPaymentRequests, PaymentRequest } from "../types";

export const bigNumberToNumber = (value: BigNumber) => {
    return value.toNumber();
}

export const parseRequests = (requests: BlockchainPaymentRequests): PaymentRequest[] => {
    const parsedRequests = [];

    for (let i = 0; i < requests[2].length; i++) {
      parsedRequests.push({
        description: requests[0][i],
        amount: bigNumberToNumber(requests[1][i]),
        recipient: requests[2][i],
        complete: requests[3][i],
        approvalCount: bigNumberToNumber(requests[4][i]),
      });
    }

    return parsedRequests;
}