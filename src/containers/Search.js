import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import Header from '../components/Header';
import NotFound from '../components/NotFound';
import styled from 'styled-components';

import { getMoviesSearch, clearMovies } from '../actions';
import MoviesList from '../components/MoviesList';
import Loader from '../components/Loader';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const Search = ({
  geral,
  match,
  location,
  getMoviesSearch,
  clearMovies,
  movies,
}) => {
  const { query } = match.params;
  const params = queryString.parse(location.search);
  const { secure_base_url } = geral.base.images;

  // When mounts go up
  useEffect(() => {
    window.scrollTo({
      top: (0, 0),
      behavior: 'smooth',
    });
  }, []);

  // Fetch movies hook
  useFetchMoviesSearch(query, getMoviesSearch, params, clearMovies);

  // If loading
  if (movies.loading) {
    return <Loader />;
  }

  //If there are no results
  else if (movies.total_results === 0) {
    return (
      <NotFound
        title="Sorry!"
        subtitle={`There were no results for ${query}...`}
      />
    );
  }

  // Else show the results
  else {
    return (
      <Wrapper>
        <Header title={query} subtitle="search results" />
        <MoviesList movies={movies} baseUrl={secure_base_url} />;
      </Wrapper>
    );
  }
};

// Hook to fetch the movies, will be called everytime the route for the search changes
function useFetchMoviesSearch(query, getMoviesSearch, params, clearMovies) {
  useEffect(() => {
    window.scrollTo({
      top: (0, 0),
      behavior: 'smooth',
    });
    getMoviesSearch(query, params.page);
    return () => clearMovies();
  }, [query, params.page]);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies }) => {
  return { geral, movies };
};

export default connect(
  mapStateToProps,
  { getMoviesSearch, clearMovies }
)(Search);
