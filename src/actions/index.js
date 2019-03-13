import * as TYPES from './types';
import tmdbAPI from '../api/tmdb';

export const getConf = () => async dispatch => {
  console.log('getting');
  const res = await tmdbAPI.get('/configuration');
  console.log(res);
  dispatch({
    type: TYPES.GET_CONFIG,
    payload: res.data,
  });
};
