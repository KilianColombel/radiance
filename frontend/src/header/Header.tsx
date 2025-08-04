import React from 'react';
import QuickNav from './QuickNav.tsx';
import SearchBar from './SearchBar.tsx';
import UserAccount from './UserAccount.tsx';
import './Header.css';

interface HeaderProps {
  searchText: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Header({ searchText, onSearchChange }: HeaderProps) {
  return (
    <div className='header-bar'>
      <QuickNav />
      <SearchBar searchText={searchText} onSearchChange={onSearchChange} />
      <UserAccount userName="Votre Nom" />
    </div>
  );
};

export default Header;