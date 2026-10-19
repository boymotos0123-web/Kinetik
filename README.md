# Kinetik

Assistente de IA que ajuda a montar circuitos eletrônicos (Arduino/ESP32), em português — descreva o que quer construir e receba a lista de peças, o esquema e o passo a passo.

## Stack

- **Next.js** (App Router) — framework do site
- **Supabase** — login de usuário e banco de dados (Postgres), com segurança via Row Level Security (cada usuário só acessa os próprios dados)

## Rodar localmente

1. Copie `.env.local.example` para `.env.local` e preencha com as chaves do seu projeto Supabase (Project Settings > API).
2. Rode a migração do banco: abra o SQL Editor do Supabase e cole o conteúdo de `supabase/migrations/0001_init.sql`.
3.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Estrutura

- `app/entrar` — login e cadastro
- `app/app` — a interface principal (protegida: só acessível logado, via `proxy.ts`)
- `lib/supabase` — clientes de conexão com o banco (browser e servidor)
- `supabase/migrations` — definição das tabelas e das regras de segurança do banco

## Segurança

- `.env.local` nunca é commitado (está no `.gitignore`).
- O banco usa Row Level Security: cada usuário só vê, cria e edita os próprios projetos — mesmo sabendo o id de outro projeto, o banco recusa o acesso.
- A chave pública (`anon key`) é segura de expor no front-end por design do Supabase; a chave `service_role` (acesso total, sem proteção) nunca entra no código.
