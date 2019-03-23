import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: ${props => (props.size === '2' ? '4rem' : '2.5rem')};
  font-weight: 200;
  line-height: ${props => (props.size === '2' ? '1.2' : '1')};
  color: var(--color-primary-dark);
  letter-spacing: -0.5px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h2`
  text-transform: uppercase;
  line-height: ${props => (props.size === '2' ? '1.5' : '1')};
  color: var(--color-primary);
  font-size: ${props => (props.size === '2' ? '1.7rem' : '1.2rem')};
  font-weight: 700;
`;

const HeaderWrapper = styled.div`
  margin-bottom: 2rem;
`;

const Header = ({ title, subtitle, size }) => (
  <HeaderWrapper>
    <Title size={size}>{title}</Title>
    <Subtitle size={size}>{subtitle}</Subtitle>
  </HeaderWrapper>
);

export default Header;
