// Cliente Supabase pra usar em componentes que rodam no navegador ("use client").
// A chave "anon" aqui é pública de propósito — a segurança de verdade vem das
// regras de RLS configuradas no banco (ver supabase/migrations), não dessa chave.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
