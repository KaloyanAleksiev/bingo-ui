import React, { Fragment, useState } from 'react';
import {
  Button, Card, CardBody, CardFooter, CardHeader, Flex, FormControl, FormLabel, Grid, GridItem, Heading, Input,
  useDisclosure, useToast,
} from '@chakra-ui/react';
import { bingoSize, freeIndex, minValue, maxValue } from '../Config';
import { validateNumber, submitScore } from '../API';
import NameEntry from './NameEntry';
import ConfirmationDialog from './ConfirmationDialog';

const defaultCellState = {
  number: 0,
  isLoading: false,
  isValid: false,
};

const generateRandomNumbers = () => {
  const numbersSet = new Set();
  while (numbersSet.size <= bingoSize) {
    numbersSet.add(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
  }
  return Array.from(numbersSet);
};

const generateShareableURL = (stateBingo) => {
  const markingsString = JSON.stringify(stateBingo);
  const identifier = btoa(markingsString);
  return `${window.location.origin}/shared/${identifier}`;
};

const startNewGame = () => {
  localStorage.clear();
  window.location.reload();
}

export default function Bingo() {
  const { isOpen: isResetDialogOpen, onOpen: openResetDialog, onClose: closeResetDialog } = useDisclosure();
  const [name, setName] = useState(localStorage.getItem('name') ?? '');
  const toast = useToast();
  const [stateBingo, setBingo] = useState(JSON.parse(localStorage.getItem('bingo')) ?? Array.from(Array(25)).map(() => defaultCellState));

  const regenerateNumbers = () => {
    stateBingo.filter(cell => cell.isValid).length > 0 ? openResetDialog() : regeneration();
  };

  const regeneration = () => {
    setBingo(generateRandomNumbers().map((number, index) => ({
      ...defaultCellState,
      number,
    })));
    closeResetDialog();
  };

  const onClick = async (event, cell) => {
    setBingo(currentBingoState => currentBingoState.map((currentCell, index) =>
      index === freeIndex ? currentCell : { ...currentCell, isLoading: true },
    ));

    const result = await validateNumber(cell.number);

    if (result.errors) {
      toast({
        title: 'Number Validation Failed.',
        description: Object.keys(result.errors).map((key) => key + ': ' + result.errors[key]),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    const newBingoState = stateBingo.map((currentCell, index) =>
      index === freeIndex ? currentCell :
        {
          ...currentCell,
          isLoading: false,
          isValid: currentCell.number !== cell.number ? currentCell.isValid : result.validate,
        },
    );

    setBingo(newBingoState);

    localStorage.setItem('bingo', JSON.stringify(newBingoState));

    if (newBingoState.filter((cell, index) => index !== freeIndex && cell.isValid).length === bingoSize) {
      await saveScore();
    }
  };

  const saveScore = async () => {
    setBingo(currentBingoState => currentBingoState.map((cell, index) =>
      index === freeIndex ? cell : { ...cell, isLoading: true },
    ));

    const result = await submitScore(name, stateBingo.filter((cell, index) => index !== freeIndex).map(cell => cell.number));

    setBingo(currentBingoState => currentBingoState.map((cell, index) =>
      index === freeIndex ? cell : { ...cell, isLoading: false },
    ));

    if (result.errors || result.error) {
      toast({
        title: 'Score Validation or Store Failed',
        description: result.error ?? Object.keys(result.errors).map((key, message) => key + ': ' + result.errors[key]),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    window.location.href = '/leaderboard';
  };

  if (!name && !localStorage.getItem('name'))
    return <NameEntry onSaveName={stringName => (setName(stringName))} />;
  return (
    <Fragment>
      <Card variant="filled">
        <CardHeader><Heading size="xl">Bingo</Heading></CardHeader>
        <CardBody>
          <Grid textAlign="center" fontSize="xl" templateColumns="repeat(5, 1fr)" gap={3}>
            {stateBingo.map((cell, idx) => idx === freeIndex ? 'FREE' :
              <GridItem key={idx} w="100%" h="10">
                <Button w="100%"
                        colorScheme={cell.isValid ? 'green' : 'blue'}
                        isLoading={cell.isLoading}
                        isDisabled={!cell.number}
                        onClick={(ev) => onClick(ev, cell)}>
                  {!cell.number ? <>&nbsp;</> : cell.number.toString()}
                </Button>
              </GridItem>,
            )}
          </Grid>
        </CardBody>
        <CardFooter display={'flex'} justifyContent={'center'}>
          <Button w="250px" padding="10px" colorScheme="blue" onClick={regenerateNumbers}>Generate</Button>
          <Button w="250px" padding="10px" ml={'20px'} colorScheme="green" onClick={startNewGame}>New Game</Button>
        </CardFooter>
      </Card>

      <Flex direction="column" alignItems="center" mt="4">
        <FormControl>
          <FormLabel>Shareable URL:</FormLabel>
          <Input type="text" value={generateShareableURL(stateBingo)} readOnly />
        </FormControl>
      </Flex>

      <ConfirmationDialog isOpen={isResetDialogOpen} onClose={closeResetDialog} onConfirm={regeneration} />
    </Fragment>
  );
}
