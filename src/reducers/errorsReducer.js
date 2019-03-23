import * as TYPES from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case TYPES.INSERT_ERROR:
      return action.payload;
    case TYPES.CLEAR_ERROR:
      return [];
    default:
      return state;
  }
};
