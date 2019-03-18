import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { setSelectedMenu, getMoviesDiscover } from '../actions';
import MoviesList from '../components/MoviesList';

// Discover Component
const Discover = ({
  match,
  location,
  setSelectedMenu,
  getMoviesDiscover,
  movies,
}) => {
  const params = queryString.parse(location.search);

  // Send url to setSelected Action Creator, it will check if is valid, and set the header accordingly
  useEffect(() => {
    setSelectedMenu(match.params.name);
    // Clean up to remove selected menu from state
    return () => setSelectedMenu();
  }, [match.params.name]);

  // Call hook to fetch movies discover, pass in the url query
  useFetchMoviesDiscover(match.params.name, getMoviesDiscover, params);

  //If there are no movies, still fetching, loading
  if (Object.entries(movies).length === 0) {
    return <div>Loading</div>;
  }

  // Else return movies list
  return (
    <div>
      <MoviesList />
    </div>
  );
};

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
