# Finance App Api

## O que é?

<p>Uma API para controle financeiro, onde pode cadastrar um usuário, cadastrar uma transação, pegar os balanços de um  usuário, toda a parte do Back-end</p>

## Como instalar?

<p>1. Clone o repo e faça o install das dependencias</p>

```
git clone
npm install
```

<h4>2. Rode o docker e configure as chaves secretas (principalmente a .env.test)</h4>

```
docker compose up -d
```

<h4>3. De um pull no banco de dados</h4>

```
npx prisma db push
```

<h4>4. Rode os testes e o projeto</h4>

```
npm run test
npm run start:dev
```

## Tecnologias

-   Github Actions (CI/CD)
-   Express
-   Jest
-   Zod
