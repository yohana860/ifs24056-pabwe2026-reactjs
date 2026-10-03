import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  deleteLostFoundApi,
  getLostFoundByIdApi,
} from '../api/lostFoundApi'
import ChangeModal from '../modals/ChangeModal'
import ChangeCoverModal from '../modals/ChangeCoverModal'

import {
  formatDate,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper'

const DetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lostFound, setLostFound] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const [isChangeModalOpen, setIsChangeModalOpen] =
    useState(false)

  const [isChangeCoverModalOpen, setIsChangeCoverModalOpen] =
    useState(false)

  const loadDetail = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await getLostFoundByIdApi(id)

      const data = response?.data?.lost_found

      if (!data) {
        throw new Error(
          'Data Lost & Found tidak tersedia',
        )
      }

      setLostFound(data)
    } catch (err) {
      await showErrorDialog(
        'Gagal Memuat Detail',
        err.message,
      )
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  const getStatusLabel = (status) => {
    if (status === 'found') {
      return 'Barang Ditemukan'
    }

    return 'Barang Hilang'
  }

  const getStatusClass = (status) => {
    if (status === 'found') {
      return 'bg-emerald-100 text-emerald-700'
    }

    return 'bg-red-100 text-red-700'
  }

  const handleDelete = async () => {
    if (!lostFound?.id) {
      await showErrorDialog(
        'Data Tidak Ditemukan',
        'Data laporan tidak tersedia.',
      )
      return
    }

    const isConfirmed = await showConfirmDialog({
      title: 'Hapus Laporan?',
      text: `Laporan "${lostFound.title}" akan dihapus secara permanen.`,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    })

    if (!isConfirmed) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteLostFoundApi(lostFound.id)

      await showSuccessDialog(
        'Berhasil',
        'Laporan berhasil dihapus.',
      )

      navigate('/', { replace: true })
    } catch (err) {
      await showErrorDialog(
        'Gagal Menghapus Laporan',
        err.message,
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm font-medium text-slate-500">
          Memuat detail laporan...
        </div>
      </div>
    )
  }

  if (!lostFound) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">
          Data Tidak Ditemukan
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Detail laporan Lost & Found tidak tersedia.
        </p>

        <button
          type="button"
          onClick={() => navigate('/home')}
          className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Kembali ke Beranda
        </button>
      </div>
    )
  }

  const authorName =
    lostFound.author?.name || 'Tidak diketahui'

  const authorPhoto =
    lostFound.author?.photo ||
    'https://open-api.delcom.org/default/img/user.png'

  const isCompleted =
    lostFound.is_completed === 1 ||
    lostFound.is_completed === true ||
    lostFound.is_completed === '1'

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Detail Laporan
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              {lostFound.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              ID Laporan: #{lostFound.id}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-fit rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Kembali
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative">
            {lostFound.cover ? (
              <img
                src={lostFound.cover}
                alt={`Cover ${lostFound.title}`}
                className="h-72 w-full object-cover sm:h-96"
              />
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-slate-100 text-sm text-slate-400 sm:h-96">
                Tidak ada cover
              </div>
            )}

            <div className="absolute right-4 top-4">
              <button
                type="button"
                onClick={() =>
                  setIsChangeCoverModalOpen(true)
                }
                className="rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-lg backdrop-blur transition hover:bg-white"
              >
                Ganti Cover
              </button>
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                  lostFound.status,
                )}`}
              >
                {getStatusLabel(lostFound.status)}
              </span>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {isCompleted
                  ? 'Laporan sudah selesai'
                  : 'Belum selesai'}
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Deskripsi
                </h2>

                <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                  {lostFound.description || '-'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Pelapor
                </h2>

                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={authorPhoto}
                    alt={authorName}
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {authorName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Pelapor laporan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Tanggal Dibuat
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDate(lostFound.created_at)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Terakhir Diperbarui
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDate(lostFound.updated_at)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  setIsChangeCoverModalOpen(true)
                }
                disabled={isDeleting}
                className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Edit Cover
              </button>

              <button
                type="button"
                onClick={() => setIsChangeModalOpen(true)}
                disabled={isDeleting}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Edit Data
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting
                  ? 'Menghapus...'
                  : 'Hapus Laporan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ChangeModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        lostFound={lostFound}
        onSuccess={loadDetail}
      />

      <ChangeCoverModal
        isOpen={isChangeCoverModalOpen}
        onClose={() =>
          setIsChangeCoverModalOpen(false)
        }
        lostFound={lostFound}
        onSuccess={loadDetail}
      />
    </div>
  )
}

export default DetailPage