import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { freeIndex } from '../Config';

const BingoChecker = ({ markings }) => {
  const [bingoMarkings, setBingoMarkings] = useState([]);

  useEffect(() => {
    try {
      const decodedMarkings = atob(markings);
      const parsedMarkings = JSON.parse(decodedMarkings);
      setBingoMarkings(parsedMarkings);
    } catch (error) {
      console.error('Error with bingo markings:', error);
    }
  }, [markings]);

  return (
    <Card variant="filled">
      <CardHeader>
        <Heading size="xl">Bingo Checker</Heading>
      </CardHeader>
      <CardBody>
        <Grid textAlign="center" fontSize="xl" templateColumns="repeat(5, 1fr)" gap={6}>
          {bingoMarkings.map((cell, idx) =>  idx === freeIndex  ? 'FREE' :
            <GridItem key={idx} w="100%" h="10">
              <Button w="100%" colorScheme={cell.isValid ? 'green' : 'blue'} disabled>
                {cell.number.toString()}
              </Button>
            </GridItem>
          )}
        </Grid>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default BingoChecker;