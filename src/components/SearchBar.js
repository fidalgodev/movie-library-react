import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import history from '../history';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Form = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  transition: all 2s cubic-bezier(0.42, 0, 0.58, 1);
`;

const Input = styled.input`
  background-color: var(--color-primary-dark);
  border: 1px solid var(--color-primary);
  border-radius: 10rem;
  font-size: 1.3rem;
  font-weight: 300;
  height: 4rem;
  width: ${props => (props.state ? '30rem' : '4rem')};
  color: var(--text-color);
  padding: 2rem;
  box-shadow: 0 4px 8px var(--shadow-color);
  cursor: ${props => (props.state ? 'default' : 'pointer')};
  transition: width 0.2s cubic-bezier(0.42, 0, 0.58, 1);
  &:focus,
  &:active {
    outline: none;
  }

  &::placeholder {
    color: var(--text-color);
  }
`;

const Button = styled.button`
  pointer-events: ${props => (props.state ? 'auto' : 'none')};
  cursor: ${props => (props.state ? 'pointer' : 'none')};
  position: absolute;
  padding: 1rem;
  right: 0;
  margin-right: 0.5rem;
  background-color: transparent;
  border: none;
  outline: none;
  color: var(--text-color);
`;

const SearchBar = () => {
  const [input, setInput] = useState('');
  const [state, setState] = useState(false);
  const node = useRef();

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  // On click outside, change input state to false
  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setState(false);
  };

  function onFormSubmit(e) {
    e.preventDefault();
    setInput('');
    history.push(`/search/${input}`);
  }

  return (
    <Form onClick={() => setState(!state)} onSubmit={onFormSubmit} ref={node}>
      <Input
        onChange={e => setInput(e.target.value)}
        value={input}
        state={state}
        placeholder="Search for a movie..."
      />
      <Button type="submit" state={state}>
        <FontAwesomeIcon icon={faSearch} size="1x" />
      </Button>
    </Form>
  );
};

export default SearchBar;
