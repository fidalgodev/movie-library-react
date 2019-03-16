import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { setHeader, setSelectedMenu, getMoviesSearch } from '../../actions';
import MoviesList from './MoviesList';

const Search = ({
  match,
  location,
  setSelectedMenu,
  setHeader,
  getMoviesSearch,
  movies,
}) => {
  const { query } = match.params;
  const params = queryString.parse(location.search);
  useRemoveSelected(setSelectedMenu);
  useSetHeader(query, setHeader);
  useFetchMoviesSearch(query, getMoviesSearch, params);

  //If there are no movies, still fetching, loading
  if (!movies.results) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <MoviesList />
    </div>
  );
};

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
