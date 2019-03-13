import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getGenres } from '../../actions';

import MenuItem from './MenuItem';

// Component
const Genres = ({ getGenres, genres }) => {
  useFetchGenres(getGenres);
  if (!genres) {
    return 'Loading';
  }
  return <>{renderList(genres)}</>;
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
