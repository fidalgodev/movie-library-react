import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import MovieItem from './MovieItem';
import Pagination from './Pagination';

const MoviesWrapper = styled.div`
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 25rem));
  justify-content: space-between;
  align-content: space-between;
  align-items: start;
  grid-gap: 4rem 2rem;
  margin-bottom: 4rem;
`;

const MoviesList = ({ movies, baseUrl }) => {
  return (
    <React.Fragment>
      <MoviesWrapper>
        {movies.results.map(movie => (
          <MovieItem key={movie.id} movie={movie} baseUrl={baseUrl} />
        ))}
      </MoviesWrapper>
      <Pagination movies={movies} />
    </React.Fragment>
  );
};

export default MoviesList;
