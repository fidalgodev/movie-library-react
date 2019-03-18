import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LogoWrapper = styled.div`
  height: 8rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 3rem;
  text-transform: uppercase;
  font-weight: 300;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--color-primary);
`;

const LinkWrapper = styled(Link)`
  width: 100%;
  text-decoration: none;
`;

const Logo = () => {
  return (
    <LinkWrapper to="/">
      <LogoWrapper>Movies</LogoWrapper>;
    </LinkWrapper>
  );
};

export default Logo;
