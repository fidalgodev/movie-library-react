import * as TYPES from '../actions/types';

export default (state = { loading: true }, action) => {
  switch (action.type) {
    case TYPES.FETCH_MOVIE:
      return { ...state, ...action.payload };
    case TYPES.FETCH_CAST:
      return { ...state, cast: action.payload };
    case TYPES.FETCH_MOVIE_LOADING:
      return { ...state, loading: true };
    case TYPES.FETCH_MOVIE_FINISHED:
      return { ...state, loading: false };
    default:
      return state;
  }
};
