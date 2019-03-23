import * as TYPES from '../actions/types';

export default (state = { loading: true }, action) => {
  switch (action.type) {
    case TYPES.FETCH_MOVIESPERSON:
      return { ...state, ...action.payload };
    case TYPES.FETCH_MOVIESPERSON_LOADING:
      return { ...state, loading: true };
    case TYPES.FETCH_MOVIESPERSON_FINISHED:
      return { ...state, loading: false };
    default:
      return state;
  }
};
