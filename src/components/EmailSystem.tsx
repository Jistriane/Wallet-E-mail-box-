import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Box,
  Button,
  VStack,
  Text,
  Input,
  Textarea,
  useToast,
  Container,
  Heading,
  Divider,
  List,
  ListItem,
  HStack,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

interface Email {
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: number;
  read: boolean;
  encrypted: boolean;
  hash: string;
}

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;
const ALCHEMY_URL = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
const CONTRACT_ADDRESS = import.meta.env.VITE_EMAIL_CONTRACT_ADDRESS;

const CONTRACT_ABI = [
  "function sendEmail(address to, string subject, string content) public returns (bool)",
  "function getInbox() public view returns (tuple(address from, address to, string subject, string content, uint256 timestamp, bool read, bool encrypted, bytes32 hash)[])",
  "function getSent() public view returns (tuple(address from, address to, string subject, string content, uint256 timestamp, bool read, bool encrypted, bytes32 hash)[])",
  "function getSpamList() public view returns (address[])",
  "function markAsRead(uint256 index) public returns (bool)",
  "function deleteEmail(uint256 index) public returns (bool)",
  "function addToSpam(address spammer) public returns (bool)",
  "function removeFromSpam(address addressToRemove) public returns (bool)",
  "function verifyEmailIntegrity(uint256 index) public view returns (bool)"
];

const EmailSystem: React.FC = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [inbox, setInbox] = useState<Email[]>([]);
  const [sent, setSent] = useState<Email[]>([]);
  const [spamList, setSpamList] = useState<string[]>([]);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [spamAddress, setSpamAddress] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    const initContract = async () => {
      try {
        if (!ALCHEMY_API_KEY || !CONTRACT_ADDRESS) {
          throw new Error('Configurações do contrato não encontradas. Verifique o arquivo .env');
        }

        // Verifica se o MetaMask está instalado
        if (!window.ethereum) {
          throw new Error('MetaMask não está instalado. Por favor, instale o MetaMask para continuar.');
        }

        // Verifica se o MetaMask está conectado à rede correta
        console.log('Verificando rede...');
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Chain ID:', chainId);
        
        const expectedChainId = import.meta.env.VITE_CHAIN_ID;
        console.log('Chain ID esperado:', expectedChainId);
        
        if (chainId !== `0x${Number(expectedChainId).toString(16)}`) {
          throw new Error(`Por favor, conecte-se à rede ${import.meta.env.VITE_NETWORK} no MetaMask.`);
        }

        // Solicita conexão com o MetaMask
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          if (error.code === 4001) {
            throw new Error('Por favor, autorize o acesso à sua carteira no MetaMask.');
          }
          throw error;
        }

        // Usa o provider do MetaMask
        console.log('Inicializando provider do MetaMask...');
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log('Provider inicializado');
        
        console.log('Obtendo signer...');
        const signer = await provider.getSigner();
        console.log('Signer obtido');
        
        // Verifica se o endereço do contrato é válido
        console.log('Endereço do contrato do .env:', CONTRACT_ADDRESS);
        if (!ethers.isAddress(CONTRACT_ADDRESS)) {
          throw new Error('Endereço do contrato inválido. Verifique o arquivo .env');
        }

        console.log('Tentando criar contrato com endereço:', CONTRACT_ADDRESS);
        
        // Verifica se o contrato existe na rede
        console.log('Verificando código do contrato...');
        const code = await provider.getCode(CONTRACT_ADDRESS);
        console.log('Código do contrato:', code);
        
        if (code === '0x') {
          console.log('Código do contrato vazio, tentando verificar rede...');
          const network = await provider.getNetwork();
          console.log('Rede atual:', network);
          console.log('Nome da rede:', network.name);
          console.log('Chain ID da rede:', network.chainId);
          console.log('Endereço do contrato verificado:', CONTRACT_ADDRESS);
          throw new Error('Contrato não encontrado neste endereço. Verifique se o contrato foi implantado corretamente.');
        }

        console.log('Contrato encontrado! Inicializando...');
        
        // Cria o contrato com o signer
        const emailContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(emailContract);
        
        const account = await signer.getAddress();
        console.log('Conta conectada:', account);
        
        // Testa as funções do contrato
        console.log('Testando funções do contrato...');
        const inboxEmails = await emailContract.getInbox();
        console.log('Inbox:', inboxEmails);
        
        const sentEmails = await emailContract.getSent();
        console.log('Sent:', sentEmails);
        
        const spamAddresses = await emailContract.getSpamList();
        console.log('Spam List:', spamAddresses);
        
        setInbox(inboxEmails);
        setSent(sentEmails);
        setSpamList(spamAddresses);
      } catch (error) {
        console.error('Erro ao inicializar contrato:', error);
        let errorMessage = 'Erro desconhecido';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        toast({
          title: 'Erro ao inicializar contrato',
          description: errorMessage,
          status: 'error',
          duration: 5000,
        });
      }
    };

    initContract();
  }, [toast]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) {
      alert('Por favor, conecte sua carteira primeiro.');
      return;
    }

    try {
      // Verifica se o endereço é válido
      if (!ethers.isAddress(recipientAddress)) {
        alert('Por favor, insira um endereço Ethereum válido (começa com 0x e tem 42 caracteres).');
        return;
      }

      const tx = await contract.sendEmail(recipientAddress, subject, content);
      await tx.wait();
      alert('E-mail enviado com sucesso!');
      setSubject('');
      setContent('');
      setRecipientAddress('');
      const inboxEmails = await contract.getInbox();
      const sentEmails = await contract.getSent();
      setInbox(inboxEmails);
      setSent(sentEmails);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      alert('Erro ao enviar e-mail. Verifique se o endereço do destinatário é válido e se você tem ETH suficiente para a transação.');
    }
  };

  const markAsRead = async (index: number) => {
    if (!contract) return;
    try {
      const tx = await contract.markAsRead(index);
      await tx.wait();
      
      const account = await contract.signer.getAddress();
      const inboxEmails = await contract.getInbox();
      setInbox(inboxEmails);
      
      toast({
        title: 'E-mail marcado como lido!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao marcar e-mail como lido',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const deleteEmail = async (index: number) => {
    if (!contract) return;
    try {
      const tx = await contract.deleteEmail(index);
      await tx.wait();
      
      const account = await contract.signer.getAddress();
      const inboxEmails = await contract.getInbox();
      setInbox(inboxEmails);
      
      toast({
        title: 'E-mail excluído com sucesso!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir e-mail',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const addToSpam = async () => {
    if (!contract || !spamAddress) return;
    try {
      const tx = await contract.addToSpam(spamAddress);
      await tx.wait();
      
      const account = await contract.signer.getAddress();
      const spamAddresses = await contract.getSpamList();
      setSpamList(spamAddresses);
      
      toast({
        title: 'Endereço adicionado à lista de spam!',
        status: 'success',
        duration: 3000,
      });
      
      setSpamAddress('');
    } catch (error) {
      toast({
        title: 'Erro ao adicionar à lista de spam',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const removeFromSpam = async (address: string) => {
    if (!contract) return;
    try {
      const tx = await contract.removeFromSpam(address);
      await tx.wait();
      
      const account = await contract.signer.getAddress();
      const spamAddresses = await contract.getSpamList();
      setSpamList(spamAddresses);
      
      toast({
        title: 'Endereço removido da lista de spam!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao remover da lista de spam',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const verifyEmailIntegrity = async (index: number) => {
    if (!contract) return;
    try {
      const account = await contract.signer.getAddress();
      const isValid = await contract.verifyEmailIntegrity(account, index);
      
      toast({
        title: isValid ? 'E-mail íntegro!' : 'E-mail modificado!',
        status: isValid ? 'success' : 'warning',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao verificar integridade',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6}>
        <Heading>Sistema de E-mail Web3</Heading>

        <Tabs w="100%">
          <TabList>
            <Tab>Enviar E-mail</Tab>
            <Tab>Caixa de Entrada</Tab>
            <Tab>E-mails Enviados</Tab>
            <Tab>Gerenciar Spam</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box w="100%">
                <Input
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Endereço do destinatário"
                  mb={2}
                />
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Assunto"
                  mb={2}
                />
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Conteúdo do e-mail"
                  mb={2}
                />
                <Button colorScheme="blue" onClick={handleSendEmail}>
                  Enviar
                </Button>
              </Box>
            </TabPanel>

            <TabPanel>
              <List spacing={3}>
                {inbox.map((email, index) => (
                  <ListItem key={index} p={4} borderWidth="1px" borderRadius="md">
                    <VStack align="start" spacing={2}>
                      <HStack>
                        <Text fontWeight="bold">De: {email.from}</Text>
                        {!email.read && <Badge colorScheme="green">Novo</Badge>}
                      </HStack>
                      <Text>Assunto: {email.subject}</Text>
                      <Text>Conteúdo: {email.content}</Text>
                      <HStack>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => markAsRead(index)}
                        >
                          Marcar como Lido
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => deleteEmail(index)}
                        >
                          Excluir
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="purple"
                          onClick={() => verifyEmailIntegrity(index)}
                        >
                          Verificar Integridade
                        </Button>
                      </HStack>
                    </VStack>
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            <TabPanel>
              <List spacing={3}>
                {sent.map((email, index) => (
                  <ListItem key={index} p={4} borderWidth="1px" borderRadius="md">
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold">Para: {email.to}</Text>
                      <Text>Assunto: {email.subject}</Text>
                      <Text>Conteúdo: {email.content}</Text>
                    </VStack>
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            <TabPanel>
              <Box w="100%">
                <Input
                  value={spamAddress}
                  onChange={(e) => setSpamAddress(e.target.value)}
                  placeholder="Endereço para adicionar à lista de spam"
                  mb={2}
                />
                <Button colorScheme="red" onClick={addToSpam} mb={4}>
                  Adicionar à Lista de Spam
                </Button>

                <List spacing={3}>
                  {spamList.map((address, index) => (
                    <ListItem key={index} p={4} borderWidth="1px" borderRadius="md">
                      <HStack justify="space-between">
                        <Text>{address}</Text>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => removeFromSpam(address)}
                        >
                          Remover
                        </Button>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default EmailSystem; 