import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import useExamplePunks from "../../hooks/useExamplePunks";
import { useCallback, useEffect, useState } from "react";

const Home = () => {
    const toast = useToast();
  const [isMinting, setIsMinting] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const { active, account } = useWeb3React();
  const examplePunks = useExamplePunks();

  const getexamplePunksData = useCallback(async () => {
    if (examplePunks) {
      const totalSupply = await examplePunks.methods.totalSupply().call();
      const dnaPreview = await examplePunks.methods
        .deterministicPseudoRandomDNA(totalSupply, account)
        .call();
      const image = await examplePunks.methods.imageByDNA(dnaPreview).call();
      setImageSrc(image);
    }
  }, [examplePunks, account]);

  useEffect(() => {
    getexamplePunksData();
  }, [getexamplePunksData]);

  const mint = () => {
    setIsMinting(true);
    examplePunks.methods
      .safeMint()
      .send({
        from: account,
        //value: 1e18
      })
      .on("transactionHash", (txHash) => {
        toast({
            title: 'Transaccion enviada',
            description: txHash,
            status: 'info'
        })
      })
      .on("receipt", () => {
        setIsMinting(false);
        toast({
            title: 'Transaccion confirmada',
            description: 'Never stop learning',
            status: 'success'
        })

      })
      .on("error", (error) => {
        setIsMinting(false);
        toast({
            title: 'Transaccion fallida',
            description: error.message,
            status: 'error'
        })

      });

  };

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "blue.400",
              zIndex: -1,
            }}
          >
            Un Example Punk
          </Text>
          <br />
          <Text as={"span"} color={"blue.400"}>
            nunca para de aprender
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          Example Punk es una colección de Avatares randomizados cuya metadata
          es almacenada on-chain. Poseen características únicas y sólo hay 10000
          en existencia.
        </Text>
        <Text color={"blue.500"}>
          Cada example Punk se genera de forma secuencial basado en tu address,
          usa el previsualizador para averiguar cuál sería tu example Punk si
          minteas en este momento
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"blue"}
            bg={"blue.400"}
            _hover={{ bg: "blue.500" }}
            disabled={!examplePunks}
            onClick={mint}
            isLoading={isMinting}
          >
            Obtén tu punk
          </Button>
          <Link to="/punks">
            <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
              Galería
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        <Image src={active ? imageSrc : "https://avataaars.io/"} />
        {active ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="blue">
                  1
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="blue">
                  0x0000...0000
                </Badge>
              </Badge>
            </Flex>
            <Button
              onClick={getexamplePunksData}
              mt={4}
              size="xs"
              colorScheme="blue"
            >
              Actualizar
            </Button>
          </>
        ) : (
          <Badge mt={2}>Wallet desconectado</Badge>
        )}
      </Flex>
    </Stack>
  );
};

export default Home;
