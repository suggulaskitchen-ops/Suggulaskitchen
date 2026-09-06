function StatusBanner({ status }) {
  if (!status) {
    return null
  }

  const isSuccess = status.type === 'success'

  return (
    <div className={`rounded-3xl p-4 ${isSuccess ? 'bg-emerald-600/15 text-emerald-200' : 'bg-rose-600/15 text-rose-200'}`}>
      {status.message}
    </div>
  )
}

export default StatusBanner
