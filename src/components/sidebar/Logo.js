import React from 'react';
import styled from 'styled-components';

const LogoWrapper = styled.div`
  height: 8rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 3rem;
`;

const Logo = () => {
  return <LogoWrapper>Movies</LogoWrapper>;
};

export default Logo;
