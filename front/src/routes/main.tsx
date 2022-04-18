import React, {FC, useState} from "react";
import {Box, Text, Flex, Button} from '@chakra-ui/react';
import { mintAnimalTokenContract } from "../web3Config";
import AnimalCard from "../components/AnimalCard";

interface MainProps {
    account: string;
}



//props interface
const Main: FC<MainProps> = ({ account }) => {
    const [newAnimalType, setNewAnimalType] = useState<string>();
    const onClickMint =async() => {
        try {
            console.log("민팅 요청")
            if(!account) return;
            const res = await mintAnimalTokenContract.methods
            .mintAnimalToken()
            .send({from: account}); 

            console.log(res); 

            //계좌 조회후 가장 최근의 인덱스를 조회해서
            //인덱스에 해당하는 애니멀 타입을 가져와서
            if(res.status){
                const balanceLength = await mintAnimalTokenContract.methods
                .balanceOf(account)
                .call();

                const animalTokenId = await mintAnimalTokenContract.methods
                .tokenOfOwnerByIndex(account, parseInt(balanceLength.length, 10)-1)
                .call();

                const animalType = await mintAnimalTokenContract.methods
                .animalTypes(animalTokenId)
                .call();

                setNewAnimalType(animalType); 
            }
        } catch (error) {
                console.log(error);
        }
    }
    return( 
    <Flex
    w="full"
    h="100vh"
    justifyContent = "center"
    alignItems= "center"
    direction = "column">
    <Box>
        {newAnimalType ? (
            <AnimalCard animalType={newAnimalType} /> 
        ) : (
        <Text>Let'mint</Text>
        )}
    </Box>
    <Button mt={4} size="sm" colorScheme="blue" onClick={onClickMint}> 
        Mint
    </Button>
    </Flex>
    ) 
}

export default Main;