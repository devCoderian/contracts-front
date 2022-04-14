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
        <Text>Let'mint Animal</Text>
        )}
    </Box>
    <Button mt={4} size="sm" colorScheme="blue" onClick={onClickMint}> 
        Mint
    </Button>
    </Flex>
    ) 
}

export default Main;