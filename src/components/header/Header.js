import React from 'react';
import styled from 'styled-components';

import SearchBar from './SearchBar';

const Wrapper = styled.div`
  display: flex;
  padding: 1rem;
  align-items: center;
  color: var(--color-primary);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-right: auto;
`;

const Header = () => {
  return (
    <Wrapper>
      <Title>Top Rated</Title>
      <SearchBar />
    </Wrapper>
  );
};

export default Header;
