// Cliente Supabase pra usar em Server Components / Server Actions (roda no servidor).
// Lê e escreve o cookie de sessão do usuário pra manter o login entre páginas.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // chamado de dentro de um Server Component — pode ignorar,
            // o middleware cuida de renovar a sessão nesse caso.
          }
        },
      },
    }
  );
}
