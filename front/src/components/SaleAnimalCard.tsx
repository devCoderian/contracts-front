import { Box, Button, Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import {
  mintAnimalTokenContract,
  saleAnimalTokenContract,
  web3,
} from "../web3Config";
import AnimalCard from "./AnimalCard";


// getOnSaleAnimalTokens 함수 처리때문에 새로 타입 지정 필요
// 블록체인 통신 함수: getOnSaleAnimalTokens
interface SaleAnimalCardProps {
  animalType: string;
  animalPrice: string;
  animalTokenId: string;
  account: string;
  getOnSaleAnimalTokens: () => Promise<void>;
}

const SaleAnimalCard: FC<SaleAnimalCardProps> = ({
  animalType,
  animalPrice,
  animalTokenId,
  account,
  getOnSaleAnimalTokens,
}) => {

//계정이 같으면 구매 불가
  const [isBuyable, setIsBuyable] = useState<boolean>(false);

  const getAnimalTokenOnwer = async () => {
    try {
        //tokenId로 owner 주소 체크
        const response = await mintAnimalTokenContract.methods
        .ownerOf(animalTokenId)
        .call();

      console.log('넘어온 계정 주소', account.toLocaleLowerCase(), typeof account);
      console.log('nft owner', response.toLocaleLowerCase(), typeof account);
        
      setIsBuyable(
        response.toLocaleLowerCase() === account.toLocaleLowerCase()
      );
    } catch (error) {
      console.error(error);
    }
  };

  //구매 로직
  const onClickBuy = async () => {
    try {
      if (!account) return;

      const response = await saleAnimalTokenContract.methods
        .purchaseAnimalToken(animalTokenId)
        .send({ from: account, value: animalPrice });

        console.log('[purchaseAnimalToken]', response);

    if (response.status) {
        getOnSaleAnimalTokens();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAnimalTokenOnwer();
  }, []);

  return (
    <Box textAlign="center" w={150}>
      <AnimalCard animalType={animalType} />
      <Box>
        <Text d="inline-block">{web3.utils.fromWei(animalPrice)} Matic</Text>
        <Button
          size="sm"
          colorScheme="green"
          m={2}
          disabled={isBuyable}
          onClick={onClickBuy}
        >
          Buy
        </Button>
      </Box>
    </Box>
  );
};

export default SaleAnimalCard;