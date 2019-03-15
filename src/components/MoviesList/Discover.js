import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import queryString from 'query-string';

import { setSelectedMenu, getMoviesDiscover } from '../../actions';
import NotFound from '../NotFound';
import Pagination from './Pagination';

const MovieWrapper = styled.div`
  padding: 2rem;
`;

const MovieImg = styled.img`
  width: 200px;
  height: auto;
`;

// Discover Component
const Discover = ({
  geral,
  match,
  location,
  setSelectedMenu,
  getMoviesDiscover,
  movies,
}) => {
  const { selected, base, staticCategories } = geral;
  const params = queryString.parse(location.search);
  // Call hook to set the sidebar selected menu if valid
  useSetSelected(match.params.name, setSelectedMenu, staticCategories);

  // Call hook to fetch movies discover, pass in the url query
  useFetchMoviesDiscover(match.params.name, getMoviesDiscover, params);

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

// Hook to set the selected menu on the sidebar, if url is valid
function useSetSelected(name, cb, staticCategories) {
  useEffect(() => {
    if (staticCategories.find(el => el === name)) {
      cb(name);
    }
  }, [name]);
}

// Hook to fetch the movies, will be called everytime the route or the filters from the state change
function useFetchMoviesDiscover(name, cb, params) {
  const query = name.replace(/\s+/g, '_').toLowerCase();
  useEffect(() => {
    cb(query, params.page);
  }, [query, params.page]);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies }) => {
  return { geral, movies };
};

export default connect(
  mapStateToProps,
  { setSelectedMenu, getMoviesDiscover }
)(Discover);
