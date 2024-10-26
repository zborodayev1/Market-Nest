import axios from '../../../axios'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetсhRegister = createAsyncThunk(
    "auth/fetсhRegister",
    async (params) => {
        const { data } = await axios.post("/auth/register", params);
        return data;
    }
);

const initialState = {
    data: null,
    status: "loading",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
          state.data = null;
        },
      },
    extraReducers: (builder) => {
        builder
            .addCase(fetсhRegister.pending, (state) => {
                state.status = "loading";
                state.data = null;
            })
            .addCase(fetсhRegister.fulfilled, (state, action) => {
                state.status = "loaded";
                state.data = action.payload;
            })
            .addCase(fetсhRegister.rejected, (state) => {
                state.status = "error";
                state.data = null;
            });
    },
});

export const authReducer = authSlice.reducer;

export const selectIsAuth = (state:any) => Boolean(state.auth.data);

export const { logout } = authSlice.actions;