import React, { useRef } from 'react';
import {
  AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
  AlertDialogOverlay, Button,
} from '@chakra-ui/react';

export default function ConfirmationDialog({ isOpen, onClose, onConfirm }) {
  const cancelRef = useRef();

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>New card?</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>Are you sure you want to reset all marked tiles?</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            No
          </Button>
          <Button colorScheme="red" ml={3} onClick={onConfirm}>
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
