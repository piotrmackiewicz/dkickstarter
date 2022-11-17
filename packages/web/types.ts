import { ethers } from "ethers";

export type BlockchainPaymentRequests = [string[], ethers.BigNumber[], string[], boolean[], ethers.BigNumber[]]

export type PaymentRequest = {
    description: string;
    amount: number;
    recipient: string;
    complete: boolean;
    approvalCount: number;
    approved?: boolean;
}