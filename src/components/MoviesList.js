import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import MovieItem from './MovieItem';
import Pagination from './Pagination';

const MoviesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 25rem));
  justify-content: space-evenly;
  align-content: space-between;
  align-items: start;
  padding: 4rem 0;
  grid-gap: 4rem 2rem;
`;

const MoviesList = ({ movies, baseUrl }) => {
  if (movies.results.length === 0) {
    return null;
  }

  const Element = useRef();

  const scrollToMyRef = () => {
    window.scrollTo({
      top: (0, Element.current.offsetTop),
      behavior: 'smooth',
    });
  };

  return (
    <React.Fragment>
      <MoviesWrapper ref={Element}>
        {movies.results.map(movie => (
          <MovieItem key={movie.id} movie={movie} baseUrl={baseUrl} />
        ))}
      </MoviesWrapper>
      <Pagination movies={movies} scrollToMyRef={scrollToMyRef} />
    </React.Fragment>
  );
};

export default MoviesList;
