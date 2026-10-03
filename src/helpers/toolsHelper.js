import Swal from 'sweetalert2'

export const showSuccessDialog = (
  title = 'Berhasil',
  text = '',
) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK',
  })
}

export const showErrorDialog = (
  title = 'Terjadi Kesalahan',
  text = '',
) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
  })
}

export const showConfirmDialog = async ({
  title = 'Apakah Anda yakin?',
  text = '',
  confirmButtonText = 'Ya',
  cancelButtonText = 'Batal',
} = {}) => {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  })

  return result.isConfirmed
}

export const formatDate = (
  date,
  options = {},
) => {
  if (!date) {
    return '-'
  }

  const defaultOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      ...defaultOptions,
      ...options,
    },
  ).format(new Date(date))
}