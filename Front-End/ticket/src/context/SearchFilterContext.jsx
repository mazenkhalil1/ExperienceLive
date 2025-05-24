import React, { createContext, useState, useContext } from 'react';

const SearchFilterContext = createContext();

export const SearchFilterProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    location: '',
    priceRange: 'all',
    category: 'all'
  });

  const resetFilters = () => {
    setFilters({
      date: '',
      location: '',
      priceRange: 'all',
      category: 'all'
    });
  };

  return (
    <SearchFilterContext.Provider value={{ searchTerm, setSearchTerm, filters, setFilters, resetFilters }}>
      {children}
    </SearchFilterContext.Provider>
  );
};

export const useSearchFilter = () => useContext(SearchFilterContext); 