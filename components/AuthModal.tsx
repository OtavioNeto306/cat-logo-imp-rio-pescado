import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (password: string) => Promise<boolean>;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Verificar se há bloqueio ativo no localStorage
  useEffect(() => {
    const lockoutData = localStorage.getItem('admin_lockout');
    if (lockoutData) {
      const { timestamp, attempts: savedAttempts } = JSON.parse(lockoutData);
      const now = Date.now();
      const timeDiff = now - timestamp;
      
      // Bloqueio por 15 minutos após 3 tentativas
      if (savedAttempts >= 3 && timeDiff < 15 * 60 * 1000) {
        setIsLocked(true);
        setAttempts(savedAttempts);
        setLockoutTime(Math.ceil((15 * 60 * 1000 - timeDiff) / 1000));
        
        // Timer para atualizar o tempo restante
        const timer = setInterval(() => {
          const newTimeDiff = Date.now() - timestamp;
          const remaining = Math.ceil((15 * 60 * 1000 - newTimeDiff) / 1000);
          
          if (remaining <= 0) {
            setIsLocked(false);
            setAttempts(0);
            setLockoutTime(0);
            localStorage.removeItem('admin_lockout');
            clearInterval(timer);
          } else {
            setLockoutTime(remaining);
          }
        }, 1000);
        
        return () => clearInterval(timer);
      } else if (timeDiff >= 15 * 60 * 1000) {
        // Limpar bloqueio expirado
        localStorage.removeItem('admin_lockout');
        setAttempts(0);
      } else {
        setAttempts(savedAttempts);
      }
    }
  }, [isOpen]);

  // Validação de senha no frontend
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres';
    }
    
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    
    if (!hasLetter || !hasNumber) {
      return 'A senha deve conter pelo menos uma letra e um número';
    }
    
    // Aceitar caracteres especiais - não há restrição adicional
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Acesso bloqueado. Tente novamente em ${Math.floor(lockoutTime / 60)}:${(lockoutTime % 60).toString().padStart(2, '0')}`);
      return;
    }

    // Validação no frontend
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const isValid = await onAuthenticate(password);
      
      if (isValid) {
        // Sucesso - limpar tentativas
        localStorage.removeItem('admin_lockout');
        setAttempts(0);
        setPassword('');
        onClose();
      } else {
        // Falha na autenticação
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        // Salvar tentativas no localStorage
        localStorage.setItem('admin_lockout', JSON.stringify({
          timestamp: Date.now(),
          attempts: newAttempts
        }));
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockoutTime(15 * 60); // 15 minutos
          setError('Muitas tentativas falhadas. Acesso bloqueado por 15 minutos.');
        } else {
          setError(`Senha incorreta. ${3 - newAttempts} tentativa(s) restante(s).`);
        }
      }
    } catch (error) {
      setError('Erro interno. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setPassword('');
      setError('');
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Acesso Administrativo</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha de Administrador
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isLocked}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>

          {/* Mensagens de erro */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Informações de bloqueio */}
          {isLocked && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                🔒 Acesso temporariamente bloqueado
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Tempo restante: {formatTime(lockoutTime)}
              </p>
            </div>
          )}

          {/* Indicador de tentativas */}
          {attempts > 0 && !isLocked && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-orange-800">
                ⚠️ {attempts}/3 tentativas utilizadas
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || isLocked || !password.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>

        {/* Footer com dicas */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-xs text-gray-500">
            💡 A senha deve ter pelo menos 8 caracteres, incluindo letras e números (caracteres especiais são aceitos)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;