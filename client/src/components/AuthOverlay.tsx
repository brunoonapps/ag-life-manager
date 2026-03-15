import React from 'react';
import { signIn } from '../lib/auth-client';
import { LogIn, Github, Mail } from 'lucide-react';

export const AuthOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4">
      <div className="card-technical max-w-md w-full border-t-4 border-t-brand">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-brand text-black">
            <LogIn size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Analytical Grid Life Manager</h1>
            <p className="text-xs text-brand/70 font-mono tracking-widest uppercase">Decifrando Caos em Estrutura Analítica</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => signIn.social({ 
              provider: 'github',
              callbackURL: 'http://localhost:5173/'
            })}
            className="w-full flex items-center justify-between border border-border-dim p-4 hover:border-brand hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-4">
              <Github className="group-hover:text-brand" />
              <span className="font-mono uppercase text-sm">Autenticar via GitHub</span>
            </div>
            <span className="text-brand opacity-0 group-hover:opacity-100 font-mono text-xs">GO_</span>
          </button>

          <button 
            onClick={() => signIn.social({ 
              provider: 'google',
              callbackURL: 'http://localhost:5173/'
            })}
            className="w-full flex items-center justify-between border border-border-dim p-4 hover:border-brand hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-4">
              <Mail className="group-hover:text-brand" />
              <span className="font-mono uppercase text-sm">Autenticar via Google</span>
            </div>
            <span className="text-brand opacity-0 group-hover:opacity-100 font-mono text-xs">GO_</span>
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border-dim"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono"><span className="bg-black px-2 text-zinc-500">Ou use o modo de teste</span></div>
          </div>

          <button 
            onClick={async () => {
              // Chamada direta para o endpoint de mock para contornar a falta de chaves OAuth reais
              const res = await fetch('http://localhost:3001/api/auth/mock-login');
              if (res.ok) window.location.reload();
            }}
            className="w-full border border-brand/30 p-3 hover:bg-brand/10 transition-all group"
          >
            <span className="font-mono uppercase text-xs text-brand group-hover:tracking-widest transition-all">
              [ ACESSO_DIRETO_DESENVOLVEDOR ]
            </span>
          </button>
        </div>

        <div className="mt-12 text-[10px] text-zinc-600 font-mono space-y-1">
          <p>// PROTOCOLO DE SEGURANÇA ATIVO</p>
          <p>// AG-LIFE-MANAGER v1.0.0-PRO-MAX</p>
          <p>// AGUARDANDO ENTRADA DE DADOS...</p>
        </div>
      </div>
    </div>
  );
};
