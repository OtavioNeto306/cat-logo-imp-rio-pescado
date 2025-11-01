import React from 'react';
import { PhoneIcon } from '../components/icons/Icons';

const ContactPage: React.FC = () => {
  const phoneNumber = process.env.NEXT_PUBLIC_WPP_NUMBER || '5500000000000'; // Placeholder
  const message = "Olá! Visitei o site Império Pescado e gostaria de mais informações sobre seus produtos.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-neutral py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-4xl font-display font-bold text-primary mb-4">Entre em Contato</h1>
          <p className="text-lg text-gray-600 mb-8">
            Estamos prontos para atender você. Fale conosco para tirar dúvidas ou solicitar informações sobre nossos produtos.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold font-display text-primary mb-4">Contato Rápido</h2>
            <p className="text-gray-600 mb-6">
              A forma mais rápida de falar conosco é através do WhatsApp. Clique no botão abaixo para iniciar uma conversa.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-accent text-white py-4 px-6 rounded-lg inline-flex items-center justify-center font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105"
            >
              <PhoneIcon className="h-6 w-6 mr-3" />
              Iniciar Conversa no WhatsApp
            </a>
            <div className="mt-8 text-gray-500">
                <p><strong>Email:</strong> contato@imperiopescado.com.br</p>
                <p><strong>Telefone:</strong> +55 (00) 0000-0000</p>
                <p><strong>Endereço:</strong> Rua da Pescaria, 456, Marítima, RJ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;