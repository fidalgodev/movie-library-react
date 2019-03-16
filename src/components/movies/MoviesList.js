import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Pagination from './Pagination';

const MovieWrapper = styled.div`
  padding: 2rem;
`;

const MovieImg = styled.img`
  width: 200px;
  height: auto;
`;

const MoviesList = ({ movies, base }) => {
  const { base_url } = base.images;
  return (
    <div>
      {renderMovies(movies.results, base_url)}
      <Pagination />
    </div>
  );
};

// Function to render list of movies
function renderMovies(movies, baseUrl) {
  return movies.map(movie => (
    <MovieWrapper key={movie.id}>
      {movie.original_title}
      <MovieImg src={`${baseUrl}w780${movie.poster_path}`} />
    </MovieWrapper>
  ));
}

const mapStateToProps = ({ movies, geral }) => {
  return { movies, base: geral.base };
};

export default connect(mapStateToProps)(MoviesList);
