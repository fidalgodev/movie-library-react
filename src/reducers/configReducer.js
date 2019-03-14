import * as TYPES from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case TYPES.GET_CONFIG:
      return { ...state, base: action.payload };
    case TYPES.GET_GENRES:
      return { ...state, ...action.payload };
    case TYPES.SELECTED_MENU:
      return { ...state, selected: action.payload };
    default:
      return state;
  }
};
