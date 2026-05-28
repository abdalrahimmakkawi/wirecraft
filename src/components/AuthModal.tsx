import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleAuth: () => void;
  onGitHubAuth: () => void;
  onEmailAuth: (email: string, password: string) => void;
}

export function AuthModal({ isOpen, onClose, onGoogleAuth, onGitHubAuth, onEmailAuth }: AuthModalProps) {
  if (!isOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    onEmailAuth(email, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="max-w-sm w-full p-6 rounded-xl space-y-5 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none">
              <path d="M20 80h60M30 80l10-30m10-5l25-15" stroke="var(--color-accent)" strokeWidth="6" strokeLinecap="round"/>
            </svg>
            <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Sign In to Wirecraft
            </span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={onGoogleAuth}
            className="w-full flex items-center justify-center space-x-2.5 p-2 bg-white text-zinc-900 font-medium text-xs rounded border border-zinc-200 hover:bg-zinc-100 transition shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66.63-1.4 1.37-2.19 2.09z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          <button
            onClick={onGitHubAuth}
            className="w-full flex items-center justify-center space-x-2.5 p-2 bg-[#181717] text-white font-medium text-xs rounded border border-zinc-800 hover:bg-black transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t" style={{ borderColor: 'var(--border-color)' }}></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase tracking-widest leading-none" style={{ color: 'var(--text-secondary)' }}>
            or email
          </span>
          <div className="flex-grow border-t" style={{ borderColor: 'var(--border-color)' }}></div>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-2 text-left">
          <div>
            <label className="block text-[10px] uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>
              Email address
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@domain.com"
              className="w-full px-3 py-1.5 text-xs rounded text-white outline-none focus:border-cyan-500"
              style={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'var(--border-color)', border: '1px solid' }}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="•••••••••"
              className="w-full px-3 py-1.5 text-xs rounded text-white outline-none focus:border-cyan-500"
              style={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'var(--border-color)', border: '1px solid' }}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 rounded text-xs font-bold tracking-wider hover:bg-opacity-90"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
          >
            AUTHORIZE ACCOUNT
          </button>
        </form>

        <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
          Demo Session: Full persistent database local mocks configured.
        </div>
      </div>
    </div>
  );
}
