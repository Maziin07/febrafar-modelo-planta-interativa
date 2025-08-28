import React from 'react';

const PharmacyHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo */}
      <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full px-6 py-3 shadow-lg">
        <span className="text-2xl mr-2">🏪</span>
        <span className="text-xl font-bold">Loja P</span>
      </div>
      
      {/* Main title */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
          Planta Interativa da Farmácia
        </h1>
        <p className="text-lg text-muted-foreground">
          Clique nas seções coloridas para explorar produtos e informações
        </p>
      </div>
    </div>
  );
};

export default PharmacyHeader;