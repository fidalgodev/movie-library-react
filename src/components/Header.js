import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import SearchBar from './SearchBar';

const Wrapper = styled.div`
  display: flex;
  padding: 1rem;
  height: 8rem;
  align-items: center;
  color: var(--color-primary);
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-right: auto;
  letter-spacing: -0.5px;
`;

const Header = ({ header }) => {
  return (
    <Wrapper>
      <Title>{header}</Title>
      <SearchBar />
    </Wrapper>
  );
};

const mapStateToProps = ({ geral }) => {
  return { header: geral.header };
};

export default connect(mapStateToProps)(Header);
