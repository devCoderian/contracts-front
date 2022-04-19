import React, {FC, useEffect, useState} from 'react'
import {Grid} from '@chakra-ui/react';
import { IMyAnimalCard } from '../components/MyAnimalCard';
import { mintAnimalTokenContract, saleAnimalTokenContract } from '../web3Config';
import SaleAnimalCard from '../components/SaleAnimalCard';

interface SaleAnimalProps{
  account: string;
}

const SaleAnimal:FC<SaleAnimalProps> = ({account}) => {
  
  const [saleAnimalCardArray, setSaleAnimalCardArray]=useState<IMyAnimalCard[]>();

  const tempOnSaleArray:IMyAnimalCard[] = [];

  const getOnSaleAnimalTokens = async () => {
    try {
      const onSaleAnimalTokenArrayLength = await saleAnimalTokenContract.methods
      .getOnSaleAnimalTokenArrayLength()
      .call();

      for(let i = 0; i < parseInt(onSaleAnimalTokenArrayLength, 10); i++){
        //루프로 토큰 아이디 get - order
        const animalTokenId = await saleAnimalTokenContract.methods.onSaleAnimalTokenArray(i).call(); 
        
        const animalType = await mintAnimalTokenContract.methods.animalTypes(animalTokenId).call();

        const animalPrice = await saleAnimalTokenContract.methods.animalTokenPrices(animalTokenId).call();

        tempOnSaleArray.push({
          animalTokenId, animalType, animalPrice
        });
        console.log('tempOnSaleArray', tempOnSaleArray);
        setSaleAnimalCardArray([...tempOnSaleArray]);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    console.log('[판매카드 로직 시작]')
    getOnSaleAnimalTokens();
  },[]);

  useEffect(() => {
    console.log('[판매카드]');
    console.log(saleAnimalCardArray);
  },[saleAnimalCardArray]);


  return (

    <Grid mt ={4} templateColumns="repeat(4, 1fr)" gap={8}>
      {saleAnimalCardArray &&
        saleAnimalCardArray.map((v, i) => {

          console.log('array확인', v);
          return (
            <SaleAnimalCard
              key={i}
              animalType={v.animalType}
              animalPrice={v.animalPrice}
              animalTokenId={v.animalTokenId}
              account={account}
              getOnSaleAnimalTokens={getOnSaleAnimalTokens}
            />
          );
        })}
    </Grid>
  )
}

export default SaleAnimal;