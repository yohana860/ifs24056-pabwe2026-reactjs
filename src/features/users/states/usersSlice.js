import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
      state.error = null
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
      state.error = null
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload
    },

    setError: (state, action) => {
      state.error = action.payload
    },

    clearError: (state) => {
      state.error = null
    },

    clearSelectedUser: (state) => {
      state.selectedUser = null
    },
  },
})

export const {
  setUsers,
  setSelectedUser,
  setLoading,
  setError,
  clearError,
  clearSelectedUser,
} = usersSlice.actions

export default usersSlice.reducer