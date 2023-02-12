import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import ExamplePunksArtifact from "../../config/web3/artifacts/ExamplePunks";

const { address, abi } = ExamplePunksArtifact;

const useExaplePunks = () => {
    const { active, library, chainId } = useWeb3React();

    const ExamplePunks = useMemo(() => {
        if (active) return new library.eth.Contract(abi, address[chainId])}, 
    [active, chainId, library?.eth?.Contract]);
    return ExamplePunks;
}

export default useExaplePunks;