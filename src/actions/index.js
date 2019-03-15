import * as TYPES from './types';
import tmdbAPI from '../api/tmdb';

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

// Set the selected sidebar item
export const setSelectedMenu = name => {
  return {
    type: TYPES.SELECTED_MENU,
    payload: name,
  };
};

// Get movies genre
export const getMoviesGenre = (name, page, sort) => async (
  dispatch,
  getState
) => {
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
