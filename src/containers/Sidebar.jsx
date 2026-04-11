import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import StickyBox from 'react-sticky-box';

import Logo from '../components/Logo';
import TmdbLogo from '../svg/tmdb.svg';
import MenuItem from '../components/MenuItem';
import { STATIC_CATEGORIES } from '../constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 25rem;
  padding: 2rem;
  margin-top: 4rem;
  color: var(--color-primary-dark);
  border-right: 1px solid var(--border-color);
`;

const Heading = styled.h2`
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  margin: 0 0 1rem 1rem;
  &:not(:first-child) {
    margin-top: 4rem;
  }
`;

const LinkWrap = styled(Link)`
  text-decoration: none;
  display: block;
  outline: none;
  margin-bottom: 0.5rem;
`;

const StyledCoffe = styled.a`
  display: flex !important;
  outline: none;
  justify-content: center !important;
  align-items: center !important;
  padding: 0.5rem 2rem;
  color: #000000;
  background-color: #ffffff;
  border-radius: 3px;
  font-family: 'Montserrat', sans-serif;
  border: 1px solid transparent;
  text-decoration: none;
  font-family: 'Montserrat';
  font-size: 1.2rem;
  letter-spacing: 0.6px;
  box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5);
  margin: 2rem auto;
  transition: 0.3s all linear;

  &img {
    width: 27px;
    box-shadow: none;
    border: none;
    vertical-align: middle;
  }

  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
    box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5);
    opacity: 0.85;
    color: #000000;
  }
`;

const CopyRight = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  color: var(--color-primary-dark);
`;

const StyledLink = styled.a`
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  color: inherit;
`;

const Svg = styled.img`
  max-width: 100%;
  height: 3rem;
`;

const Sidebar = () => {
  const genres = useSelector((state) => state.config.genres);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <StickyBox>
      <Wrapper>
        <Logo />
        <Heading>Discover</Heading>
        {STATIC_CATEGORIES.map((category, i) => (
          <LinkWrap
            to={`/discover/${category}`}
            key={i}
          >
            <MenuItem
              mobile={0}
              title={category}
              selected={isActive(`/discover/${category}`)}
            />
          </LinkWrap>
        ))}
        <Heading>Genres</Heading>
        {genres.map(genre => (
          <LinkWrap
            to={`/genres/${genre.name}`}
            key={genre.id}
          >
            <MenuItem
              mobile={0}
              title={genre.name}
              selected={isActive(`/genres/${genre.name}`)}
            />
          </LinkWrap>
        ))}
        <StyledCoffe
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.buymeacoffee.com/fidalgodev"
        >
          <img
            src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg"
            alt="Buy me a coffee"
          />
          <span style={{ marginLeft: '5px' }}>Buy me a coffee</span>
        </StyledCoffe>
        <CopyRight>
          Copyright ©
          <StyledLink href="https://www.github.com/fidalgodev">
            Fidalgo
          </StyledLink>
        </CopyRight>
        <Svg
          src={`${TmdbLogo}`}
          alt="The Movie Database"
          style={{ margin: '2rem 0' }}
        />
      </Wrapper>
    </StickyBox>
  );
};

export default Sidebar;
