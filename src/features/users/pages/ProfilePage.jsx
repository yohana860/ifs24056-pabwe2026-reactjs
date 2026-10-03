import { useEffect, useState } from 'react'

import {
  getUserProfileApi,
  updateUserProfileApi,
  uploadUserPhotoApi,
  updateUserPasswordApi,
} from '../api/userApi'

import {
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper'

const ProfilePage = () => {
  const [profile, setProfile] = useState(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [photo, setPhoto] = useState(null)

  const [currentPassword, setCurrentPassword] =
    useState('')
  const [newPassword, setNewPassword] =
    useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSavingProfile, setIsSavingProfile] =
    useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] =
    useState(false)
  const [isChangingPassword, setIsChangingPassword] =
    useState(false)

  const loadProfile = async () => {
    setIsLoading(true)

    try {
      const response = await getUserProfileApi()

      const data =
        response?.data?.user ||
        response?.data?.profile ||
        response?.data

      if (!data) {
        throw new Error(
          'Data profil tidak tersedia.',
        )
      }

      setProfile(data)
      setName(data.name ?? '')
      setEmail(data.email ?? '')
    } catch (err) {
      await showErrorDialog(
        'Gagal Memuat Profil',
        err.message,
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleUpdateProfile = async (event) => {
    event.preventDefault()

    if (!name.trim()) {
      await showErrorDialog(
        'Nama Belum Diisi',
        'Nama pengguna wajib diisi.',
      )
      return
    }

    setIsSavingProfile(true)

    try {
      await updateUserProfileApi({
        name: name.trim(),
        email: email.trim(),
      })

      await showSuccessDialog(
        'Berhasil',
        'Profil berhasil diperbarui.',
      )

      await loadProfile()
    } catch (err) {
      await showErrorDialog(
        'Gagal Memperbarui Profil',
        err.message,
      )
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      setPhoto(null)
      return
    }

    if (!selectedFile.type.startsWith('image/')) {
      showErrorDialog(
        'File Tidak Valid',
        'Foto profil harus berupa gambar.',
      )

      event.target.value = ''
      setPhoto(null)
      return
    }

    setPhoto(selectedFile)
  }

  const handleUploadPhoto = async (event) => {
    event.preventDefault()

    if (!photo) {
      await showErrorDialog(
        'Foto Belum Dipilih',
        'Silakan pilih foto profil terlebih dahulu.',
      )
      return
    }

    setIsUploadingPhoto(true)

    try {
      const formData = new FormData()
      formData.append('photo', photo)

      await uploadUserPhotoApi(formData)

      await showSuccessDialog(
        'Berhasil',
        'Foto profil berhasil diperbarui.',
      )

      setPhoto(null)
      event.target.reset()

      await loadProfile()
    } catch (err) {
      await showErrorDialog(
        'Gagal Mengubah Foto',
        err.message,
      )
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleChangePassword = async (event) => {
    event.preventDefault()

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      await showErrorDialog(
        'Data Belum Lengkap',
        'Semua kolom password wajib diisi.',
      )
      return
    }

    if (newPassword !== confirmPassword) {
      await showErrorDialog(
        'Konfirmasi Password Salah',
        'Password baru dan konfirmasi password harus sama.',
      )
      return
    }

    setIsChangingPassword(true)

    try {
      await updateUserPasswordApi({
        current_password: currentPassword,
        password: newPassword,
      })

      await showSuccessDialog(
        'Berhasil',
        'Password berhasil diperbarui.',
      )

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      await showErrorDialog(
        'Gagal Mengubah Password',
        err.message,
      )
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Memuat profil...
        </p>
      </div>
    )
  }

  const profilePhoto =
    profile?.photo ||
    'https://open-api.delcom.org/default/img/user.png'

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-indigo-600">
          Profil Saya
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Pengaturan Akun
        </h1>

        <p className="mt-2 text-slate-500">
          Kelola informasi profil, foto, dan password akun
          Anda.
        </p>
      </div>

      {/* Profil */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <img
            src={profilePhoto}
            alt={profile?.name || 'Foto profil'}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-slate-100"
          />

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {profile?.name || '-'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {profile?.email || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Informasi Profil */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Informasi Profil
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Perbarui nama dan email akun Anda.
        </p>

        <form
          onSubmit={handleUpdateProfile}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="profile-name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nama
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              disabled={isSavingProfile}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>

            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={isSavingProfile}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingProfile}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingProfile
              ? 'Menyimpan...'
              : 'Simpan Profil'}
          </button>
        </form>
      </div>

      {/* Foto Profil */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Foto Profil
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Pilih gambar untuk mengganti foto profil.
        </p>

        <form
          onSubmit={handleUploadPhoto}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="profile-photo"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Pilih Foto
            </label>

            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={isUploadingPhoto}
              className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white text-sm text-slate-700 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-slate-700"
            />
          </div>

          <button
            type="submit"
            disabled={isUploadingPhoto}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploadingPhoto
              ? 'Mengunggah...'
              : 'Simpan Foto'}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Ganti Password
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Gunakan password baru untuk akun Anda.
        </p>

        <form
          onSubmit={handleChangePassword}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="current-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password Saat Ini
            </label>

            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(event.target.value)
              }
              disabled={isChangingPassword}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password Baru
            </label>

            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              disabled={isChangingPassword}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Konfirmasi Password Baru
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              disabled={isChangingPassword}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChangingPassword
              ? 'Mengubah Password...'
              : 'Ubah Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage