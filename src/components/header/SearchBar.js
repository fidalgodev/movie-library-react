import React, { useState } from 'react';
import styled from 'styled-components';
import history from '../../history';

const Input = styled.input`
  background-color: var(--color-primary-dark);
  border: 1px solid var(--color-primary);
  border-radius: 4rem;
  font-size: 1.3rem;
  font-weight: 300;
  width: 30rem;
  color: var(--text-color);
  padding: 1.3rem 2rem;
  box-shadow: 0 4px 8px var(--shadow-color);
  &:focus,
  &:active {
    outline: none;
  }

  &::placeholder {
    color: var(--text-color);
  }
`;

const SearchBar = () => {
  const [input, setInput] = useState('');

  function onFormSubmit(e) {
    e.preventDefault();
    setInput('');
    history.push(`/search/${input}`);
  }

  return (
    <form onSubmit={onFormSubmit}>
      <Input
        onChange={e => setInput(e.target.value)}
        value={input}
        placeholder="Start typing here..."
      />
    </form>
  );
};

export default SearchBar;
