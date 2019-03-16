import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import styled from 'styled-components';

import { setSelectedMenu, getMoviesGenre, setHeader } from '../../actions';
import NotFound from '../NotFound';
import Pagination from './Pagination';
import SortBy from './ShortBy';

const MovieWrapper = styled.div`
  padding: 2rem;
`;

const MovieImg = styled.img`
  width: 200px;
  height: auto;
`;

// Genres Component
// Gets geral object from State, Match from Router, Action Creators to set Selected menu and Movies from Store
const Genre = ({
  geral,
  match,
  setSelectedMenu,
  getMoviesGenre,
  setHeader,
  movies,
  location,
}) => {
  const [sort, setsort] = useState('popularity.desc');
  const { genres, selected, base } = geral;
  const params = queryString.parse(location.search);

  // Call hook to set the sidebar selected menu if valid
  useSetSelected(match.params.name, setSelectedMenu, genres, setHeader);

  // Call hook to fetch movies of the genre
  useFetchMoviesGenre(match.params.name, getMoviesGenre, params, sort);

  // If there is no selected on state, means url used was not valid, return 404
  if (!selected) {
    return <NotFound />;
  }

  //If there are no movies, still fetching, loading
  if (!movies.results) {
    return <div>Loading</div>;
  }

  // Get base URL from the geral object
  const baseUrl = base.images.base_url;
  return (
    <div>
      <SortBy changeSort={setsort} />
      {renderMovies(movies.results, baseUrl)}
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

// Hook to fetch the movies, will be called everytime the route or the filters from the state change
function useFetchMoviesGenre(name, cb, params, sort) {
  useEffect(() => {
    cb(name, params.page, sort);
  }, [name, params.page, sort]);
}

// Hook to set the selected menu on the sidebar, if url is valid and genre exists on the state
function useSetSelected(name, cb, genres, setHeader) {
  useEffect(() => {
    if (genres.find(el => el.name === name)) {
      cb(name);
      setHeader(name);
    }
  }, [name]);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies }) => {
  return { geral, movies };
};

export default connect(
  mapStateToProps,
  { setSelectedMenu, getMoviesGenre, setHeader }
)(Genre);
