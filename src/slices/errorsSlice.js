import { createSlice, isRejected } from '@reduxjs/toolkit';

const errorsSlice = createSlice({
  name: 'errors',
  initialState: null,
  reducers: {
    clearError: () => null,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isRejected,
      (_state, action) => action.error ?? { message: 'Unknown error' }
    );
  },
});

export const { clearError } = errorsSlice.actions;
export default errorsSlice.reducer;
