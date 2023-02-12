import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import useExamplePunks from "../useExamplePunks";

const getPunkData = async ({ examplePunks, tokenId }) => {
  const [
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    examplePunks.methods.tokenURI(tokenId).call(),
    examplePunks.methods.tokenDNA(tokenId).call(),
    examplePunks.methods.ownerOf(tokenId).call(),
    examplePunks.methods.getAccessoriesType(tokenId).call(),
    examplePunks.methods.getAccessoriesType(tokenId).call(),
    examplePunks.methods.getClotheColor(tokenId).call(),
    examplePunks.methods.getClotheType(tokenId).call(),
    examplePunks.methods.getEyeType(tokenId).call(),
    examplePunks.methods.getEyeBrowType(tokenId).call(),
    examplePunks.methods.getFacialHairColor(tokenId).call(),
    examplePunks.methods.getFacialHairType(tokenId).call(),
    examplePunks.methods.getHairColor(tokenId).call(),
    examplePunks.methods.getHatColor(tokenId).call(),
    examplePunks.methods.getGraphicType(tokenId).call(),
    examplePunks.methods.getMouthType(tokenId).call(),
    examplePunks.methods.getSkinColor(tokenId).call(),
    examplePunks.methods.getTopType(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
};

// Plural
const useExamplePunksData = ({ owner = null } = {}) => {
  const [punks, setPunks] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const examplePunks = useExamplePunks();

  const update = useCallback(async () => {
    if (examplePunks) {
      setLoading(true);

      let tokenIds;

      if (!library.utils.isAddress(owner)) {
        const totalSupply = await examplePunks.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply))
          .fill()
          .map((_, index) => index);
      } else {
        const balanceOf = await examplePunks.methods.balanceOf(owner).call();

        const tokenIdsOfOwner = new Array(Number(balanceOf))
          .fill()
          .map((_, index) =>
            examplePunks.methods.tokenOfOwnerByIndex(owner, index).call()
          );

        tokenIds = await Promise.all(tokenIdsOfOwner);
      }

      const punksPromise = tokenIds.map((tokenId) =>
        getPunkData({ tokenId, examplePunks })
      );

      const punks = await Promise.all(punksPromise);

      setPunks(punks);
      setLoading(false);
    }
  }, [examplePunks, owner, library?.utils]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punks,
    update,
  };
};

// Singular
const useExamplePunkData = (tokenId = null) => {
  const [punk, setPunk] = useState({});
  const [loading, setLoading] = useState(true);
  const examplePunks = useExamplePunks();

  const update = useCallback(async () => {
    if (examplePunks && tokenId != null) {
      setLoading(true);

      const toSet = await getPunkData({ tokenId, examplePunks });
      setPunk(toSet);

      setLoading(false);
    }
  }, [examplePunks, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punk,
    update,
  };
};

export { useExamplePunksData, useExamplePunkData };
