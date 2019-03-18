import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { setSelectedMenu, getMoviesGenre } from '../actions';
import MoviesList from '../components/MoviesList';
import SortBy from '../components/ShortBy';

// Genres Component
// Gets geral object from State, Match from Router, Action Creators to set Selected menu and Movies from Store
const Genre = ({
  match,
  setSelectedMenu,
  getMoviesGenre,
  movies,
  location,
}) => {
  const [sort, setsort] = useState('popularity.desc');
  const params = queryString.parse(location.search);

  // Send url to setSelected Action Creator, it will check if is valid, and set the header accordingly
  useEffect(() => {
    setSelectedMenu(match.params.name);
    // Clean up to remove selected menu from state
    return () => setSelectedMenu();
  }, [match.params.name]);

  // Call hook to fetch movies of the genre
  useFetchMoviesGenre(match.params.name, getMoviesGenre, params, sort);

  //If there are no movies, still fetching, loading
  if (Object.entries(movies).length === 0) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <SortBy changeSort={setsort} />
      <MoviesList />
    </div>
  );
};

// Hook to fetch the movies, will be called everytime the route or the filters from the state change
function useFetchMoviesGenre(name, cb, params, sort) {
  useEffect(() => {
    cb(name, params.page, sort);
  }, [name, params.page, sort]);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies }) => {
  return { geral, movies };
};

export default connect(
  mapStateToProps,
  { setSelectedMenu, getMoviesGenre }
)(Genre);
