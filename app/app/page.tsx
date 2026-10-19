"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import "./kinetik.css";

type View = "inicio" | "projetos" | "tutoriais";

const COMPONENTES_BASICOS = [
  { nome: "Resistor", cor: "#caa06a" },
  { nome: "LED", cor: "#e8463a" },
  { nome: "Botão", cor: "#3a3f4c" },
  { nome: "Potenciômetro", cor: "#2f6fd6" },
  { nome: "Capacitor", cor: "#2f6fd6" },
  { nome: "Interruptor", cor: "#4a4f5c" },
  { nome: "Buzzer", cor: "#4a4f5c" },
  { nome: "Servo motor", cor: "#2f6fd6" },
  { nome: "Bateria 9V", cor: "#20232b" },
  { nome: "Bateria 1,5V", cor: "#2aa198" },
  { nome: "Placa de ensaio", cor: "#e9ecf1" },
  { nome: "Arduino Uno", cor: "#2aa198" },
];

export default function AppPage() {
  const router = useRouter();
  const supabase = createClient();

  const [carregando, setCarregando] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [view, setView] = useState<View>("inicio");
  const [editorAberto, setEditorAberto] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/entrar");
        return;
      }
      const nome =
        (data.user.user_metadata?.nome as string | undefined) ||
        data.user.email ||
        "Usuário";
      setNomeUsuario(nome);
      setCarregando(false);
    });
  }, [router, supabase]);

  async function sair() {
    await supabase.auth.signOut();
    router.replace("/entrar");
  }

  if (carregando) return null;

  const inicial = nomeUsuario.charAt(0).toUpperCase();
  const fullMode = view === "projetos" || view === "tutoriais";

  return (
    <div className={`kinetik-app${fullMode ? " full-mode" : ""}${editorAberto ? " editor-open" : ""}`}>
      <div className="topbar">
        <div className="brand" onClick={() => setView("inicio")}>
          <div style={{ background: "#fff", width: 40, height: 40, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src="/logo.png" alt="" width={34} height={34} style={{ objectFit: "contain" }} />
          </div>
          <div className="brand-text">
            <b>KINETIK</b>
            <span>Assistente de circuitos</span>
          </div>
        </div>
        <div className="top-nav">
          <span onClick={() => setView("inicio")}>Início</span>
          <span onClick={() => setView("projetos")}>Projetos</span>
          <span onClick={() => setView("tutoriais")}>Tutoriais</span>
        </div>
        <div className="top-right">
          <div className="icon-btn">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <button className="create-btn" onClick={() => setEditorAberto(true)}>
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
            Criar
          </button>
          <div className="avatar-circle" title={nomeUsuario} onClick={sair}>{inicial}</div>
        </div>
      </div>

      <div className="mini-nav">
        <div className="brand-click" onClick={() => setView("inicio")}>
          <div style={{ background: "#fff", width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src="/logo.png" alt="" width={28} height={28} style={{ objectFit: "contain" }} />
          </div>
          <b>KINETIK</b>
        </div>
        <span className={view === "inicio" ? "active" : ""} onClick={() => setView("inicio")}>Início</span>
        <span className={view === "projetos" ? "active" : ""} onClick={() => setView("projetos")}>Projetos</span>
        <span className={view === "tutoriais" ? "active" : ""} onClick={() => setView("tutoriais")}>Tutoriais</span>
      </div>

      <div className={`shell${fullMode ? " full-mode" : ""}`}>
        <aside className="sidebar">
          <div className="side-avatar">{inicial}</div>
          <div className="side-name">{nomeUsuario.toUpperCase()}</div>

          <div className={`side-link${view === "inicio" ? " active" : ""}`} onClick={() => setView("inicio")}>
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 11l9-8 9 8M5 10v10h14V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>Início</span>
          </div>
          <div className={`side-link${view === "projetos" ? " active" : ""}`} onClick={() => setView("projetos")}>
            <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" /></svg>
            <span>Projetos</span>
          </div>
          <div className={`side-link${view === "tutoriais" ? " active" : ""}`} onClick={() => setView("tutoriais")}>
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" /></svg>
            <span>Tutoriais</span>
          </div>

          <button className="side-foot" onClick={sair}>
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Sair da conta
          </button>
        </aside>

        <div className="main">
          {view === "inicio" && (
            <div id="view-inicio">
              <div className="banner">
                <div className="banner-badge">
                  <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2.4" fill="currentColor" /><path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3.5 3.5M15.5 15.5L19 19M19 5l-3.5 3.5M8.5 15.5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </div>
                <div>
                  <h2>Descreva, e a Kinetik monta o circuito</h2>
                  <p>Diga o que você quer construir e receba a lista de peças, o esquema de ligação e o passo a passo, em português.</p>
                  <button onClick={() => setEditorAberto(true)}>Criar meu primeiro circuito</button>
                </div>
              </div>

              <div className="section">
                <div className="section-head">
                  <h3>Crie seu primeiro circuito</h3>
                </div>
                <div className="card-row">
                  <div className="card" onClick={() => setEditorAberto(true)}>
                    <div className="card-thumb">
                      <Image src="/circuito-exemplo.jpg" alt="" width={300} height={188} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div className="card-body">
                      <div className="card-title">Crie seu primeiro circuito eletrônico</div>
                      <div className="card-link">
                        Começar
                        <svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "projetos" && (
            <div id="view-projetos" className="empty-state full">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 9h18" stroke="currentColor" strokeWidth="1.6" /><path d="M9 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </div>
              <h3>Você ainda não tem nenhum projeto</h3>
              <p>Quando você criar um circuito com a Kinetik, ele aparece aqui pra você voltar e continuar depois.</p>
              <button className="btn-pri" onClick={() => setEditorAberto(true)}>Criar meu primeiro circuito</button>
            </div>
          )}

          {view === "tutoriais" && (
            <div id="view-tutoriais" className="empty-state full">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4l-2.7 2.7-2-2 2.7-2.7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
              </div>
              <h3>Essa função está em desenvolvimento</h3>
              <p>Os tutoriais ainda não estão prontos. Em breve você vai poder aprender eletrônica por aqui, passo a passo.</p>
              <button className="btn-pri" onClick={() => setView("inicio")}>Voltar pro início</button>
            </div>
          )}
        </div>
      </div>

      <div className="editor-overlay">
        <div className="editor-top">
          <button className="editor-brand" onClick={() => setEditorAberto(false)} title="Voltar">
            <svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <Image src="/logo-white.png" alt="" width={20} height={20} />
            <b>KINETIK</b>
          </button>
          <div className="editor-actions">
            <button className="editor-btn">
              <svg viewBox="0 0 24 24" fill="none"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Código
            </button>
            <button className="editor-btn editor-btn-pri">
              <svg viewBox="0 0 24 24" fill="none"><path d="M6 4l14 8-14 8V4z" fill="currentColor" /></svg>
              Simular
            </button>
          </div>
        </div>

        <div className="editor-body">
          <div className="editor-canvas">
            <div className="canvas-toolbar">
              <button className="ct-btn" title="Duplicar"><svg viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="currentColor" strokeWidth="1.8" /></svg></button>
              <button className="ct-btn" title="Colar"><svg viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="12" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.8" /></svg></button>
              <button className="ct-btn" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
              <span className="ct-sep"></span>
              <button className="ct-btn" title="Desfazer"><svg viewBox="0 0 24 24" fill="none"><path d="M9 7L4 12l5 5M4 12h11a5 5 0 010 10h-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
              <button className="ct-btn" title="Refazer"><svg viewBox="0 0 24 24" fill="none"><path d="M15 7l5 5-5 5M20 12H9A5 5 0 009 22h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
            <div className="editor-expand" title="Ajustar à tela">
              <svg viewBox="0 0 24 24" fill="none"><path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>

          <div className="editor-panel">
            <div className="editor-search">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <input type="text" placeholder="Pesquisar componentes" />
            </div>
            <div className="editor-grid">
              {COMPONENTES_BASICOS.map((c) => (
                <div className="comp-card" key={c.nome} draggable>
                  <div className="comp-ic" style={{ background: c.cor, borderRadius: 6 }} />
                  <span>{c.nome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
