import React, {FC, useEffect, useState} from 'react'
import { mintAnimalTokenContract } from '../contracts';
import { Grid } from '@chakra-ui/react';
import AnimalCard from '../components/AnimalCard';

interface MyAnimalProps{
    account: string;
}

const MyAnimal:FC<MyAnimalProps> = ({account}) => {
  
  const [animalCardArray, setAnimalCardArray] = useState<string[]>();
  
  const getAnimalTokens = async() => {
    try{
      const balanceLength = await mintAnimalTokenContract.methods
      .tokenOfOwnerByIndex(account, 1)
      .call();
      
      const tempAnimalCardArray = [];

      for(let i = 0; i<parseInt(balanceLength, 10); i++){
        const animalTokenId = await mintAnimalTokenContract.methods
        .tokenOfOwnerByIndex(account, i)
        .call();

        const animalType = await mintAnimalTokenContract.methods
        .animalTypes(animalTokenId)
        .call();

        tempAnimalCardArray.push(animalType);
      }

      setAnimalCardArray(tempAnimalCardArray);
    }catch(error){
      console.error(error);
    }
  };
  
  useEffect(() => {
    
    if(!account) return;  
    getAnimalTokens();
    
  },[]);

  useEffect(() => {
    console.log(animalCardArray)
  }, [animalCardArray]);

  //그리드를 통해 MYNFT 확인
  return (
    <Grid templateColumns = "repeat(4, 1fr)" gap={8}>
      {animalCardArray &&
        animalCardArray.map((v, i) => {
          return <AnimalCard key={i} animalType={v} />;
        })}
    </Grid>
  ) 
}

export default MyAnimal