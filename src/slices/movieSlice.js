import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const fetchMovie = createAsyncThunk(
  'movie/fetchMovie',
  async (id) => {
    const res = await tmdbAPI.get(`/movie/${id}`, {
      params: { append_to_response: 'videos' },
    });
    return res.data;
  }
);

export const fetchCredits = createAsyncThunk(
  'movie/fetchCredits',
  async (id) => {
    const res = await tmdbAPI.get(`/movie/${id}/credits`);
    return res.data.cast;
  }
);

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    data: null,
    cast: [],
    loading: true,
  },
  reducers: {
    clearMovie: () => ({ data: null, cast: [], loading: true }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovie.pending, (state) => {
        state.loading = true;
        state.cast = [];
      })
      .addCase(fetchMovie.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchMovie.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.cast = action.payload;
      });
  },
});

export const { clearMovie } = movieSlice.actions;

export default movieSlice.reducer;
