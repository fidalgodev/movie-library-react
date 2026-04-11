import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetchRecommendations',
  async ({ id, page }) => {
    const res = await tmdbAPI.get(`/movie/${id}/recommendations`, {
      params: { page },
    });
    return res.data;
  }
);

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState: {
    results: [],
    total_pages: 0,
    page: 1,
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.loading = false;
      });
  },
});

export default recommendationsSlice.reducer;
