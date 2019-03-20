import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Logo from '../components/Logo';
import MenuItem from '../components/MenuItem';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;
  width: 28rem;
  color: var(--color-primary-dark);
  margin: 2rem 0;
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

const MenuWrapper = styled.div`
  width: 100%;
  padding: 2rem 3rem;
  position: relative;
  border-right: 1px solid var(--border-color);
`;

const LinkWrap = styled(Link)`
  text-decoration: none;
  display: block;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const Sidebar = ({ genres, staticCategories, selected }) => {
  return (
    <Wrapper>
      <Logo />
      <MenuWrapper>
        <Heading>Discover</Heading>
        {renderStatic(staticCategories, selected)}
        <Heading>Genres</Heading>
        {renderGenres(genres, selected)}
      </MenuWrapper>
    </Wrapper>
  );
};

function renderStatic(categories, selected) {
  return categories.map((category, i) => (
    <LinkWrap to={`/discover/${category}`} key={i}>
      <MenuItem
        title={category}
        selected={category === selected ? true : false}
      />
    </LinkWrap>
  ));
}

function renderGenres(genres, selected) {
  return genres.map(genre => (
    <LinkWrap to={`/genres/${genre.name}`} key={genre.id}>
      <MenuItem
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
