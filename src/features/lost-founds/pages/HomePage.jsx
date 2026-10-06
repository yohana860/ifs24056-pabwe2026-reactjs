import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  getLostFoundStatsDailyApi,
  getLostFoundStatsMonthlyApi,
  getLostFoundsApi,
} from '../api/lostFoundApi'
import AddModal from '../modals/AddModal'

import {
  setError,
  setLostFoundStats,
  setLostFounds,
} from '../states/lostFoundSlice'

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.auth.user)

  const {
    lostFounds,
    lostFoundStats,
    error,
  } = useSelector((state) => state.lostFounds)

  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [isLoadingReports, setIsLoadingReports] =
    useState(true)

  const [isLoadingStats, setIsLoadingStats] =
    useState(true)

  const [statsError, setStatsError] = useState(null)

  const loadLostFounds = useCallback(async () => {
    setIsLoadingReports(true)

    try {
      const response = await getLostFoundsApi()

      const data =
        response?.data?.lostFounds ||
        response?.data?.lost_founds ||
        response?.data ||
        response?.lostFounds ||
        response?.lost_founds ||
        []

      dispatch(
        setLostFounds(
          Array.isArray(data) ? data : [],
        ),
      )

      dispatch(setError(null))
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      setIsLoadingReports(false)
    }
  }, [dispatch])

  const loadStats = useCallback(async () => {
    setIsLoadingStats(true)
    setStatsError(null)

    try {
      const [
        dailyResponse,
        monthlyResponse,
      ] = await Promise.all([
        getLostFoundStatsDailyApi(),
        getLostFoundStatsMonthlyApi(),
      ])

      const daily =
        dailyResponse?.data || {}

      const monthly =
        monthlyResponse?.data || {}

      dispatch(
        setLostFoundStats({
          daily,
          monthly,
        }),
      )
    } catch (err) {
      setStatsError(err.message)
    } finally {
      setIsLoadingStats(false)
    }
  }, [dispatch])

  const loadDashboard = useCallback(async () => {
    await Promise.all([
      loadLostFounds(),
      loadStats(),
    ])
  }, [loadLostFounds, loadStats])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const totalReports = lostFounds.length

  const lostReports = lostFounds.filter(
    (item) => item.status === 'lost',
  ).length

  const foundReports = lostFounds.filter(
    (item) => item.status === 'found',
  ).length

  const completedReports = lostFounds.filter(
    (item) =>
      item.is_completed === 1 ||
      item.is_completed === true ||
      item.is_completed === '1',
  ).length

  const filteredLostFounds = useMemo(() => {
    return lostFounds.filter((item) => {
      const matchesStatus =
        statusFilter === 'all' ||
        item.status === statusFilter

      const title = String(
        item.title ?? '',
      ).toLowerCase()

      const description = String(
        item.description ?? '',
      ).toLowerCase()

      const keyword = searchQuery
        .trim()
        .toLowerCase()

      const matchesSearch =
        keyword === '' ||
        title.includes(keyword) ||
        description.includes(keyword)

      return matchesStatus && matchesSearch
    })
  }, [
    lostFounds,
    searchQuery,
    statusFilter,
  ])

  const dailyStats = lostFoundStats?.daily || {}
  const monthlyStats = lostFoundStats?.monthly || {}

  const getLastEntries = (data, total = 7) => {
    return Object.entries(data).slice(-total)
  }

  const dailyLostEntries = getLastEntries(
    dailyStats.stats_losts || {},
  )

  const dailyFoundEntries = getLastEntries(
    dailyStats.stats_founds || {},
  )

  const dailyCompletedLostEntries =
    getLastEntries(
      dailyStats.stats_losts_completed || {},
    )

  const dailyCompletedFoundEntries =
    getLastEntries(
      dailyStats.stats_founds_completed || {},
    )

  const monthlyLostEntries = getLastEntries(
    monthlyStats.stats_losts || {},
    6,
  )

  const monthlyFoundEntries = getLastEntries(
    monthlyStats.stats_founds || {},
    6,
  )

  const getEntryValue = (entry) => {
    return Number(entry?.[1] || 0)
  }

  const getMaxValue = (...entriesGroups) => {
    const values = entriesGroups
      .flat()
      .map((entry) => getEntryValue(entry))

    return Math.max(...values, 1)
  }

  const dailyMax = getMaxValue(
    dailyLostEntries,
    dailyFoundEntries,
  )

  const monthlyMax = getMaxValue(
    monthlyLostEntries,
    monthlyFoundEntries,
  )

  return (
    <div>
      {/* Header Dashboard */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Selamat Datang di Lost & Found
          </h1>

          <p className="mt-3 text-slate-600">
            {user?.name
              ? `Halo, ${user.name}!`
              : 'Anda berhasil masuk ke aplikasi.'}
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={
            isLoadingReports ||
            isLoadingStats
          }
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoadingReports ||
          isLoadingStats
            ? 'Memuat...'
            : 'Refresh Data'}
        </button>
      </div>

      {/* Statistik Ringkasan */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Total Laporan
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {isLoadingReports
              ? '...'
              : totalReports}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Semua laporan
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Barang Hilang
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {isLoadingReports
              ? '...'
              : lostReports}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Laporan kehilangan
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Barang Ditemukan
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {isLoadingReports
              ? '...'
              : foundReports}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Laporan penemuan
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Selesai
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {isLoadingReports
              ? '...'
              : completedReports}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Laporan terselesaikan
          </p>
        </div>
      </div>

      {/* Statistik Harian */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Statistik 7 Hari Terakhir
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Perbandingan laporan barang hilang dan ditemukan.
            </p>
          </div>

          {isLoadingStats && (
            <span className="text-xs font-medium text-slate-600">
              Memuat statistik...
            </span>
          )}
        </div>

        {statsError && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            Gagal mengambil statistik: {statsError}
          </div>
        )}

        {!isLoadingStats &&
          !statsError &&
          dailyLostEntries.length === 0 && (
            <p className="mt-6 text-sm text-slate-600">
              Data statistik harian belum tersedia.
            </p>
          )}

        {!isLoadingStats &&
          !statsError &&
          dailyLostEntries.length > 0 && (
            <div className="mt-6 space-y-5">
              {dailyLostEntries.map(
                ([date, lostValue], index) => {
                  const foundValue =
                    dailyFoundEntries[index]?.[1] || 0

                  const completedLostValue =
                    dailyCompletedLostEntries[index]?.[1] ||
                    0

                  const completedFoundValue =
                    dailyCompletedFoundEntries[index]?.[1] ||
                    0

                  const lostWidth =
                    (Number(lostValue) / dailyMax) *
                    100

                  const foundWidth =
                    (Number(foundValue) / dailyMax) *
                    100

                  return (
                    <div key={date}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">
                          {date}
                        </span>

                        <span className="text-xs text-slate-600">
                          Selesai:{' '}
                          {Number(
                            completedLostValue,
                          ) +
                            Number(
                              completedFoundValue,
                            )}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="w-16 text-xs font-medium text-red-600">
                            Hilang
                          </span>

                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-red-400 transition-all"
                              style={{
                                width: `${lostWidth}%`,
                              }}
                            />
                          </div>

                          <span className="w-8 text-right text-xs font-semibold text-slate-600">
                            {lostValue}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="w-16 text-xs font-medium text-emerald-600">
                            Ditemukan
                          </span>

                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-emerald-400 transition-all"
                              style={{
                                width: `${foundWidth}%`,
                              }}
                            />
                          </div>

                          <span className="w-8 text-right text-xs font-semibold text-slate-600">
                            {foundValue}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          )}
      </div>

      {/* Statistik Bulanan */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Statistik Bulanan
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Ringkasan laporan berdasarkan bulan.
          </p>
        </div>

        {isLoadingStats && (
          <p className="mt-6 text-sm text-slate-600">
            Memuat statistik bulanan...
          </p>
        )}

        {!isLoadingStats &&
          !statsError &&
          monthlyLostEntries.length === 0 && (
            <p className="mt-6 text-sm text-slate-600">
              Data statistik bulanan belum tersedia.
            </p>
          )}

        {!isLoadingStats &&
          !statsError &&
          monthlyLostEntries.length > 0 && (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-red-600">
                    Barang Hilang
                  </span>

                  <span className="text-xs text-slate-600">
                    6 bulan terakhir
                  </span>
                </div>

                <div className="space-y-3">
                  {monthlyLostEntries.map(
                    ([month, value]) => {
                      const width =
                        (Number(value) /
                          monthlyMax) *
                        100

                      return (
                        <div
                          key={`lost-${month}`}
                          className="flex items-center gap-3"
                        >
                          <span className="w-16 text-xs font-medium text-slate-600">
                            {month}
                          </span>

                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-red-400"
                              style={{
                                width: `${width}%`,
                              }}
                            />
                          </div>

                          <span className="w-8 text-right text-xs font-semibold text-slate-600">
                            {value}
                          </span>
                        </div>
                      )
                    },
                  )}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-600">
                    Barang Ditemukan
                  </span>

                  <span className="text-xs text-slate-600">
                    6 bulan terakhir
                  </span>
                </div>

                <div className="space-y-3">
                  {monthlyFoundEntries.map(
                    ([month, value]) => {
                      const width =
                        (Number(value) /
                          monthlyMax) *
                        100

                      return (
                        <div
                          key={`found-${month}`}
                          className="flex items-center gap-3"
                        >
                          <span className="w-16 text-xs font-medium text-slate-600">
                            {month}
                          </span>

                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-emerald-400"
                              style={{
                                width: `${width}%`,
                              }}
                            />
                          </div>

                          <span className="w-8 text-right text-xs font-semibold text-slate-600">
                            {value}
                          </span>
                        </div>
                      )
                    },
                  )}
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Laporan */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Laporan Lost & Found
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Kelola dan cari laporan barang hilang atau ditemukan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Tambah Laporan
          </button>
        </div>

        {/* Filter */}
        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Cari laporan..."
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            aria-label="Filter status laporan"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">
              Semua Status
            </option>

            <option value="lost">
              Hilang
            </option>

            <option value="found">
              Ditemukan
            </option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            Gagal mengambil data laporan: {error}
          </div>
        )}

        {/* Loading */}
        {isLoadingReports && (
          <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-600">
            Memuat laporan...
          </div>
        )}

        {/* Tidak ada data */}
        {!isLoadingReports &&
          lostFounds.length === 0 &&
          !error && (
            <p className="mt-6 text-sm text-slate-600">
              Belum ada laporan.
            </p>
          )}

        {/* Filter kosong */}
        {!isLoadingReports &&
          lostFounds.length > 0 &&
          filteredLostFounds.length === 0 && (
            <p className="mt-6 text-sm text-slate-600">
              Tidak ada laporan yang sesuai dengan filter.
            </p>
          )}

        {/* Tabel */}
        {!isLoadingReports &&
          filteredLostFounds.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                      #
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                      Judul
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                      Status
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                      Selesai
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLostFounds.map(
                    (item, index) => (
                      <tr
                        key={item.id ?? index}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 text-sm font-medium">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/lost-founds/${item.id}`,
                              )
                            }
                            className="text-left text-slate-900 transition hover:text-blue-600 hover:underline"
                          >
                            {item.title ?? '-'}
                          </button>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              item.status === 'lost'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {item.status === 'lost'
                              ? 'Hilang'
                              : 'Ditemukan'}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600">
                          {item.is_completed === 1 ||
                          item.is_completed === true ||
                          item.is_completed === '1'
                            ? 'Ya'
                            : 'Belum'}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Add Modal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadDashboard}
      />
    </div>
  )
}

export default HomePage