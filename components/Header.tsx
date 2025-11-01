import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MenuIcon, XIcon } from './icons/Icons';

const NavLinks = ({ onClick }: { onClick?: () => void }) => (
  <>
    <NavLink to="/" className={({isActive}) => `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-200 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} onClick={onClick}>Home</NavLink>
    <NavLink to="/catalogo" className={({isActive}) => `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-200 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} onClick={onClick}>Catálogo</NavLink>
    <NavLink to="/sobre" className={({isActive}) => `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-200 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} onClick={onClick}>Sobre Nós</NavLink>
    <NavLink to="/contato" className={({isActive}) => `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-200 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} onClick={onClick}>Contato</NavLink>
  </>
);

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm print:hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="text-2xl font-bold font-display text-primary">
                            Império Pescado<span className="text-accent">.</span>
                        </NavLink>
                    </div>
                    <div className="hidden md:block">
                        <nav className="ml-10 flex items-baseline space-x-4">
                            <NavLinks />
                        </nav>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent">
                            <span className="sr-only">Abrir menu principal</span>
                            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                        <NavLinks onClick={() => setIsMenuOpen(false)} />
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;