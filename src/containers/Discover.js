import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import queryString from 'query-string';
import Header from '../components/Header';
import styled from 'styled-components';
import { animateScroll as scroll } from 'react-scroll';
import DefaultLayout from '../layouts';

import { withTranslate } from 'react-redux-multilingual';
import { setLocale } from 'react-redux-multilingual/src/actions';
import { setSelectedMenu, getMoviesDiscover, clearMovies } from '../actions';
import MoviesList from '../components/MoviesList';
import Loader from '../components/Loader';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

// Discover Component
const Discover = ({
  geral,
  match,
  location,
  setSelectedMenu,
  getMoviesDiscover,
  clearMovies,
  movies,
  translate,
  setLocale,
}) => {
  const params = queryString.parse(location.search);
  const { secure_base_url } = geral.base.images;

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
    <DefaultLayout
      title={`${geral.selected} Movies`}
    >
        <Wrapper>
            <React.Fragment>
                { translate('pages.discover.title') }
                <span
                    onClick={() => {
                        setLocale('en');
                    }}>EN</span>
                <span
                    onClick={() => {
                        setLocale('es');
                    }}>ES</span>
            </React.Fragment>
            <Header title={geral.selected} subtitle="movies" />
            <MoviesList movies={movies} baseUrl={secure_base_url} />
        </Wrapper>
    </DefaultLayout>
  );
};

// Hook to fetch the movies, will be called everytime the route or the filters from the state change
function useFetchMoviesDiscover(name, getMoviesDiscover, params, clearMovies) {
  const query = name.replace(/\s+/g, '_').toLowerCase();
  useEffect(() => {
    scroll.scrollToTop({
      smooth: true,
    });
    getMoviesDiscover(query, params.page);
    return () => clearMovies();
  }, [query, params.page]);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies }) => {
  return { geral, movies };
};

export default compose(
    withTranslate,
    connect(
        mapStateToProps,
        { setSelectedMenu, getMoviesDiscover, clearMovies, setLocale }
    )
)(Discover);