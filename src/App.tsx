import React from 'react';
import { ChakraProvider, Container, Stack } from '@chakra-ui/react';
import theme from './theme';
import Wallet from './components/Wallet';
import EmailSystem from './components/EmailSystem';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.xl" py={8}>
        <Stack spacing={8}>
          <Wallet />
          <EmailSystem />
        </Stack>
      </Container>
    </ChakraProvider>
  );
};

export default App; 