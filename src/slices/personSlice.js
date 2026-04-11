import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const fetchPerson = createAsyncThunk(
  'person/fetchPerson',
  async (id) => {
    const res = await tmdbAPI.get(`/person/${id}`);
    return res.data;
  }
);

const personSlice = createSlice({
  name: 'person',
  initialState: {
    data: null,
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerson.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPerson.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      });
  },
});

export default personSlice.reducer;
