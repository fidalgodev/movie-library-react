import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import NotfoundSvg from '../svg/empty.svg';
import Button from './Button';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 15rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: var(--color-primary);
  font-weight: 300;
  font-size: 3.5rem;
`;

const SubTitle = styled.h2`
  color: var(--color-primary);
  font-weight: 700;
  font-size: 1.8rem;
`;

const LinkWrapper = styled(Link)`
  text-decoration: none;
`;

const Svg = styled.img`
  max-width: 100%;
  height: 50vh;
`;

const NotFound = ({ title, subtitle }) => {
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{title}</Title>
        <SubTitle>{subtitle}</SubTitle>
      </TitleWrapper>
      <Svg src={`${NotfoundSvg}`} alt="Not found" />
      <LinkWrapper to="/">
        <Button title="Home" solid icon="home" left />
      </LinkWrapper>
    </Wrapper>
  );
};

export default NotFound;
