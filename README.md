# MultiversX Wallet

Uma carteira web para a rede MultiversX (antiga Elrond).

## Requisitos

- Node.js 18 ou superior
- npm ou yarn
- MultiversX Wallet instalada no navegador

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/multiversx-wallet.git
cd multiversx-wallet
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
VITE_MULTIVERSX_API_URL=https://api.multiversx.com
VITE_NETWORK=devnet
VITE_CHAIN_ID=D
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Funcionalidades

- Conectar/desconectar carteira MultiversX
- Criar nova carteira
- Importar carteira existente usando seed phrase
- Verificar saldo
- Enviar transações
- Assinar mensagens

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- Chakra UI
- MultiversX SDK

## Licença

MIT