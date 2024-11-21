import { createSlice } from '@reduxjs/toolkit';

const alertSlice = createSlice({
    name: 'alert',
    initialState: {
        show: false,
        message: ''
    },
    reducers: {
        setAlert: (state, action) => {
            state.show = true;
            state.message = action.payload.message;
        },
        clearAlert: (state) => {
            state.show = false;
            state.message = '';
        },
    },
});

export const { setAlert, clearAlert } = alertSlice.actions;

export default alertSlice.reducer;