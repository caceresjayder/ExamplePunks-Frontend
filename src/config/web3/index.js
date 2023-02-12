import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3/dist/web3.min";

const connector = new InjectedConnector({
    supportedChainIds: [
        5 // goerli
    ]
})

const getLibrary = (provider) => {
    return new Web3(provider)
}

export {getLibrary, connector};