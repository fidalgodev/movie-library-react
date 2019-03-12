import React from 'react';
import styled from 'styled-components';

import SearchBar from './SearchBar';

const Wrapper = styled.div`
  display: flex;
  padding: 1rem 2rem;
  height: 6rem;
  background-color: #444;
  align-items: center;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  margin-right: auto;
`;

const Header = () => {
  return (
    <Wrapper>
      <Title>Title</Title>
      <SearchBar />
    </Wrapper>
  );
};

export default Header;
