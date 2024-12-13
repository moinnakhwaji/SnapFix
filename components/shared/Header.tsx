import React from 'react';

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-gray-300 text-sm">{subtitle}</p>
    </div>
  );
};

export default Header;
