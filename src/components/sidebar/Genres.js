import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getGenres } from '../../actions';

import MenuItem from './MenuItem';

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

// Component
const Genres = ({ getGenres, genres }) => {
  useFetchGenres(getGenres);
  if (!genres) {
    return 'Loading';
  }
  return (
    <>
      <Heading>Genres</Heading>
      {renderList(genres)}
    </>
  );
};

// Render List of Genres Available
function renderList(genres) {
  return genres.map(genre => (
    <MenuItem key={genre.id} title={genre.name} genres />
  ));
}

// Custom Hook to Fecth Genres
function useFetchGenres(cb) {
  useEffect(() => {
    cb();
  }, []);
}

// Map State to Component Props
const mapStateToProps = ({ geral }) => {
  return { genres: geral.genres };
};

export default connect(
  mapStateToProps,
  {
    getGenres,
  }
)(Genres);
