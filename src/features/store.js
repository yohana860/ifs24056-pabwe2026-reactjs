import { configureStore } from '@reduxjs/toolkit'

import authReducer from './auth/states/authSlice'
import usersReducer from './users/states/usersSlice'
import lostFoundReducer from './lost-founds/states/lostFoundSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    lostFounds: lostFoundReducer,
  },
})

export default store