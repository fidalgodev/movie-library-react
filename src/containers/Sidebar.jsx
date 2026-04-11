import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import StickyBox from 'react-sticky-box';

import Logo from '../components/Logo';
import TmdbLogo from '../svg/tmdb.svg';
import MenuItem from '../components/MenuItem';
import { STATIC_CATEGORIES } from '../constants';

const Wrapper = styled.nav`
  display: flex;
  flex-direction: column;
  width: 26rem;
  padding: 3rem 2rem 2rem;
  color: var(--color-primary-dark);
  border-right: 1px solid var(--border-color);
  min-height: 100vh;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
`;

const Heading = styled.h2`
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-primary-light);
  opacity: 0.7;
  margin: 0 0 1rem 1.6rem;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const LinkWrap = styled(Link)`
  text-decoration: none;
  display: block;
  outline: none;
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 2.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.8rem;
`;

const StyledCoffee = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.6rem;
  color: var(--color-primary-dark);
  background-color: #fff;
  border: 1px solid var(--border-color);
  border-radius: 0.6rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-decoration: none;
  transition: all 200ms ease;

  img {
    width: 2rem;
    height: 2rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1.2rem var(--shadow-color);
    color: var(--color-primary);
  }
`;

const CopyRight = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: var(--color-primary-light);
`;

const StyledLink = styled.a`
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.4rem;
  color: var(--color-primary-dark);
  transition: color 200ms ease;

  &:hover {
    color: var(--color-primary);
  }
`;

const TmdbBadge = styled.img`
  max-width: 80%;
  height: 2.4rem;
  opacity: 0.7;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 1;
  }
`;

const Sidebar = () => {
  const genres = useSelector((state) => state.config.genres);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <StickyBox>
      <Wrapper>
        <Logo />

        <Section>
          <Heading>Discover</Heading>
          <MenuList>
            {STATIC_CATEGORIES.map((category) => (
              <LinkWrap to={`/discover/${category}`} key={category}>
                <MenuItem
                  mobile={0}
                  title={category}
                  selected={isActive(`/discover/${category}`)}
                />
              </LinkWrap>
            ))}
          </MenuList>
        </Section>

        <Section>
          <Heading>Genres</Heading>
          <MenuList>
            {genres.map((genre) => (
              <LinkWrap to={`/genres/${genre.name}`} key={genre.id}>
                <MenuItem
                  mobile={0}
                  title={genre.name}
                  selected={isActive(`/genres/${genre.name}`)}
                />
              </LinkWrap>
            ))}
          </MenuList>
        </Section>

        <Footer>
          <StyledCoffee
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.buymeacoffee.com/fidalgodev"
          >
            <img
              src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg"
              alt="Buy me a coffee"
            />
            <span>Buy me a coffee</span>
          </StyledCoffee>
          <CopyRight>
            Copyright ©
            <StyledLink
              href="https://www.github.com/fidalgodev"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fidalgo
            </StyledLink>
          </CopyRight>
          <TmdbBadge src={`${TmdbLogo}`} alt="The Movie Database" />
        </Footer>
      </Wrapper>
    </StickyBox>
  );
};

export default Sidebar;
