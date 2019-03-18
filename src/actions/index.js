import * as TYPES from './types';
import tmdbAPI from '../api/tmdb';
import history from '../history';

// Action Creator to get the config object from the API
export const getConfig = () => async dispatch => {
  const res = await tmdbAPI.get('/configuration');
  dispatch({
    type: TYPES.GET_CONFIG,
    payload: res.data,
  });
};

// Get genres from API
export const getGenres = () => async dispatch => {
  const res = await tmdbAPI.get('/genre/movie/list');
  dispatch({
    type: TYPES.GET_GENRES,
    payload: res.data,
  });
};

// Set the current selected menu (discover or genre), if is valid
export const setSelectedMenu = name => (dispatch, getState) => {
  const { staticCategories, genres } = getState().geral;
  if (!name) {
    dispatch({ type: TYPES.REMOVE_SELECTED_MENU });
    dispatch(setHeader());
  } else if (
    staticCategories.find(category => category === name) ||
    genres.find(genre => genre.name === name)
  ) {
    dispatch({
      type: TYPES.SELECTED_MENU,
      payload: name,
    });
    dispatch(setHeader(name));
  } else {
    history.push('/404');
  }
};

// Get movies genre
export const getMoviesGenre = (name, page, sort) => async (
  dispatch,
  getState
) => {
  dispatch({
    type: TYPES.CLEAR_PREVIOUS_MOVIES,
  });
  const { selected, genres } = getState().geral;
  if (!selected) {
    return;
  }
  const genreId = genres
    .filter(el => el.name === name)
    .map(el => el.id)
    .join('');
  const res = await tmdbAPI.get('/discover/movie', {
    params: {
      with_genres: genreId,
      page,
      sort_by: sort,
    },
  });
  dispatch({
    type: TYPES.FETCH_MOVIES_GENRE,
    payload: res.data,
  });
};

// Get movies discover
export const getMoviesDiscover = (name, page) => async (dispatch, getState) => {
  dispatch({
    type: TYPES.CLEAR_PREVIOUS_MOVIES,
  });
  const { selected } = getState().geral;
  if (!selected) {
    return;
  }
  const res = await tmdbAPI.get(`/movie/${name}`, {
    params: {
      page,
    },
  });
  dispatch({
    type: TYPES.FETCH_MOVIES_DISCOVER,
    payload: res.data,
  });
};

// Get movies search
export const getMoviesSearch = (query, page) => async dispatch => {
  dispatch({
    type: TYPES.CLEAR_PREVIOUS_MOVIES,
  });
  const res = await tmdbAPI.get(`/search/movie`, {
    params: {
      query,
      page,
    },
  });
  dispatch({
    type: TYPES.FETCH_MOVIES_SEARCH,
    payload: res.data,
  });
};

// Set header title
export const setHeader = title => {
  if (!title) {
    return {
      type: TYPES.REMOVE_HEADER,
    };
  }
  return {
    type: TYPES.SET_HEADER,
    payload: title,
  };
};

// Get single movie
export const getMovie = id => async dispatch => {
  dispatch({
    type: TYPES.CLEAR_PREVIOUS_MOVIE,
  });
  const res = await tmdbAPI.get(`/movie/${id}`);
  dispatch({
    type: TYPES.FETCH_MOVIE,
    payload: res.data,
  });
  dispatch(getCredits());
};

// Get credits
export const getCredits = () => async (dispatch, getState) => {
  const { id } = getState().movie;
  const res = await tmdbAPI.get(`/movie/${id}/credits`);
  dispatch({
    type: TYPES.FETCH_CAST,
    payload: res.data.cast,
  });
};

// Get Person
export const getPerson = id => async dispatch => {
  dispatch({
    type: TYPES.CLEAR_PREVIOUS_PERSON,
  });
  const res = await tmdbAPI.get(`/person/${id}`);
  dispatch({
    type: TYPES.FETCH_PERSON,
    payload: res.data,
  });
};
