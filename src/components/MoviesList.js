import React, { useRef } from 'react';
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

  @media ${props => props.theme.mediaQueries.small} {
    grid-template-columns: repeat(auto-fit, minmax(10rem, 23rem));
    justify-content: space-around;
    grid-gap: 4rem 1.5rem;
  }

  @media ${props => props.theme.mediaQueries.smaller} {
    grid-template-columns: repeat(auto-fit, minmax(10rem, 18rem));
    grid-gap: 4rem 1rem;
  }
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
