import  { useState } from 'react';

export function searchBar() {
  const [searchText, setSearchText] = useState<string>('');
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  };

  // console.log(searchText)

  return {searchText, handleSearchChange};
}