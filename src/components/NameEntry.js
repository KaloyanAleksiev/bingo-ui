import React, { useRef } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@chakra-ui/react';

const NameEntry = ({ onSaveName }) => {
  const nameRef = useRef();

  const handleSaveName = () => {
    const stringName = nameRef.current.value;
    localStorage.setItem('name', stringName);
    onSaveName(stringName);
  };

  return (
    <Card>
      <CardHeader>Enter Your Name:</CardHeader>
      <CardBody>
        <Input type="text" ref={nameRef} />
      </CardBody>
      <CardFooter>
        <Button w="250px" padding="10px" margin-top="20px" colorScheme="blue" onClick={handleSaveName}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NameEntry;
