import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { setSelectedMenu, getMoviesDiscover, setHeader } from '../../actions';
import NotFound from '../NotFound';
import MoviesList from './MoviesList';

// Discover Component
const Discover = ({
  geral,
  match,
  location,
  setSelectedMenu,
  getMoviesDiscover,
  setHeader,
  movies,
}) => {
  const { selected, staticCategories } = geral;
  const params = queryString.parse(location.search);

  // Call hook to set the sidebar selected menu if valid
  useSetSelected(
    match.params.name,
    setSelectedMenu,
    staticCategories,
    setHeader
  );

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

  // Else return movies list
  return (
    <div>
      <MoviesList />
    </div>
  );
};

// Hook to set the selected menu on the sidebar, if url is valid
function useSetSelected(name, cb, staticCategories, setHeader) {
  useEffect(() => {
    if (staticCategories.find(el => el === name)) {
      cb(name);
      setHeader(name);
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
  { setSelectedMenu, getMoviesDiscover, setHeader }
)(Discover);
