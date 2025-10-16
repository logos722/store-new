'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/auth/auth';
import SafePortal from '@/shared/components/ui/SafePortal';
import styles from './AuthModal.module.scss';

export const AuthModal: React.FC<{ isOpen: boolean; onClose?: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { login, register, loading, error } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');

  if (!isOpen) return null;

  return (
    <SafePortal>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <button className={styles.close} onClick={onClose}>
            ×
          </button>
          <div className={styles.toggle}>
            <button
              onClick={() => setMode('login')}
              className={mode === 'login' ? styles.active : ''}
            >
              Вход
            </button>
            <button
              onClick={() => setMode('register')}
              className={mode === 'register' ? styles.active : ''}
            >
              Регистрация
            </button>
          </div>
          <form
            onSubmit={async e => {
              e.preventDefault();
              if (mode === 'login') await login(email, pass);
              else await register(email, name, pass);
              if (!error) onClose();
            }}
            className={styles.form}
          >
            {mode === 'register' && (
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Имя"
                required
              />
            )}
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="E-mail"
              required
            />
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="Пароль"
              required
            />
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" disabled={loading}>
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </SafePortal>
  );
};
