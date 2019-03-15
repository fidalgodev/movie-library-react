import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getGenres } from '../../actions';

import MenuItem from './MenuItem';

const LinkWrap = styled(Link)`
  text-decoration: none;
`;

// Sidebar genres component, gets action creator to fetch the genres and the genres from the state
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
    <LinkWrap to={`/genres/${genre.name}`} key={genre.id}>
      <MenuItem title={genre.name} genres />
    </LinkWrap>
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
