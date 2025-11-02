import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  // Verificar se há sessão ativa no localStorage
  useEffect(() => {
    const checkAuthSession = () => {
      const session = localStorage.getItem('admin_session');
      if (session) {
        try {
          const { timestamp, isValid } = JSON.parse(session);
          const now = Date.now();
          const sessionDuration = 2 * 60 * 60 * 1000; // 2 horas
          
          // Verificar se a sessão ainda é válida
          if (isValid && (now - timestamp) < sessionDuration) {
            setAuthState(prev => ({ ...prev, isAuthenticated: true }));
          } else {
            // Sessão expirada
            localStorage.removeItem('admin_session');
            setAuthState(prev => ({ ...prev, isAuthenticated: false }));
          }
        } catch (error) {
          // Sessão corrompida
          localStorage.removeItem('admin_session');
          setAuthState(prev => ({ ...prev, isAuthenticated: false }));
        }
      }
    };

    checkAuthSession();
  }, []);

  // Função para validar senha no backend
  const validatePassword = async (password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Buscar a senha hash do admin no Supabase
      // Primeiro, vamos verificar se existe uma tabela de configurações
      const { data: configData, error: configError } = await supabase
        .from('admin_config')
        .select('password_hash')
        .eq('key', 'admin_password')
        .single();

      if (configError && 
          configError.code !== 'PGRST116' && // Registro não encontrado
          configError.code !== 'PGRST205' && // Tabela não encontrada no cache
          configError.code !== 'PGRST106') { // Tabela não existe
        // Erro diferente de "não encontrado" ou "tabela não existe"
        console.error('Erro ao buscar configuração:', configError);
        throw new Error('Erro interno do servidor');
      }

      // Se não existe a tabela ou configuração, usar senha padrão do ambiente
      let isValid = false;
      
      if (configData?.password_hash) {
        // Validar contra hash armazenado no banco
        isValid = await validatePasswordHash(password, configData.password_hash);
      } else {
        // Fallback: validar contra variável de ambiente
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
        isValid = password === adminPassword;
      }

      if (isValid) {
        // Criar sessão
        const sessionData = {
          timestamp: Date.now(),
          isValid: true
        };
        localStorage.setItem('admin_session', JSON.stringify(sessionData));
        setAuthState(prev => ({ ...prev, isAuthenticated: true, isLoading: false }));
      } else {
        setAuthState(prev => ({ ...prev, isAuthenticated: false, isLoading: false }));
      }

      return isValid;
    } catch (error) {
      console.error('Erro na validação:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Erro interno. Tente novamente.' 
      }));
      return false;
    }
  };

  // Função auxiliar para validar hash (implementação simples)
  const validatePasswordHash = async (password: string, hash: string): Promise<boolean> => {
    // Para uma implementação mais robusta, você usaria bcrypt ou similar
    // Por simplicidade, vamos usar uma comparação direta por enquanto
    return password === hash;
  };

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem('admin_session');
    setAuthState(prev => ({ ...prev, isAuthenticated: false }));
  };

  // Função para verificar se a sessão ainda é válida
  const checkSession = (): boolean => {
    const session = localStorage.getItem('admin_session');
    if (!session) return false;

    try {
      const { timestamp, isValid } = JSON.parse(session);
      const now = Date.now();
      const sessionDuration = 2 * 60 * 60 * 1000; // 2 horas
      
      if (isValid && (now - timestamp) < sessionDuration) {
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      logout();
      return false;
    }
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    authenticate: validatePassword,
    logout,
    checkSession
  };
};