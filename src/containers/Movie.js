import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import history from '../history';
import queryString from 'query-string';

import {
  getMovie,
  getRecommendations,
  clearRecommendations,
  clearMovie,
} from '../actions';
import Credits from '../components/Credits';
import Loader from '../components/Loader';
import MoviesList from '../components/MoviesList';

const MovieWrapper = styled.div`
  padding: 2rem;
`;

const MovieImg = styled.img`
  width: 200px;
  height: auto;
`;

const Movie = ({
  location,
  geral,
  match,
  movie,
  getMovie,
  clearMovie,
  recommended,
  getRecommendations,
  clearRecommendations,
}) => {
  const { base_url } = geral.base.images;
  const params = queryString.parse(location.search);

  // Fetch movie id when id on url changes
  useEffect(() => {
    getMovie(match.params.id);
    return () => clearMovie();
  }, [match.params.id]);

  // Fetch recommended movies everytime recommendations page change
  useEffect(() => {
    getRecommendations(match.params.id, params.page);
    return () => clearRecommendations();
  }, [params.page]);

  // If loading
  if (movie.loading) {
    return <Loader />;
  }

  function renderBack() {
    if (history.action === 'PUSH') {
      return <button onClick={history.goBack}>Back</button>;
    }
  }

  return (
    <div>
      <MovieWrapper>
        <h1>{movie.original_title}</h1>
        <MovieImg src={`${base_url}w780${movie.poster_path}`} />
        <p>{movie.overview}</p>
        <Credits cast={movie.cast} baseUrl={base_url} />
        {renderBack()}
        <h1> Recommended movies based on this:</h1>
        {recommended.loading ? (
          <Loader />
        ) : (
          <MoviesList movies={recommended} baseUrl={base_url} />
        )}
      </MovieWrapper>
    </div>
  );
};

const mapStateToProps = ({ movie, geral, recommended }) => ({
  movie,
  geral,
  recommended,
});

export default connect(
  mapStateToProps,
  { getMovie, clearMovie, getRecommendations, clearRecommendations }
)(Movie);
