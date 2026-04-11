import { configureStore } from '@reduxjs/toolkit';
import {
  config,
  movies,
  movie,
  person,
  recommendations,
  moviesForPerson,
  errors,
} from './slices';

export const store = configureStore({
  reducer: {
    config,
    movies,
    movie,
    person,
    recommendations,
    moviesForPerson,
    errors,
  },
});
