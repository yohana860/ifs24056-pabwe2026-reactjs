import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  lostFounds: [],
  lostFound: null,
  isLostFound: false,

  isLostFoundAdd: false,
  isLostFoundAdded: false,

  isLostFoundChange: false,
  isLostFoundChanged: false,

  isLostFoundChangeCover: false,
  isLostFoundChangedCover: false,

  isLostFoundDelete: false,
  isLostFoundDeleted: false,

  lostFoundStats: {
    daily: null,
    monthly: null,
  },

  error: null,
}

const lostFoundSlice = createSlice({
  name: 'lostFounds',
  initialState,

  reducers: {
    setLostFounds: (state, action) => {
      state.lostFounds = action.payload
      state.error = null
    },

    setLostFound: (state, action) => {
      state.lostFound = action.payload
      state.isLostFound = Boolean(action.payload)
      state.error = null
    },

    clearLostFound: (state) => {
      state.lostFound = null
      state.isLostFound = false
    },

    setLostFoundAdd: (state, action) => {
      state.isLostFoundAdd = action.payload
    },

    setLostFoundAdded: (state, action) => {
      state.isLostFoundAdded = action.payload
    },

    setLostFoundChange: (state, action) => {
      state.isLostFoundChange = action.payload
    },

    setLostFoundChanged: (state, action) => {
      state.isLostFoundChanged = action.payload
    },

    setLostFoundChangeCover: (state, action) => {
      state.isLostFoundChangeCover = action.payload
    },

    setLostFoundChangedCover: (state, action) => {
      state.isLostFoundChangedCover = action.payload
    },

    setLostFoundDelete: (state, action) => {
      state.isLostFoundDelete = action.payload
    },

    setLostFoundDeleted: (state, action) => {
      state.isLostFoundDeleted = action.payload
    },

    setLostFoundStats: (state, action) => {
      state.lostFoundStats = {
        daily: action.payload?.daily || null,
        monthly: action.payload?.monthly || null,
      }
    },

    clearLostFoundStats: (state) => {
      state.lostFoundStats = {
        daily: null,
        monthly: null,
      }
    },

    setError: (state, action) => {
      state.error = action.payload
    },

    clearError: (state) => {
      state.error = null
    },

    resetLostFoundActionStates: (state) => {
      state.isLostFoundAdd = false
      state.isLostFoundAdded = false
      state.isLostFoundChange = false
      state.isLostFoundChanged = false
      state.isLostFoundChangeCover = false
      state.isLostFoundChangedCover = false
      state.isLostFoundDelete = false
      state.isLostFoundDeleted = false
    },
  },
})

export const {
  setLostFounds,
  setLostFound,
  clearLostFound,
  setLostFoundAdd,
  setLostFoundAdded,
  setLostFoundChange,
  setLostFoundChanged,
  setLostFoundChangeCover,
  setLostFoundChangedCover,
  setLostFoundDelete,
  setLostFoundDeleted,
  setLostFoundStats,
  clearLostFoundStats,
  setError,
  clearError,
  resetLostFoundActionStates,
} = lostFoundSlice.actions

export default lostFoundSlice.reducer