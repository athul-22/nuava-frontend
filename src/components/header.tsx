// src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 p-4 text-white ">
      <div className="container mx-auto">
        <h1 className="text-2xl md:text-4xl">Nuava Sports</h1>
      </div>
    </header>
  );
}

export default Header;
