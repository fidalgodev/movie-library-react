import React from 'react';
import styled from 'styled-components';

import Logo from './Logo';
import Genres from './Genres';
import MenuItem from './MenuItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  width: 25rem;
  color: var(--color-primary-dark);
  padding: 2rem 3rem;
`;

const Heading = styled.h2`
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  margin-bottom: 1rem;
  &:not(:first-child) {
    margin-top: 4rem;
  }
`;

const MenuWrapper = styled.div`
  width: 100%;
  padding: 2rem 0;
  position: relative;
  &:after {
    width: 100%;
    position: absolute;
    margin-left: 3rem;
    display: block;
    content: '';
    top: 0;
    left: 0;
    height: 100%;
    opacity: 0.2;
    z-index: -999;
    border-right: 2px solid var(--color-primary-lighter);
  }
`;

const Sidebar = props => {
  return (
    <Wrapper>
      <Logo />
      <MenuWrapper>
        <Heading>Discover</Heading>
        <MenuItem title={'Popular'} />
        <MenuItem title={'Top Rated'} selected />
        <MenuItem title={'Upcoming'} />
        <Genres />
      </MenuWrapper>
    </Wrapper>
  );
};

export default Sidebar;
