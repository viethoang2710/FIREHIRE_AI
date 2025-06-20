// src/components/SearchBar.js
import React, { useState } from 'react';
import { Search } from 'lucide-react'; // Đảm bảo bạn đã import Search icon trong Header.js

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-full overflow-hidden p-1 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow px-4 py-2 text-gray-700 outline-none"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full mr-1"
      >
        <Search size={20} />
      </button>
    </form>
  );
};

export default SearchBar;