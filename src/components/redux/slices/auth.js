import axios from "../../axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fethRegister = createAsyncThunk(
    "auth/fethRegister",
    async (params) => {
        const { data } = await axios.post("/auth/register", params);
        return data;
    }
);

const initialState = {
     user: null,
    status: "loading",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fethRegister.pending, (state) => {
                state.status = "loading";
                state.data = null;
            })
            .addCase(fethRegister.fulfilled, (state, action) => {
                state.status = "loaded";
                state.data = action.payload;
            })
            .addCase(fethRegister.rejected, (state) => {
                state.status = "error";
                state.data = null;
            });
    },
});

export const authReducer = authSlice.reducer;

export const selectIsAuth = (state) => Boolean(state.auth.user);