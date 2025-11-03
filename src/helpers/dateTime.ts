export const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})
}

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}ч ${mins}м`
}

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

