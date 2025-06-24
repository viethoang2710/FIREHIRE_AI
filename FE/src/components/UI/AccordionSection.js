import React from 'react';

const AccordionSection = ({ title, icon: Icon, isOpen, onClick, children }) => {
  return (
    <div className="border rounded-md overflow-hidden bg-white shadow-sm">
      <button
        className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-800 bg-gray-100 hover:bg-gray-200"
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-blue-500" />}
          <span className="font-medium">{title}</span>
        </div>
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && <div className="px-4 py-2">{children}</div>}
    </div>
  );
};

export default AccordionSection;
