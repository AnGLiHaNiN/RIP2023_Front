import { createSlice } from "@reduxjs/toolkit";

interface searchState {
    name: string

    user: string
    status: string
    formationDateStart: string | null
    formationDateEnd: string | null
}

const initialState: searchState = {
    name: '',

    user: '',
    status: '',
    formationDateStart: null,
    formationDateEnd: null,
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setName: (state, { payload }) => {
            state.name = payload
        },
        setUser: (state, { payload }) => {
            state.user = payload
        },
        setStatus: (state, { payload }) => {
            state.status = payload
        },
        setDateStart: (state, { payload }) => {
            state.formationDateStart = payload
        },
        setDateEnd: (state, { payload }) => {
            state.formationDateEnd = payload
        },
        reset: (state) => {
            state.user = initialState.user
            state.status = initialState.status
            state.formationDateStart = initialState.formationDateStart
            state.formationDateEnd = initialState.formationDateEnd
        }
    },
});

export default searchSlice.reducer;

export const { reset, setName, setUser, setStatus, setDateStart, setDateEnd } = searchSlice.actions;