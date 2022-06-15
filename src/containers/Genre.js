import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import queryString from 'query-string';
import Header from '../components/Header';
import styled from 'styled-components';
import { animateScroll as scroll } from 'react-scroll';

import { setSelectedMenu, getMoviesGenre, clearMovies } from '../actions';
import MoviesList from '../components/MoviesList';
import SortBy from '../components/SortBy';
import Loader from '../components/Loader';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

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
  const [option, setOption] = useState({
    value: 'popularity.desc',
    label: 'Popularity',
  });
  const params = queryString.parse(location.search);
  const { secure_base_url } = geral.base.images;

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
    option,
    clearMovies
  );

  // If loading
  if (movies.loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <Helmet>
        <title>{`${geral.selected} Movies`}</title>
      </Helmet>
      <Header title={geral.selected} subtitle="movies" />
      <SortBy option={option} setOption={setOption} />
      <MoviesList movies={movies} baseUrl={secure_base_url} />
    </Wrapper>
  );
};

// Hook to fetch the movies, will be called everytime the route or the filters from the state change
function useFetchMoviesGenre(
  genre,
  getMoviesGenre,
  params,
  option,
  clearMovies
) {
  useEffect(() => {
    scroll.scrollToTop({
      smooth: true,
    });
    getMoviesGenre(genre, params.page, option.value);
    return () => clearMovies();
  }, [genre, params.page, option]);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies }) => {
  return { geral, movies };
};

export default connect(
  mapStateToProps,
  { setSelectedMenu, getMoviesGenre, clearMovies }
)(Genre);
