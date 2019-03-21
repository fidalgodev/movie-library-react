import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import Header from '../components/Header';

import { setSelectedMenu, getMoviesDiscover, clearMovies } from '../actions';
import MoviesList from '../components/MoviesList';
import Loader from '../components/Loader';

// Discover Component
const Discover = ({
  geral,
  match,
  location,
  setSelectedMenu,
  getMoviesDiscover,
  clearMovies,
  movies,
}) => {
  const params = queryString.parse(location.search);
  const { base_url } = geral.base.images;

  // Send url to setSelected Action Creator, it will check if is valid
  useEffect(() => {
    setSelectedMenu(match.params.name);
    // Clean up to remove selected menu from state
    return () => setSelectedMenu();
  }, [match.params.name]);

  // Call hook to fetch movies discover, pass in the url query
  useFetchMoviesDiscover(
    match.params.name,
    getMoviesDiscover,
    params,
    clearMovies
  );

  // If loading
  if (movies.loading) {
    return <Loader />;
  }

  // Else return movies list
  return (
    <React.Fragment>
      <Header title={geral.selected} subtitle="movies" />
      <MoviesList movies={movies} baseUrl={base_url} />;
    </React.Fragment>
  );
};

// Hook to fetch the movies, will be called everytime the route or the filters from the state change
function useFetchMoviesDiscover(name, getMoviesDiscover, params, clearMovies) {
  const query = name.replace(/\s+/g, '_').toLowerCase();
  useEffect(() => {
    getMoviesDiscover(query, params.page);
    return () => clearMovies();
  }, [query, params.page]);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies }) => {
  return { geral, movies };
};

export default connect(
  mapStateToProps,
  { setSelectedMenu, getMoviesDiscover, clearMovies }
)(Discover);
