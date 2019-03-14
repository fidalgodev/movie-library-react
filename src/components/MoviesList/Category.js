import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setSelectedMenu, getMoviesGenre } from '../../actions';
import NotFound from '../NotFound';
import styled from 'styled-components';

const MovieWrapper = styled.div`
  padding: 2rem;
`;

const MovieImg = styled.img`
  width: 200px;
  height: auto;
`;

const Category = ({
  genres,
  match,
  setSelectedMenu,
  getMoviesGenre,
  movies,
  base,
}) => {
  useSetSelected(match.params.name, setSelectedMenu);
  useFetchMoviesGenre(match.params.name, getMoviesGenre, genres);

  if (!movies.results) {
    return <div>Loading</div>;
  }
  console.log(movies.results);
  const baseUrl = base.images.base_url;
  return <div>{renderMovies(movies.results, baseUrl)}</div>;
};

function renderMovies(movies, baseUrl) {
  return movies.map(movie => (
    <MovieWrapper key={movie.id}>
      {movie.original_title}
      <MovieImg src={`${baseUrl}w780${movie.poster_path}`} />
    </MovieWrapper>
  ));
}

function useFetchMoviesGenre(name, cb, genres) {
  useEffect(() => {
    cb(name);
  }, [genres, name]);
}

function useSetSelected(name, cb) {
  useEffect(() => {
    cb(name);
  }, [name]);
}

const mapStateToProps = ({ geral, movies }) => {
  return { genres: geral.genres, movies, base: geral.base };
};

export default connect(
  mapStateToProps,
  { setSelectedMenu, getMoviesGenre }
)(Category);
