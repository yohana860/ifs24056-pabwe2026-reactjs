import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'

import NavbarComponent from '../components/NavbarComponent'
import SidebarComponent from '../components/SidebarComponent'

import { getMeApi } from '../../auth/api/authApi'
import {
  setLoading,
  setUser,
  setError,
} from '../../auth/states/authSlice'

const LostFoundLayout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        dispatch(setLoading(true))

        const response = await getMeApi()

        const user =
          response?.data?.user ||
          response?.data ||
          response?.user ||
          null

        dispatch(setUser(user))
      } catch (error) {
        dispatch(setError(error.message))
      } finally {
        dispatch(setLoading(false))
      }
    }

    loadCurrentUser()
  }, [dispatch])

  return (
    <div className="min-h-screen bg-slate-100">
      <NavbarComponent />

      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <SidebarComponent />

        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default LostFoundLayout