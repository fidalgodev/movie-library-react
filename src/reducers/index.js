import { combineReducers } from 'redux';
import configReducer from './configReducer';
import moviesReducer from './moviesReducer';

export default combineReducers({
  geral: configReducer,
  movies: moviesReducer,
});
