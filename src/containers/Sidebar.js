import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import { slide as Menu } from 'react-burger-menu';
import { device } from '../utils/_devices';

import Logo from '../components/Logo';
import Loader from '../components/Loader';
import MenuItem from '../components/MenuItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 25rem;
  padding: 2rem;
  opacity: ${props => (props.isMobile ? '0' : '1')};
  visibility: ${props => (props.isMobile ? 'hidden' : 'visible')};
  margin: top: 4rem;
  color: var(--color-primary-dark);
  border-right: 1px solid var(--border-color);
  transition: all 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
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
     {
      text-decoration: none;
      box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5);
      opacity: 0.85;
      color: #000000;
    }
  }
`;

const CopyRight = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  color: ${props => (props.mobile ? '#fff' : 'var(--color-primary-dark)')};
  margin-bottom: ${props => (props.mobile ? '2rem' : '')};
`;

const StyledLink = styled.a`
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  color: inherit;
`;

var styles = {
  bmBurgerButton: {
    position: 'absolute',
    width: '25px',
    height: '20px',
    left: '20px',
    top: '20px',
  },
  bmBurgerBars: {
    background: '#263238',
  },
  bmCrossButton: {
    height: '24px',
    width: '24px',
    marginRight: '1rem',
  },
  bmCross: {
    background: '#fafafa',
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
  },
  bmMenu: {
    background: '#263238',
    overflowY: 'scroll',
    padding: '2.5em 1.5em',
  },
  bmItemList: {
    color: '#fafafa',
    padding: '0.8rem',
  },
  bmItem: {
    outline: 'none',
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)',
  },
};

const Sidebar = ({ genres, staticCategories, selected }) => {
  const [isMobile, setisMobile] = useState(false);
  const [isDesktop, setisDesktop] = useState(false);
  const [isOpened, setisOpened] = useState(false);

  // Set amount of items to show on slider based on the width of the element
  const changeMobile = () => {
    window.matchMedia(`${device.large}`).matches
      ? setisMobile(!isMobile)
      : setisDesktop(!isDesktop);
  };

  useEffect(() => {
    changeMobile();
    window.addEventListener('resize', changeMobile);
    return () => window.removeEventListener('resize', changeMobile);
  }, []);

  if (!isMobile && !isDesktop) {
    return null;
  }

  return isMobile ? (
    <Menu isOpen={isOpened} styles={styles}>
      <Heading>Discover</Heading>
      {renderStatic(staticCategories, selected, setisOpened)}
      <Heading>Genres</Heading>
      {renderGenres(genres, selected, setisOpened)}
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
      <CopyRight mobile={true}>
        Copyright ©
        <StyledLink href="https://www.github.com/fidalgodev">
          Fidalgo
        </StyledLink>
      </CopyRight>
    </Menu>
  ) : (
    <StickyBox>
      <Wrapper isMobile={isMobile}>
        <Logo />
        <Heading>Discover</Heading>
        {renderStatic(staticCategories, selected)}
        <Heading>Genres</Heading>
        {renderGenres(genres, selected)}
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
      </Wrapper>
    </StickyBox>
  );
};

function renderStatic(categories, selected, setisOpened) {
  return categories.map((category, i) => (
    <LinkWrap
      to={`${process.env.PUBLIC_URL}/discover/${category}`}
      key={i}
      onClick={setisOpened ? () => setisOpened(false) : null}
    >
      <MenuItem
        mobile={setisOpened ? 1 : 0}
        title={category}
        selected={category === selected ? true : false}
      />
    </LinkWrap>
  ));
}

function renderGenres(genres, selected, setisOpened) {
  return genres.map(genre => (
    <LinkWrap
      to={`${process.env.PUBLIC_URL}/genres/${genre.name}`}
      key={genre.id}
      onClick={setisOpened ? () => setisOpened(false) : null}
    >
      <MenuItem
        mobile={setisOpened ? 1 : 0}
        title={genre.name}
        selected={genre.name === selected ? true : false}
      />
    </LinkWrap>
  ));
}

const mapStateToProps = ({ geral }) => {
  return {
    staticCategories: geral.staticCategories,
    genres: geral.genres,
    selected: geral.selected,
  };
};

export default connect(mapStateToProps)(Sidebar);
