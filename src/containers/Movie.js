import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import history from '../history';

import { getMovie } from '../actions';

import Credits from '../components/Credits';

const MovieWrapper = styled.div`
  padding: 2rem;
`;

const MovieImg = styled.img`
  width: 200px;
  height: auto;
`;

const Movie = ({ geral, match, movie, getMovie }) => {
  const { base_url } = geral.base.images;

  // Fetch movie id when id on url changes
  useEffect(() => {
    getMovie(match.params.id);
  }, [match.params.id]);

  // If empty, fetching
  if (Object.entries(movie).length === 0) {
    return <div> Loading...</div>;
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
      </MovieWrapper>
    </div>
  );
};

const mapStateToProps = ({ movie, geral }) => ({ movie, geral });

export default connect(
  mapStateToProps,
  { getMovie }
)(Movie);
