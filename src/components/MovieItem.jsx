import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import NothingSvg from '../svg/nothing.svg';
import Rating from '../components/Rating';

const MovieWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  background: transparent;
  transition: transform 350ms cubic-bezier(0.215, 0.61, 0.355, 1);

  &:hover {
    transform: translateY(-0.8rem);
  }
`;

const PosterWrapper = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  border-radius: 1rem;
  background-color: var(--color-primary-dark);
  box-shadow: 0 1.2rem 2.4rem var(--shadow-color);
  transition: box-shadow 350ms cubic-bezier(0.215, 0.61, 0.355, 1);
  position: relative;

  ${MovieWrapper}:hover & {
    box-shadow: 0 2.4rem 4rem var(--shadow-color-dark);
  }
`;

const MovieImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${props => (props.$error ? 'contain' : 'cover')};
  padding: ${props => (props.$error ? '2rem' : '0')};
  display: block;
  transition: transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1);

  ${MovieWrapper}:hover & {
    transform: scale(1.06);
  }
`;

const DetailsWrapper = styled.div`
  padding: 1.6rem 0.4rem 0.4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  line-height: 1.3;
  transition: color 250ms ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3.65rem;

  ${MovieWrapper}:hover & {
    color: var(--color-primary);
  }
`;

const RatingsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-primary);
  font-size: 1.2rem;
`;

const MovieItem = ({ movie, baseUrl }) => {
  const [error, setError] = useState(false);

  return (
    <MovieWrapper to={`/movie/${movie.id}`}>
      <PosterWrapper>
        <MovieImg
          $error={error}
          src={`${baseUrl}w342${movie.poster_path}`}
          alt={movie.title}
          loading="lazy"
          // If no image, error will occur, we set error to true
          // And only change the src to the nothing svg if it isn't already, to avoid infinite callback
          onError={e => {
            setError(true);
            if (e.target.src !== `${NothingSvg}`) {
              e.target.src = `${NothingSvg}`;
            }
          }}
        />
      </PosterWrapper>
      <DetailsWrapper>
        <Title>{movie.title}</Title>
        <RatingsWrapper>
          <Rating number={movie.vote_average / 2} />
        </RatingsWrapper>
      </DetailsWrapper>
    </MovieWrapper>
  );
};

export default MovieItem;
