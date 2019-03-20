import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { setSelectedMenu, getMoviesDiscover } from '../actions';
import MoviesList from '../components/MoviesList';
import Loader from '../components/Loader';

// Discover Component
const Discover = ({
  geral,
  match,
  location,
  setSelectedMenu,
  getMoviesDiscover,
  movies,
}) => {
  const params = queryString.parse(location.search);
  const { base_url } = geral.base.images;

  // Send url to setSelected Action Creator, it will check if is valid, and set the header accordingly
  useEffect(() => {
    setSelectedMenu(match.params.name);
    // Clean up to remove selected menu from state
    return () => setSelectedMenu();
  }, [match.params.name]);

  // Call hook to fetch movies discover, pass in the url query
  useFetchMoviesDiscover(match.params.name, getMoviesDiscover, params);

  // If loading
  if (movies.loading) {
    return <Loader />;
  }

  // Else return movies list
  return <MoviesList movies={movies} baseUrl={base_url} />;
};

// Hook to fetch the movies, will be called everytime the route or the filters from the state change
function useFetchMoviesDiscover(name, getMoviesDiscover, params) {
  const query = name.replace(/\s+/g, '_').toLowerCase();
  useEffect(() => {
    getMoviesDiscover(query, params.page);
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
