import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-neutral mt-16 print:hidden">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} Império Pescado. Todos os direitos reservados.</p>
          <p className="text-xs text-gray-400 mt-2">Sabores do mar frescos, direto para sua mesa.</p>
          <div className="mt-4">
            <Link to="/admin" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;