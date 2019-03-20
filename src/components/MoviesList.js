import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Pagination from './Pagination';
import Stars from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as starSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as starRegular } from '@fortawesome/free-regular-svg-icons';

const MoviesWrapper = styled.div`
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 25rem));
  justify-content: space-around;
  align-content: space-between;
  align-items: start;
  grid-gap: 4rem 2rem;
  margin-bottom: 4rem;
`;

const MovieWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  background-color: transparent;
  border-radius: 0.8rem;
  transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
  position: relative;

  &:hover {
    transform: scale(1.03);

    ::after {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0.8rem;
    transform: scaleY(0);
    transform-origin: top;
    opacity: 0;
    background-color: var(--color-primary);
    z-index: -2;
    box-shadow: 0rem 2rem 5rem var(--shadow-color-dark);
    transition: all 100ms cubic-bezier(0.215, 0.61, 0.355, 1);
  }
`;

const MovieImg = styled.img`
  width: 100%;
  height: 38rem;
  object-fit: cover;
  border-radius: 0.8rem;
  transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
  box-shadow: 0rem 2rem 5rem var(--shadow-color);

  ${MovieWrapper}:hover & {
    border-radius: 0.8rem 0.8rem 0rem 0rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--color-primary-light);
  margin-bottom: 1rem;
  line-height: 1.4;
  transition: color 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

  ${MovieWrapper}:hover & {
    color: var(--text-color);
  }
`;

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
`;

const RatingsWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
`;

const Rating = styled(Stars)`
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const FontAwesome = styled(FontAwesomeIcon)`
  color: var(--color-primary);
  transition: color 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

  ${MovieWrapper}:hover & {
    color: var(--color-primary-lighter);
  }
`;

const Year = styled.p`
  color: var(--color-primary-dark);
  font-weight: 600;
  font-size: 1rem;
  transition: color 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

  ${MovieWrapper}:hover & {
    color: var(--color-primary-lighter);
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  opacity: 0
  width: 120px;
  font-weight: 500;
  font-size: 1.1rem;
  background-color: var(--color-primary-light);
  color: var(--text-color);
  text-align: center;
  border-radius: 6px;
  padding: 1rem;
  position: absolute;
  z-index: 999;
  bottom: 150%;
  left: 50%;
  margin-left: -60px;
  transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
    border-color: var(--color-primary-light) transparent transparent transparent;
  }

  ${RatingsWrapper}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

const MoviesList = ({ movies, baseUrl }) => {
  return (
    <React.Fragment>
      <MoviesWrapper>{renderMovies(movies.results, baseUrl)}</MoviesWrapper>
      <Pagination movies={movies} />
    </React.Fragment>
  );
};

// Function to render list of movies
function renderMovies(movies, baseUrl) {
  return movies.map(movie => (
    <MovieWrapper to={`/movie/${movie.id}`} key={movie.id}>
      <MovieImg src={`${baseUrl}w780${movie.poster_path}`} />
      <DetailsWrapper>
        <Title>{movie.title}</Title>
        <RatingsWrapper>
          <Rating
            emptySymbol={<FontAwesome icon={starRegular} size="1x" />}
            fullSymbol={<FontAwesome icon={starSolid} size="1x" />}
            initialRating={movie.vote_average / 2}
            readonly
          />
          <Tooltip>
            {movie.vote_average} average rating on {movie.vote_count} votes
          </Tooltip>
        </RatingsWrapper>
        <Year>{splitYear(movie.release_date)}</Year>
      </DetailsWrapper>
    </MovieWrapper>
  ));
}

function splitYear(date) {
  const [year] = date.split('-');
  return year;
}

export default MoviesList;
