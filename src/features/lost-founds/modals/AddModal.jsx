import { useState } from 'react'

import { addLostFoundApi } from '../api/lostFoundApi'
import {
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper'

const AddModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('lost')
  const [isLoading, setIsLoading] = useState(false)

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
      await addLostFoundApi({
        title: title.trim(),
        description: description.trim(),
        status,
      })

      await showSuccessDialog(
        'Berhasil',
        'Laporan berhasil ditambahkan.',
      )

      setTitle('')
      setDescription('')
      setStatus('lost')

      onClose()

      if (onSuccess) {
        await onSuccess()
      }
    } catch (err) {
      await showErrorDialog(
        'Gagal Menambahkan Laporan',
        err.message,
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Tambah Laporan
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Buat laporan barang hilang atau ditemukan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg px-3 py-2 text-xl text-slate-600 hover:bg-slate-100 hover:text-slate-700"
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
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Judul
            </label>

            <input
              id="title"
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

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Deskripsi
            </label>

            <textarea
              id="description"
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

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Jenis Laporan
            </label>

            <select
              id="status"
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
                : 'Simpan Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddModal