import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },

    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = Boolean(action.payload)
      state.error = null
    },

    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },

    setError: (state, action) => {
      state.error = action.payload
    },

    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setUser,
  clearUser,
  setError,
  clearError,
} = authSlice.actions

export default authSlice.reducer