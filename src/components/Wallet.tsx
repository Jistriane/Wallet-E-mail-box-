import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Box,
  Button,
  VStack,
  Text,
  Input,
  Container,
  Heading,
  Textarea,
  useToast,
  Divider,
} from '@chakra-ui/react';
import * as bip39 from 'bip39';

const MULTIVERSX_API_URL = import.meta.env.VITE_MULTIVERSX_API_URL;

interface WalletError {
  message: string;
}

const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<ethers.HDNodeWallet | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [messageToSign, setMessageToSign] = useState<string>('');
  const [signedMessage, setSignedMessage] = useState<string>('');
  const [rawTransaction, setRawTransaction] = useState<string>('');
  const [signedTransaction, setSignedTransaction] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (window.multiversx) {
        const accounts = await window.multiversx.request({ method: 'mvx_accounts' });
        setIsConnected(accounts.length > 0);
      }
    };

    checkConnection();

    if (window.multiversx) {
      window.multiversx.on('accountsChanged', (accounts: string[]) => {
        setIsConnected(accounts.length > 0);
        if (accounts.length === 0) {
          setWallet(null);
          setBalance('0');
        }
      });
    }

    return () => {
      if (window.multiversx) {
        window.multiversx.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.multiversx) {
        throw new Error('MultiversX Wallet não está instalado');
      }

      const accounts = await window.multiversx.request({ method: 'mvx_requestAccounts' });
      if (accounts.length > 0) {
        setIsConnected(true);
        toast({
          title: 'Carteira conectada!',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.multiversx) {
        await window.multiversx.request({
          method: 'mvx_revokePermissions',
          params: [{ mvx_accounts: {} }],
        });
        setIsConnected(false);
        setWallet(null);
        setBalance('0');
        toast({
          title: 'Carteira desconectada!',
          status: 'info',
          duration: 3000,
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    toast({
      title: 'Erro',
      description: errorMessage,
      status: 'error',
      duration: 3000,
    });
  };

  const createWallet = () => {
    try {
      const newWallet = ethers.Wallet.createRandom();
      setWallet(newWallet);
      const mnemonic = newWallet.mnemonic?.phrase;
      if (mnemonic) {
        toast({
          title: 'Carteira criada com sucesso!',
          description: `Sua seed phrase é: ${mnemonic}. Guarde-a em um lugar seguro!`,
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const importFromSeed = () => {
    try {
      if (!seedPhrase.trim()) {
        throw new Error('Por favor, insira uma seed phrase');
      }

      const words = seedPhrase.trim().split(/\s+/);
      if (words.length !== 12) {
        throw new Error('A seed phrase deve conter exatamente 12 palavras');
      }

      if (!bip39.validateMnemonic(seedPhrase)) {
        throw new Error('Seed phrase inválida. Verifique se as palavras estão corretas e na ordem certa');
      }

      const wallet = ethers.Wallet.fromPhrase(seedPhrase);
      setWallet(wallet);
      toast({
        title: 'Carteira importada com sucesso!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const checkBalance = async () => {
    if (!wallet || !MULTIVERSX_API_URL) return;
    try {
      const response = await fetch(`${MULTIVERSX_API_URL}/accounts/${wallet.address}`);
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      handleError(error);
    }
  };

  const sendTransaction = async () => {
    if (!wallet || !recipientAddress || !amount || !MULTIVERSX_API_URL) return;
    try {
      const transaction = {
        nonce: 0,
        value: amount,
        receiver: recipientAddress,
        sender: wallet.address,
        gasPrice: 1000000000,
        gasLimit: 50000,
        chainID: 'D',
        version: 1,
      };

      const response = await fetch(`${MULTIVERSX_API_URL}/transaction/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      const data = await response.json();
      toast({
        title: 'Transação enviada com sucesso!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const signMessage = async () => {
    if (!wallet || !messageToSign) return;
    try {
      const signature = await window.multiversx?.request({
        method: 'mvx_signMessage',
        params: [messageToSign],
      });
      setSignedMessage(signature);
      toast({
        title: 'Mensagem assinada com sucesso!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6}>
        <Heading>MultiversX Wallet</Heading>
        
        {!isConnected ? (
          <Button colorScheme="blue" onClick={connectWallet}>
            Conectar Carteira
          </Button>
        ) : (
          <Button colorScheme="red" onClick={disconnectWallet}>
            Desconectar Carteira
          </Button>
        )}

        <Button colorScheme="blue" onClick={createWallet}>
          Criar Nova Carteira
        </Button>

        <Box w="100%">
          <Text mb={2}>Importar de Seed Phrase:</Text>
          <Input
            value={seedPhrase}
            onChange={(e) => setSeedPhrase(e.target.value)}
            placeholder="Digite sua seed phrase (12-24 palavras)"
          />
          <Button mt={2} colorScheme="green" onClick={importFromSeed}>
            Importar
          </Button>
        </Box>

        {wallet && (
          <>
            <Box w="100%">
              <Text>Endereço da Carteira:</Text>
              <Text fontSize="sm" isTruncated>
                {wallet.address}
              </Text>
            </Box>

            <Button colorScheme="purple" onClick={checkBalance}>
              Verificar Saldo
            </Button>

            <Text>Saldo: {balance} EGLD</Text>

            <Box w="100%">
              <Text mb={2}>Enviar EGLD:</Text>
              <Input
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Endereço do destinatário"
                mb={2}
              />
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Quantidade em EGLD"
                type="number"
                step="0.000000000000000001"
              />
              <Button mt={2} colorScheme="red" onClick={sendTransaction}>
                Enviar
              </Button>
            </Box>

            <Divider />
            
            <Box w="100%">
              <Heading size="md" mb={4}>Assinatura de Mensagens</Heading>
              <Textarea
                value={messageToSign}
                onChange={(e) => setMessageToSign(e.target.value)}
                placeholder="Digite a mensagem para assinar"
                mb={2}
              />
              <Button colorScheme="blue" onClick={signMessage}>
                Assinar Mensagem
              </Button>
              {signedMessage && (
                <Box mt={2}>
                  <Text>Assinatura:</Text>
                  <Text fontSize="sm" isTruncated>
                    {signedMessage}
                  </Text>
                </Box>
              )}
            </Box>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Wallet; 