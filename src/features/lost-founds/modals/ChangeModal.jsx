import { useEffect, useState } from 'react'

import { updateLostFoundApi } from '../api/lostFoundApi'
import {
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper'

const ChangeModal = ({
  isOpen,
  onClose,
  lostFound,
  onSuccess,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('lost')
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && lostFound) {
      setTitle(lostFound.title || '')
      setDescription(lostFound.description || '')
      setStatus(lostFound.status || 'lost')

      setIsCompleted(
        lostFound.is_completed === 1 ||
          lostFound.is_completed === true ||
          lostFound.is_completed === '1',
      )
    }
  }, [isOpen, lostFound])

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim()) {
      await showErrorDialog(
        'Data Belum Lengkap',
        'Judul laporan wajib diisi.',
      )
      return
    }

    if (!description.trim()) {
      await showErrorDialog(
        'Data Belum Lengkap',
        'Deskripsi laporan wajib diisi.',
      )
      return
    }

    setIsLoading(true)

    try {
      await updateLostFoundApi(lostFound.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        is_completed: isCompleted ? 1 : 0,
      })

      await showSuccessDialog(
        'Berhasil',
        'Laporan berhasil diperbarui.',
      )

      onClose()

      if (onSuccess) {
        await onSuccess()
      }
    } catch (err) {
      await showErrorDialog(
        'Gagal Memperbarui Laporan',
        err.message,
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Edit Laporan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Ubah informasi laporan barang.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* Judul */}
          <div>
            <label
              htmlFor="change-title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Judul
            </label>

            <input
              id="change-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Contoh: Dompet hilang"
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label
              htmlFor="change-description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Deskripsi
            </label>

            <textarea
              id="change-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Jelaskan detail barang..."
              rows={5}
              disabled={isLoading}
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Jenis Laporan */}
          <div>
            <label
              htmlFor="change-status"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Jenis Laporan
            </label>

            <select
              id="change-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="lost">
                Barang Hilang
              </option>

              <option value="found">
                Barang Ditemukan
              </option>
            </select>
          </div>

          {/* Status Selesai */}
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Status Selesai
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Tandai laporan jika barang sudah selesai
                  ditangani.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isCompleted}
                onClick={() =>
                  setIsCompleted((current) => !current)
                }
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${
                  isCompleted
                    ? 'bg-blue-600'
                    : 'bg-slate-300'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition ${
                    isCompleted
                      ? 'translate-x-5'
                      : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <p className="mt-3 text-xs font-semibold">
              {isCompleted ? (
                <span className="text-blue-600">
                  Laporan sudah selesai
                </span>
              ) : (
                <span className="text-slate-500">
                  Laporan belum selesai
                </span>
              )}
            </p>
          </div>

          {/* Tombol */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? 'Menyimpan...'
                : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangeModal