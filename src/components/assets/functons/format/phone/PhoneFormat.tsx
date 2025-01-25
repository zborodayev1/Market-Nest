export const formatPhoneNumber = (phone: string): string | null => {
  const cleaned = phone.replace(/\D/g, '')

  const normalized = cleaned.length === 10 ? `7${cleaned}` : cleaned

  const match = normalized.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]} ${match[4]} ${match[5]}`
  }
  return null
}
