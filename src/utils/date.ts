export const fixIsoDate = (input: string) => {
  const parts = input.split('-')

  if (parts.length === 3) {
    const [year, month, day] = parts

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  throw new Error('Invalid date format')
}

export const getMaxDateInMonth = (input: string) => {
  const [year, month] = input.split('-').map(Number)

  if (!year || !month) {
    throw new Error('Invalid date format')
  }

  return new Date(year, month, 0).getDate()
}
