# Wallet Web3

Uma carteira Web3 moderna e segura para gerenciamento de ativos digitais.

## Características

- Interface moderna e responsiva
- Suporte a múltiplas redes Ethereum
- Gerenciamento seguro de chaves privadas
- Integração com MetaMask
- Suporte a tokens ERC-20
- Histórico de transações
- Backup e recuperação de carteira

## Requisitos

- Node.js 18+
- npm 9+
- MetaMask (opcional)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/wallet-web3.git
cd wallet-web3
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse a aplicação em `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código com Prettier

## Estrutura do Projeto

```
wallet-web3/
├── public/          # Arquivos estáticos
├── src/             # Código fonte
│   ├── components/  # Componentes React
│   ├── hooks/       # Hooks personalizados
│   ├── services/    # Serviços e APIs
│   ├── styles/      # Estilos CSS
│   ├── types/       # Definições de tipos
│   ├── utils/       # Funções utilitárias
│   ├── App.tsx      # Componente principal
│   └── main.tsx     # Ponto de entrada
├── .env             # Variáveis de ambiente
├── package.json     # Dependências e scripts
├── tsconfig.json    # Configuração do TypeScript
└── vite.config.ts   # Configuração do Vite
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Segurança

- Nunca compartilhe suas chaves privadas
- Mantenha seu navegador e extensões atualizadas
- Use autenticação de dois fatores quando possível
- Faça backup regular de suas carteiras 