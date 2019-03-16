import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import styled from 'styled-components';

import { setHeader, setSelectedMenu, getMoviesSearch } from '../../actions';
import NotFound from '../NotFound';
import Pagination from './Pagination';

const MovieWrapper = styled.div`
  padding: 2rem;
`;

const MovieImg = styled.img`
  width: 200px;
  height: auto;
`;

const Search = ({
  match,
  location,
  setSelectedMenu,
  setHeader,
  getMoviesSearch,
  movies,
  geral,
}) => {
  const { base } = geral;
  const { query } = match.params;
  const params = queryString.parse(location.search);
  useRemoveSelected(setSelectedMenu);
  useSetHeader(query, setHeader);
  useFetchMoviesSearch(query, getMoviesSearch, params);

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

function useSetHeader(query, cb) {
  useEffect(() => {
    const title = `Search results for: ${query}`;
    cb(title);
  }, [query]);
}

// Hook to fetch the movies, will be called everytime the route for the search changes
function useFetchMoviesSearch(query, cb, params) {
  useEffect(() => {
    cb(query, params.page);
  }, [query, params.page]);
}

function useRemoveSelected(cb) {
  useEffect(() => {
    cb();
  }, []);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies }) => {
  return { geral, movies };
};

export default connect(
  mapStateToProps,
  {
    setHeader,
    setSelectedMenu,
    getMoviesSearch,
  }
)(Search);
