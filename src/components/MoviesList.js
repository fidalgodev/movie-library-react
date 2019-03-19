import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Pagination from './Pagination';
import Stars from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as starSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as starRegular } from '@fortawesome/free-regular-svg-icons';

const FontAwesome = styled(FontAwesomeIcon)`
  color: var(--color-primary);
`;

const MoviesWrapper = styled.div`
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 25rem));
  justify-content: space-between;
  align-content: space-between;
  grid-gap: 2rem;
  margin-bottom: 4rem;
`;

const MovieWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  text-decoration: none;
`;

const MovieImg = styled.img`
  width: 100%;
  height: auto;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  margin-bottom: 0.5rem;
`;

const DetailsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RatingsWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  margin-right: auto;
`;

const Rating = styled(Stars)`
  margin-right: 0.5rem;
  line-height: 1;
`;

const Year = styled.p`
  color: var(--link-color);
  font-weight: 400;
  font-size: 1.1rem;
`;

const Tooltip = styled.span`
  visibility: hidden;
  width: 120px;
  font-weight: 700;
  font-size: 1.1rem;
  background-color: var(--color-primary-dark);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 1rem;
  position: absolute;
  z-index: 999;
  bottom: 150%;
  left: 50%;
  margin-left: -60px;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--color-primary-dark) transparent transparent transparent;
  }

  ${RatingsWrapper}:hover & {
    visibility: visible;
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
      <Title>{movie.title}</Title>
      <DetailsWrapper>
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
