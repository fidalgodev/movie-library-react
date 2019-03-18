import * as TYPES from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case TYPES.FETCH_PERSON:
      return action.payload;
    case TYPES.CLEAR_PREVIOUS_PERSON:
      return {};
    default:
      return state;
  }
};
