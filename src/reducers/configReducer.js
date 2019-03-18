import * as TYPES from '../actions/types';

const INITIAL_STATE = {
  staticCategories: ['Popular', 'Top Rated', 'Upcoming'],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.GET_CONFIG:
      return { ...state, base: action.payload };
    case TYPES.GET_GENRES:
      return { ...state, ...action.payload };
    case TYPES.SELECTED_MENU:
      return { ...state, selected: action.payload };
    case TYPES.REMOVE_SELECTED_MENU:
      return { ...state, selected: null };
    case TYPES.SET_HEADER:
      return { ...state, header: action.payload };
    case TYPES.REMOVE_HEADER:
      return { ...state, header: null };
    default:
      return state;
  }
};
