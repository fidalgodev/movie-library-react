import * as TYPES from '../actions/types';

export default (state = { loading: true }, action) => {
  switch (action.type) {
    case TYPES.FETCH_PERSON:
      return { ...state, ...action.payload };
    case TYPES.FETCH_PERSON_LOADING:
      return { ...state, loading: true };
    case TYPES.FETCH_PERSON_FINISHED:
      return { ...state, loading: false };
    default:
      return state;
  }
};
