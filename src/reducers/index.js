import { combineReducers } from 'redux';
import configReducer from './configReducer';
import moviesReducer from './moviesReducer';
import movieReducer from './movieReducer';
import personReducer from './personReducer';
import recommendationsReducer from './recommendationsReducer';
import moviesPersonReducer from './moviesPersonReducer';
import errorsReducer from './errorsReducer';

export default combineReducers({
  geral: configReducer,
  movies: moviesReducer,
  movie: movieReducer,
  person: personReducer,
  recommended: recommendationsReducer,
  moviesPerson: moviesPersonReducer,
  errors: errorsReducer,
});
