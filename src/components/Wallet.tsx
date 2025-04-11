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

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;
const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

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
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setIsConnected(accounts.length > 0);
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setIsConnected(accounts.length > 0);
        if (accounts.length === 0) {
          setWallet(null);
          setBalance('0');
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask não está instalado');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
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
      // Gerar e mostrar a seed phrase
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
    if (!wallet || !ALCHEMY_API_KEY) return;
    try {
      const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
      const balance = await provider.getBalance(wallet.address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      handleError(error);
    }
  };

  const sendTransaction = async () => {
    if (!wallet || !recipientAddress || !amount || !ALCHEMY_API_KEY) return;
    try {
      const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
      const connectedWallet = wallet.connect(provider);
      const tx = await connectedWallet.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(amount),
      });
      await tx.wait();
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
      const signature = await wallet.signMessage(messageToSign);
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

  const createOfflineTransaction = async () => {
    if (!wallet || !recipientAddress || !amount || !ALCHEMY_API_KEY) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos necessários',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
      const nonce = await provider.getTransactionCount(wallet.address);
      const gasPrice = await provider.getFeeData();
      
      const tx = {
        to: recipientAddress,
        value: ethers.parseEther(amount),
        nonce,
        gasPrice: gasPrice.gasPrice,
        gasLimit: ethers.parseUnits('21000', 'wei'),
        chainId: 1, // Ethereum Mainnet
      };

      const signedTx = await wallet.signTransaction(tx);
      setRawTransaction(signedTx);
      
      toast({
        title: 'Transação assinada com sucesso!',
        description: 'A transação está pronta para ser enviada',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const sendSignedTransaction = async () => {
    if (!rawTransaction || !ALCHEMY_API_KEY) {
      toast({
        title: 'Erro',
        description: 'Nenhuma transação assinada disponível',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
      const tx = await provider.broadcastTransaction(rawTransaction);
      await tx.wait();
      
      setSignedTransaction(tx.hash);
      toast({
        title: 'Transação enviada com sucesso!',
        description: `Hash: ${tx.hash}`,
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6}>
        <Heading>Wallet Web3</Heading>
        
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

            <Text>Saldo: {balance} ETH</Text>

            <Box w="100%">
              <Text mb={2}>Enviar ETH:</Text>
              <Input
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Endereço do destinatário"
                mb={2}
              />
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Quantidade em ETH"
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

            <Divider />

            <Box mt={4}>
              <Heading size="md">Transações Off-line</Heading>
              <VStack spacing={4} mt={2}>
                <Input
                  placeholder="Endereço do destinatário"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
                <Input
                  placeholder="Quantidade (ETH)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button colorScheme="blue" onClick={createOfflineTransaction}>
                  Criar Transação Off-line
                </Button>
              </VStack>
              {rawTransaction && (
                <Box mt={2}>
                  <Text>Transação Assinada:</Text>
                  <Text fontSize="sm" isTruncated>
                    {rawTransaction}
                  </Text>
                </Box>
              )}
              {rawTransaction && (
                <Button mt={2} colorScheme="green" onClick={sendSignedTransaction}>
                  Enviar Transação
                </Button>
              )}
              {signedTransaction && (
                <Box mt={2}>
                  <Text>Transação Enviada:</Text>
                  <Text fontSize="sm" isTruncated>
                    {signedTransaction}
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