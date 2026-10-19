"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EntrarPage() {
  const router = useRouter();
  const supabase = createClient();

  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    if (modo === "cadastrar") {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { nome } },
      });
      if (error) {
        setErro(traduzErro(error.message));
        setCarregando(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) {
        setErro(traduzErro(error.message));
        setCarregando(false);
        return;
      }
    }

    router.push("/app");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#14181f", padding: 16 }}>
      <form
        onSubmit={enviar}
        style={{
          width: "100%", maxWidth: 360, background: "#1d222b", border: "1px solid #2a3140",
          borderRadius: 14, padding: 28, display: "flex", flexDirection: "column", gap: 14,
        }}
      >
        <h1 style={{ margin: 0, color: "#eef1f6", fontSize: "1.3rem", fontFamily: "Inter, system-ui, sans-serif" }}>
          {modo === "entrar" ? "Entrar na Kinetik" : "Criar sua conta"}
        </h1>

        {modo === "cadastrar" && (
          <input
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={campoEstilo}
          />
        )}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={campoEstilo}
        />
        <input
          type="password"
          placeholder="Senha (mínimo 6 caracteres)"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          minLength={6}
          style={campoEstilo}
        />

        {erro && <div style={{ color: "#ff6b6b", fontSize: ".82rem" }}>{erro}</div>}

        <button
          type="submit"
          disabled={carregando}
          style={{
            background: "#3a8bff", color: "#fff", border: "none", borderRadius: 20,
            padding: "10px 16px", fontWeight: 700, fontSize: ".88rem", cursor: "pointer",
            opacity: carregando ? 0.7 : 1,
          }}
        >
          {carregando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
        </button>

        <button
          type="button"
          onClick={() => setModo(modo === "entrar" ? "cadastrar" : "entrar")}
          style={{ background: "none", border: "none", color: "#9aa4b5", fontSize: ".82rem", cursor: "pointer" }}
        >
          {modo === "entrar" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </form>
    </div>
  );
}

const campoEstilo: React.CSSProperties = {
  background: "#14181f", border: "1px solid #2a3140", borderRadius: 9,
  padding: "10px 12px", color: "#eef1f6", fontSize: ".9rem", fontFamily: "inherit", outline: "none",
};

function traduzErro(msg: string) {
  if (msg.includes("already registered")) return "Esse e-mail já tem conta. Tenta entrar.";
  if (msg.includes("Invalid login")) return "E-mail ou senha errados.";
  if (msg.includes("Password should be")) return "A senha precisa ter pelo menos 6 caracteres.";
  return msg;
}
