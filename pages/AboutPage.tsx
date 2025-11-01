import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-center text-primary mb-6">Sobre Nós</h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            No Império Pescado, somos apaixonados por levar os melhores sabores do mar e produtos especiais diretamente para a sua mesa. 
            Com um compromisso inabalável com a qualidade e o frescor, selecionamos cuidadosamente cada item do nosso catálogo, 
            garantindo uma experiência gastronômica excepcional para você e sua família.
          </p>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Nossa missão é oferecer uma vasta gama de pescados, frutos do mar, bebidas, temperos e outros produtos 
            de mercearia, sempre priorizando a procedência e o manejo sustentável. Acreditamos que ingredientes de alta 
            qualidade são a chave para pratos deliciosos e momentos inesquecíveis à mesa.
          </p>
          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="font-display font-semibold text-primary">Nossos Valores</h2>
            <ul>
                <li><strong>Qualidade e Frescor:</strong> Garantia de produtos frescos e selecionados.</li>
                <li><strong>Variedade:</strong> Um catálogo completo para todas as suas necessidades culinárias.</li>
                <li><strong>Atendimento:</strong> Dedicação para superar as expectativas de nossos clientes.</li>
                <li><strong>Conveniência:</strong> Facilidade para fazer suas compras e receber em casa.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;