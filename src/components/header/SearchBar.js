import React, { useState } from 'react';
import styled from 'styled-components';

const SearchBar = () => {
  const [input, setInput] = useState('');

  function onFormSubmit(e) {
    e.preventDefault();
    console.log(input);
  }

  return (
    <form onSubmit={onFormSubmit}>
      <input onChange={e => setInput(e.target.value)} value={input} />;
    </form>
  );
};

export default SearchBar;
