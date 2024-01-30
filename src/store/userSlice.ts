import { createSlice } from "@reduxjs/toolkit";

interface userState {
    login: string | null
    role: number
}

const initialState: userState = {
    login: null,
    role: 0,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLogin: (state, { payload }) => {
            state.login = payload
        },
        setRole: (state, { payload }) => {
            state.role = payload
        },
        reset: (state) => {
            state.login = initialState.login;
            state.role = initialState.role;
        },
    },
});

export default userSlice.reducer;

export const { setLogin, setRole, reset } = userSlice.actions;