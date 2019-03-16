import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getMovie, setHeader } from '../../actions';

const MovieWrapper = styled.div`
  padding: 2rem;
`;

const MovieImg = styled.img`
  width: 200px;
  height: auto;
`;

const Movie = ({ geral, match, movie, getMovie, setHeader }) => {
  const { base_url } = geral.base.images;
  useEffect(() => {
    useFetchMovie(getMovie, match.params.id, setHeader);
    return () => {
      setHeader('');
    };
  }, [match.params.id]);
  if (Object.entries(movie).length === 0) {
    return <div> Loading...</div>;
  }
  return (
    <div>
      <MovieWrapper>
        <h1>{movie.original_title}</h1>
        <MovieImg src={`${base_url}w780${movie.poster_path}`} />
        <p>{movie.overview}</p>
      </MovieWrapper>
    </div>
  );
};

async function useFetchMovie(fn, id, setHeader) {
  const movie = await fn(id);
  setHeader(movie.original_title);
}

const mapStateToProps = ({ movie, geral }) => ({ movie, geral });

export default connect(
  mapStateToProps,
  { getMovie, setHeader }
)(Movie);
