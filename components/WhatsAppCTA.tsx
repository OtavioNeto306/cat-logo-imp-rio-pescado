import React from 'react';
import { PhoneIcon } from './icons/Icons';

interface WhatsAppCTAProps {
  productName: string;
  productCode: string;
}

const WhatsAppCTA: React.FC<WhatsAppCTAProps> = ({ productName, productCode }) => {
  const phoneNumber = process.env.NEXT_PUBLIC_WPP_NUMBER || '5500000000000'; // Placeholder phone number
  const message = `Olá! Tenho interesse no produto:
Nome: ${productName}
Código: ${productCode}
Gostaria de mais informações.`;
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 w-full bg-accent text-white py-4 px-6 rounded-lg flex items-center justify-center font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105"
    >
      <PhoneIcon className="h-6 w-6 mr-3" />
      Solicitar Orçamento via WhatsApp
    </a>
  );
};

export default WhatsAppCTA;