-- Kinetik — estrutura inicial do banco de dados
-- Rode esse arquivo em: Supabase > SQL Editor > New query > colar tudo > Run

-- ========================================
-- Tabela de perfis (dados públicos do usuário, separados da tabela de login)
-- ========================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  plano text not null default 'free' check (plano in ('free','plus','pro')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cada usuário só pode ver e editar o PRÓPRIO perfil — ninguém enxerga o perfil de outro.
create policy "usuário vê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "usuário edita o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Cria o perfil automaticamente assim que alguém se cadastra (login seguro via Supabase Auth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, new.raw_user_meta_data->>'nome');
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========================================
-- Tabela de projetos (os circuitos que o usuário cria)
-- ========================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null default 'Projeto sem nome',
  descricao text,
  circuito_json jsonb not null default '{}'::jsonb, -- componentes, fios, posições
  codigo text default '', -- código do microcontrolador associado ao projeto
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Regra de ouro: um usuário só vê, cria, edita e apaga os PRÓPRIOS projetos.
-- Isso impede qualquer pessoa de acessar projeto de outra, mesmo sabendo o id.
create policy "usuário vê os próprios projetos"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "usuário cria projeto pra si mesmo"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "usuário edita os próprios projetos"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "usuário apaga os próprios projetos"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Atualiza "updated_at" sozinho sempre que o projeto é editado
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger on_project_updated
  before update on public.projects
  for each row execute function public.handle_updated_at();

create index if not exists projects_user_id_idx on public.projects(user_id);
