import * as TYPES from '../actions/types';

export default (state = { loading: true }, action) => {
  switch (action.type) {
    case TYPES.FETCH_MOVIES_GENRE:
    case TYPES.FETCH_MOVIES_DISCOVER:
    case TYPES.FETCH_MOVIES_SEARCH:
      return { ...state, ...action.payload };
    case TYPES.FETCH_MOVIES_LOADING:
      return { ...state, loading: true };
    case TYPES.FETCH_MOVIES_FINISHED:
      return { ...state, loading: false };
    default:
      return state;
  }
};
