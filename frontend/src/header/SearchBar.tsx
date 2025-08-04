import React from 'react';

interface SearchBarProps {
  searchText: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function SearchBar({ searchText, onSearchChange }: SearchBarProps) {
  return (
    <input
      className="search-bar"
      type="text"
      placeholder="Search..."
      value={searchText}
      onChange={onSearchChange}
    />
  );
};

export default SearchBar;