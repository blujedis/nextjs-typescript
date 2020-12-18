import { Box, Button, Container, Divider, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"

const ChakraExample = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <header style={{ margin: '1rem 0' }}>
        <Container>
          <Box bg="tomato" w="100%" p={4} color="white">
            <Heading>
              Chakra Example
          </Heading>
          </Box>
        </Container>
      </header>
      <main >
        <Container>
          <p>If this doesn't look right ensure you have run <code>yarn addon chakra</code> and have imported Chakra and uncommented in <strong>providers/index.tsx</strong></p>
          <Divider mt={8} mb={8} />
          <Button colorScheme="blue" onClick={onOpen}>Show Modal</Button>
        </Container>
      </main>
      <footer style={{ position: 'fixed', width: '100%', bottom: 0, textAlign: 'center', padding: '1rem 0' }}>
        <Container>
          <span>&copy; 2020 Your Company Here | Blujedis</span>
        </Container>
      </footer>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Hello Modal
        </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Just some modal body content.
            </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
          </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );

}

export default ChakraExample;