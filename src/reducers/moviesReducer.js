import * as TYPES from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case TYPES.FETCH_MOVIES_GENRE:
    case TYPES.FETCH_MOVIES_DISCOVER:
    case TYPES.FETCH_MOVIES_SEARCH:
      return action.payload;
    default:
      return state;
  }
};
