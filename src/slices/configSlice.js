import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const bootstrap = createAsyncThunk(
  'config/bootstrap',
  async () => {
    const [configRes, genresRes] = await Promise.all([
      tmdbAPI.get('/configuration'),
      tmdbAPI.get('/genre/movie/list'),
    ]);
    return {
      base: configRes.data,
      genres: genresRes.data.genres,
    };
  }
);

const configSlice = createSlice({
  name: 'config',
  initialState: {
    base: null,
    genres: [],
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bootstrap.pending, (state) => {
        state.loading = true;
      })
      .addCase(bootstrap.fulfilled, (state, action) => {
        state.base = action.payload.base;
        state.genres = action.payload.genres;
        state.loading = false;
      })
      .addCase(bootstrap.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default configSlice.reducer;

// Selector: is `name` a valid menu name (either a static category or a genre)?
export const selectIsValidMenuName = (name) => (state) => {
  if (!name) return false;
  const { genres } = state.config;
  const STATIC_CATEGORIES = ['Popular', 'Top Rated', 'Upcoming'];
  return (
    STATIC_CATEGORIES.includes(name) ||
    genres.some((g) => g.name === name)
  );
};
