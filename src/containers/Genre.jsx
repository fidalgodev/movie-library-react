import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import styled from 'styled-components';
import { animateScroll as scroll } from 'react-scroll';

import { fetchMoviesGenre, clearMovies } from '../slices/moviesSlice';
import { selectIsValidMenuName } from '../slices/configSlice';
import MoviesList from '../components/MoviesList';
import SortBy from '../components/SortBy';
import Loader from '../components/Loader';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

// Genres Component
const Genre = () => {
  const [option, setOption] = useState({
    value: 'popularity.desc',
    label: 'Popularity',
  });

  const { name } = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isValidName = useSelector(selectIsValidMenuName(name));
  const movies = useSelector((state) => state.movies);
  const secureBaseUrl = useSelector(
    (state) => state.config.base?.images?.secure_base_url
  );

  useEffect(() => {
    if (!isValidName) {
      navigate('/404', { replace: true });
      return;
    }
    scroll.scrollToTop({ smooth: true });
    dispatch(fetchMoviesGenre({ name, page, sort: option.value }));
    return () => dispatch(clearMovies());
  }, [isValidName, name, page, option, dispatch, navigate]);

  // If loading
  if (movies.loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <Helmet>
        <title>{`${name} Movies`}</title>
      </Helmet>
      <Header title={name} subtitle="movies" />
      <SortBy option={option} setOption={setOption} />
      <MoviesList movies={movies} baseUrl={secureBaseUrl} />
    </Wrapper>
  );
};

export default Genre;
