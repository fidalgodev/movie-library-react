import * as TYPES from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case TYPES.GET_CONFIG:
      return action.payload;
    default:
      return state;
  }
};
