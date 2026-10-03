import { useEffect, useState } from 'react'

import { uploadLostFoundCoverApi } from '../api/lostFoundApi'
import {
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper'

const ChangeCoverModal = ({
  isOpen,
  onClose,
  lostFound,
  onSuccess,
}) => {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setFile(null)
      setPreviewUrl('')
    }
  }, [isOpen])

  useEffect(() => {
    if (!file) {
      return undefined
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  if (!isOpen) {
    return null
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      setFile(null)
      return
    }

    if (!selectedFile.type.startsWith('image/')) {
      showErrorDialog(
        'File Tidak Valid',
        'File cover harus berupa gambar.',
      )

      event.target.value = ''
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!file) {
      await showErrorDialog(
        'Cover Belum Dipilih',
        'Silakan pilih gambar cover terlebih dahulu.',
      )
      return
    }

    if (!lostFound?.id) {
      await showErrorDialog(
        'Data Tidak Ditemukan',
        'Data laporan tidak tersedia.',
      )
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('cover', file)

      await uploadLostFoundCoverApi(
        lostFound.id,
        formData,
      )

      await showSuccessDialog(
        'Berhasil',
        'Cover laporan berhasil diperbarui.',
      )

      if (onSuccess) {
        await onSuccess()
      }

      onClose()
    } catch (err) {
      await showErrorDialog(
        'Gagal Mengubah Cover',
        err.message,
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Ganti Cover
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Pilih gambar baru untuk cover laporan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div>
            <label
              htmlFor="change-cover"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Pilih Gambar
            </label>

            <input
              id="change-cover"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
              className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white text-sm text-slate-700 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />

            <p className="mt-2 text-xs text-slate-500">
              Pilih file gambar untuk dijadikan cover laporan.
            </p>
          </div>

          {(previewUrl || lostFound?.cover) && (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Pratinjau
              </p>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <img
                  src={previewUrl || lostFound.cover}
                  alt="Preview cover"
                  className="h-64 w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? 'Mengunggah...'
                : 'Simpan Cover'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangeCoverModal