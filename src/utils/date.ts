export const fixIsoDate = (input: string) => {
  const parts = input.split('-')

  if (parts.length === 3) {
    const [year, month, day] = parts

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  throw new Error('Invalid date format')
}
