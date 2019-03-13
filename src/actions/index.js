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
