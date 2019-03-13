import React from 'react';
import styled from 'styled-components';

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

const Logo = () => {
  return <LogoWrapper>Movies</LogoWrapper>;
};

export default Logo;
