import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading, authenticate, checkSession } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Verificar sessão existente ao montar o componente
    const hasValidSession = checkSession();
    if (!hasValidSession) {
      setShowAuthModal(true);
    }
    setIsCheckingSession(false);
  }, [checkSession]);

  const handleAuthenticate = async (password: string): Promise<boolean> => {
    const success = await authenticate(password);
    if (success) {
      setShowAuthModal(false);
    }
    return success;
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    // Redirecionar para home se fechar o modal sem autenticar
    if (!isAuthenticated) {
      window.history.back();
    }
  };

  // Mostrar loading enquanto verifica a sessão
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostrar fallback ou modal
  if (!isAuthenticated) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
              <p className="text-gray-600 mb-4">Esta área requer autenticação administrativa.</p>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fazer Login
              </button>
            </div>
          </div>
        )}
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleCloseModal}
          onAuthenticate={handleAuthenticate}
        />
      </>
    );
  }

  // Se está autenticado, mostrar o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;