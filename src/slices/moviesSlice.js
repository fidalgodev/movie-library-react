import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const fetchMoviesDiscover = createAsyncThunk(
  'movies/fetchMoviesDiscover',
  async ({ name, page }) => {
    // `name` is a discover category like "popular", "top_rated", "upcoming"
    // TMDB endpoint uses lowercase_with_underscores; convert as needed
    const endpoint = name.toLowerCase().replace(/ /g, '_');
    const res = await tmdbAPI.get(`/movie/${endpoint}`, { params: { page } });
    return res.data;
  }
);

export const fetchMoviesGenre = createAsyncThunk(
  'movies/fetchMoviesGenre',
  async ({ name, page, sort }, { getState }) => {
    const { genres } = getState().config;
    const genreId = genres
      .filter((el) => el.name === name)
      .map((el) => el.id)
      .join('');
    const res = await tmdbAPI.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: sort,
      },
    });
    return res.data;
  }
);

export const fetchMoviesSearch = createAsyncThunk(
  'movies/fetchMoviesSearch',
  async ({ query, page }) => {
    const res = await tmdbAPI.get('/search/movie', {
      params: { query, page },
    });
    return res.data;
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    results: [],
    total_pages: 0,
    total_results: 0,
    page: 1,
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          fetchMoviesDiscover.pending,
          fetchMoviesGenre.pending,
          fetchMoviesSearch.pending
        ),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchMoviesDiscover.fulfilled,
          fetchMoviesGenre.fulfilled,
          fetchMoviesSearch.fulfilled
        ),
        (state, action) => {
          Object.assign(state, action.payload);
          state.loading = false;
        }
      );
  },
});

export default moviesSlice.reducer;
