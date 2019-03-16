import * as TYPES from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case TYPES.FETCH_MOVIE:
      return action.payload;
    default:
      return state;
  }
};
