import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { setHeader, getMoviesSearch } from '../actions';
import MoviesList from '../components/MoviesList';

const Search = ({ match, location, setHeader, getMoviesSearch, movies }) => {
  const { query } = match.params;
  const params = queryString.parse(location.search);

  // Change Header everytime query change
  useEffect(() => {
    const title = `Search results for: ${query}`;
    setHeader(title);
    return () => {
      setHeader();
    };
  }, [query]);

  // Fetch movies hook
  useFetchMoviesSearch(query, getMoviesSearch, params);

  //If there are no movies, still fetching, loading
  if (Object.entries(movies).length === 0) {
    return <div>Loading</div>;
  }

  //If there are no results
  else if (movies.total_results === 0) {
    return <div>No results</div>;
  }

  // Else show the results
  else {
    return (
      <div>
        <MoviesList />
      </div>
    );
  }
};

// Hook to fetch the movies, will be called everytime the route for the search changes
function useFetchMoviesSearch(query, cb, params) {
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
  {
    setHeader,
    getMoviesSearch,
  }
)(Search);
