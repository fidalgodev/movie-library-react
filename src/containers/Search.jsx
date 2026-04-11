import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import NotFound from '../components/NotFound';
import styled from 'styled-components';
import { animateScroll as scroll } from 'react-scroll';

import { fetchMoviesSearch, clearMovies } from '../slices/moviesSlice';
import MoviesList from '../components/MoviesList';
import Loader from '../components/Loader';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const Search = () => {
  const { query } = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const dispatch = useDispatch();

  const movies = useSelector((state) => state.movies);
  const secureBaseUrl = useSelector(
    (state) => state.config.base?.images?.secure_base_url
  );

  useEffect(() => {
    scroll.scrollToTop({ smooth: true });
    dispatch(fetchMoviesSearch({ query, page }));
    return () => dispatch(clearMovies());
  }, [query, page, dispatch]);

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
        <Helmet>
          <title>{`${query} - search results`}</title>
        </Helmet>
        <Header title={query} subtitle="search results" />
        <MoviesList movies={movies} baseUrl={secureBaseUrl} />;
      </Wrapper>
    );
  }
};

export default Search;
