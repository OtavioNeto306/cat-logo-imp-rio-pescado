import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Sabores do mar frescos, direto para sua mesa.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Variedade e qualidade em pescados, frutos do mar e outros produtos especiais.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/catalogo"
              className="rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-transform transform hover:scale-105"
            >
              Ver Catálogo
            </Link>
            <Link to="/contato" className="text-sm font-semibold leading-6 text-primary hover:text-gray-700">
              Fale conosco <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;