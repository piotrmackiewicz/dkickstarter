import { ethers } from "ethers"
import { useEffect, useState } from "react";

const useWebProvider = () => {
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
    

    useEffect(() => {
        const init = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            await provider.send("eth_requestAccounts", []);
            setSigner(provider.getSigner());
        }

        init();
    }, [])

    return { signer }
}

export { useWebProvider }