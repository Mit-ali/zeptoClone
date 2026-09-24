
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/utility/api/call-api';
import { ENDPOINTS } from '@/utility/api/endpoints';

interface IUserState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  user: null | any;

}
const initialState: IUserState = {
  loading: "idle",
  error: null,
  user: null,

};


export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = ""
      return response;
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch notifications';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  },
);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    setUserData: (state, action: PayloadAction<null | any>) => {
      state.user = action.payload;
    },

  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(
        fetchUserDetails.fulfilled,
        (state, action: PayloadAction<null>) => {
          state.loading = 'succeeded';
          state.user = action.payload;
        },
      )
      .addCase(fetchUserDetails.rejected, (state) => {
        state.loading = 'failed';
        state.error = null;
      })

  },
});
export const {
  setUserData,

} = userSlice.actions;
export const selectUserState = (state: RootState) => state.user;
export default userSlice.reducer;
