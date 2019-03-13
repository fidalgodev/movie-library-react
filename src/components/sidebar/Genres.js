import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getGenres } from '../../actions';

const Genres = ({ getGenres, genres }) => {
  useFetchGenres(getGenres);
  if (!genres) {
    return 'Loading';
  }
  return <div>{renderList(genres)}</div>;
};

function renderList(genres) {
  return genres.map(genre => <li key={genre.id}>{genre.name}</li>);
}

function useFetchGenres(cb) {
  useEffect(() => {
    cb();
  }, []);
}

const mapStateToProps = ({ geral }) => {
  return { genres: geral.genres };
};

export default connect(
  mapStateToProps,
  {
    getGenres,
  }
)(Genres);
