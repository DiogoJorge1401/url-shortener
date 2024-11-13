# API de encurtador de URL

Uma API encurtadora de URL utilizando NestJS com autenticação de usuário e gerenciamento de URL.

## Características

- Cadastro e autenticação de usuários
- Encurtamento de URL (autenticado e anônimo)
- Gerenciamento de URL (listar, atualizar, excluir) para usuários autenticados
- Rastreamento de cliques para URLs encurtados
- Documentação do Swagger
- Suporte Docker

## Pré-requisitos

- Node.js (v18 ou posterior)
- Docker e Docker Compose

## Começando

### Usando Docker (recomendado)

1. Clone o repositório
2. Copie `.env.example` para `.env` e ajuste os valores se necessário
3. Execute a API:
   ```bash
   docker-compose up
   ```

### Configuração manual

1. Clone o repositório
2. Instale dependências:
   ```bash
   npm install
   ```
3. Copie `.env.example` para `.env` e configure suas variáveis ​​de ambiente
4. Inicie o banco de dados PostgreSQL
5. Inicie a API:
   ```bash
   npm run start:dev
   ```

## Documentação da API

Acesse a documentação do Swagger em `http://localhost:3000/api`

## Melhorias Futuras

1. Implementar limitação de requisições
2. Adicione cache Redis
3. Adicione coleção de métricas
4. Implementar suporte de domínio personalizado
5. Adicione análises de URL
6. Implementar expiração de URL

## Link para a documentação da api:
https://url-shortener-production-7c8a.up.railway.app/api
