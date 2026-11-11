
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthPanel({ user }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrar() {
    setLoading(true);
    setMensagem('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    setMensagem(error ? error.message : 'Login realizado!');
    setLoading(false);
  }

  async function cadastrar() {
    setLoading(true);
    setMensagem('');

    const { error } = await supabase.auth.signUp({
      email,
      password: senha
    });

    setMensagem(
      error
        ? error.message
        : 'Cadastro solicitado! Confira seu e-mail para confirmar a conta, se necessário.'
    );

    setLoading(false);
  }

  async function sair() {
    const { error } = await supabase.auth.signOut();

    if (error) setMensagem(error.message);
  }

  if (user) {
    return (
      <div className="glass rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-center justify-between">
        <span className="text-sm text-teal-200">
          Conectado: {user.email}
        </span>

        <button className="ghost" onClick={sair}>
          Sair
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-5 mb-5">
      <h2 className="text-white font-bold mb-3">
        Acesse sua conta UrbanSense
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          entrar();
        }}
        className="flex flex-wrap gap-3"
      >
        <input
          type="email"
          required
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-900 text-white border border-slate-600 rounded-lg p-3"
        />

        <input
          type="password"
          required
          minLength={6}
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="bg-slate-900 text-white border border-slate-600 rounded-lg p-3"
        />

        <button type="submit" className="action" disabled={loading}>
          Entrar
        </button>

        <button
          type="button"
          className="ghost"
          disabled={loading}
          onClick={cadastrar}
        >
          Criar conta
        </button>
      </form>

      {mensagem && (
        <p role="status" className="text-sm text-teal-200 mt-3">
          {mensagem}
        </p>
      )}
    </div>
  );
}
