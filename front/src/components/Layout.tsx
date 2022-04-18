import React, {FC} from 'react'
import {Stack, Flex, Box, Text, Button} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Layout:FC = ({children}) => {
  return (
    <Stack h="100vh">
        {/* header start */}
        <Flex bg="blue.200" 
        p={4} 
        justifyContent="space-around"
        alignItems={"center"}>
            <Box>
                <Text fontWeight="bold">openMarket</Text>
            </Box>
            <Link to = "/">
                <Button size={"sm"} colorScheme="blue">
                    Main
                </Button>
            </Link>
            <Link to ="my-animal">
                <Button size="xs" colorScheme={"red"}>
                    MyNFT
                </Button>
            </Link>
            <Link to ="sale-animal">
                <Button size="xs" colorScheme={"red"}>
                    BrowseNFT
                </Button>
            </Link>
        </Flex>
        {/* header end */}
        {/* main start */}
    <Flex
        direction={"column"}
        h="full"
        justifyContent={"center"}
        alignItems={"center"}
    > 
    {children}
    </Flex>
    {/* main end */}
    </Stack>
  )
}

export default Layout