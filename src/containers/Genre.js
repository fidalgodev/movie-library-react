import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { setSelectedMenu, getMoviesGenre, clearMovies } from '../actions';
import MoviesList from '../components/MoviesList';
import SortBy from '../components/ShortBy';
import Loader from '../components/Loader';

// Genres Component
// Gets geral object from State, Match from Router, Action Creators to set Selected menu and Movies from Store
const Genre = ({
  geral,
  match,
  setSelectedMenu,
  getMoviesGenre,
  clearMovies,
  movies,
  location,
}) => {
  const [sort, setsort] = useState('popularity.desc');
  const params = queryString.parse(location.search);
  const { base_url } = geral.base.images;

  // Send url to setSelected Action Creator, it will check if is valid, and set the header accordingly
  useEffect(() => {
    setSelectedMenu(match.params.name);
    // Clean up to remove selected menu from state
    return () => setSelectedMenu();
  }, [match.params.name]);

  // Call hook to fetch movies of the genre
  useFetchMoviesGenre(
    match.params.name,
    getMoviesGenre,
    params,
    sort,
    clearMovies
  );

  // If loading
  if (movies.loading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <SortBy changeSort={setsort} />
      <MoviesList movies={movies} baseUrl={base_url} />
    </React.Fragment>
  );
};

// Hook to fetch the movies, will be called everytime the route or the filters from the state change
function useFetchMoviesGenre(genre, getMoviesGenre, params, sort, clearMovies) {
  useEffect(() => {
    getMoviesGenre(genre, params.page, sort);
    return () => clearMovies();
  }, [genre, params.page, sort]);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies }) => {
  return { geral, movies };
};

export default connect(
  mapStateToProps,
  { setSelectedMenu, getMoviesGenre, clearMovies }
)(Genre);
