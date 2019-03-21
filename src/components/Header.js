import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -0.5px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h2`
  text-transform: uppercase;
  line-height: 1;
  font-size: 1.2rem;
  font-weight: 700;
`;

const HeaderWrapper = styled.div`
  margin-bottom: 2rem;
  margin-top: 1rem;
`;

const Header = ({ title, subtitle }) => (
  <HeaderWrapper>
    <Title>{title}</Title>
    <Subtitle>{subtitle}</Subtitle>
  </HeaderWrapper>
);

export default Header;
