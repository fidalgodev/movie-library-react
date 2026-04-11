import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const fetchMoviesForPerson = createAsyncThunk(
  'moviesForPerson/fetchMoviesForPerson',
  async ({ id, page, sort }) => {
    const res = await tmdbAPI.get('/discover/movie', {
      params: {
        with_cast: id,
        page,
        sort_by: sort,
      },
    });
    return res.data;
  }
);

const moviesForPersonSlice = createSlice({
  name: 'moviesForPerson',
  initialState: {
    results: [],
    total_pages: 0,
    page: 1,
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesForPerson.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoviesForPerson.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.loading = false;
      });
  },
});

export default moviesForPersonSlice.reducer;
