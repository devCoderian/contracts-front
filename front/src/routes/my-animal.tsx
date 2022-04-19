import React, {FC, useEffect, useState} from 'react'
import { mintAnimalTokenContract, saleAnimalTokenContract, saleAnimalTokenAddress } from "../web3Config";
import { Grid, Box, Text, Button, Flex} from '@chakra-ui/react';
import AnimalCard from '../components/AnimalCard';
import MyAnimalCard, { IMyAnimalCard } from '../components/MyAnimalCard';

interface MyAnimalProps{
    account: string;
}

const MyAnimal:FC<MyAnimalProps> = ({account}) => {
  
  // console.log('accccoccccunt', account)
  // const [animalCardArray, setAnimalCardArray] = useState<string[]>(); 
  //AnimalCard -> MYAnimalCard로 변경
  const [animalCardArray, setAnimalCardArray] = useState<IMyAnimalCard[]>();  
  //판매 가능 상태인지 표기
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  //내가 가진 토큰 가져오기
  const getAnimalTokens = async () => {
   
    try{   
      const balanceLength = await mintAnimalTokenContract.methods
      .balanceOf(account)
      .call();
      
      //0일 경우 실행
      if(balanceLength === "0") return;

      const tempAnimalCardArray = [];

      //민팅했을때와는 다르게 제일 최근민팅이 아니라 들고 오는게 아니라 for문 돌려서 전체 민팅한 갯수 가져오기
      //balanceLength가 string으로 들어오기 때문에 int형 변환
      // console.log(at); 
      for(let i = 0;  i< parseInt(balanceLength, 10); i++){
        //tokenId를 하나씩 가져오기 => tokenOfOwnerByIndex(주소, 인덱스 번호)로 nftId를 가져온다.
        const animalTokenId = await mintAnimalTokenContract.methods
        .tokenOfOwnerByIndex(account, i)
        .call();
        //type을 가져온다.
        const animalType = await mintAnimalTokenContract.methods
        .animalTypes(animalTokenId)
        .call();

        //판매 등록 확인하기
        const animalPrice = await saleAnimalTokenContract.methods
        .animalTokenPrices(animalTokenId)
        .call();

        console.log('animalPrice', animalPrice);
        // tempAnimalCardArray.push(animalType);
        tempAnimalCardArray.push({animalPrice, animalType, animalTokenId});
      }
      setAnimalCardArray(tempAnimalCardArray);
    }catch(error){
      console.error(error);
    }
  };
  
  const getIsApprovedForAll = async () => {
    try {
      
      //위임 권한 확인 함수
      const response = await mintAnimalTokenContract.methods.isApprovedForAll(account, saleAnimalTokenAddress).call();
      console.log('위임 결과 확인', response);
      if(response){
        setSaleStatus(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {    
    if(!account) return;  
    getAnimalTokens();
    getIsApprovedForAll();

  },[account]);

  useEffect(() => {
    console.log('animalCardArray', animalCardArray);
  }, [animalCardArray]);

  const onClickToggle = async() => {
    console.log("[위임 권한 toggle check]");
    // setSaleStatus(!saleStatus);
    try {
      if(!account) return;
      const response = await mintAnimalTokenContract.methods
      .setApprovalForAll(saleAnimalTokenAddress, !saleStatus)
      // setApprovedForAll
      .send({ from: account });
      console.log('response', response);
      if(response.status){
      // toggle
        setSaleStatus(!saleStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <Flex alignItems = "center">
      <Text display="inline-block">Sale Status: {saleStatus? "true": "false"}</Text>
      {/* 위임 권한 버튼 */}
      <Button size="xs" ml={2} colorScheme={saleStatus? "red" :"blue"} onClick={onClickToggle}>{
      saleStatus? "Cancle" : "Approve"
      }</Button>
    </Flex>
    <Grid templateColumns = "repeat(4, 1fr)" gap={8}>
      {animalCardArray &&
        animalCardArray.map((v, i) => {
          console.log('animalCardArray', v);  
        // return <AnimalCard key={i} animalType={v} />;
        // AnimalCard ->  MyAnimalCard => type Interface:string -> IMyAnimalCard 변경, animalCardArray 변경
          return (<MyAnimalCard 
                  key = {i}
                  animalTokenId = {v.animalTokenId}
                  animalPrice = {v.animalPrice} 
                  animalType ={v.animalType}
                  saleStatus={saleStatus}
                  account={account}
                  />)
        })}
    </Grid>
    </>
  ) 
}

export default MyAnimal