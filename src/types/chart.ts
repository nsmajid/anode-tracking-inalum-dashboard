export enum EnumChartType {
  BASIC = 'basic',
  CUSTOM = 'custom'
}

export enum EnumChartCode {
  FISIK = 'fisik',
  KORELASI = 'korelasi',
  GRADE = 'grade'
}

export type DefaultChartData = {
  'x-label': string | null
  'y-label': string | null
  labels: string[]
  datasets: number[]
}

export type ChartFisikPart1Data = DefaultChartData & {
  info: {
    min: number
    max: number
    average: number
  }
}

export type ChartFisikPart2Data = DefaultChartData

export type ChartFisikPart3Data = DefaultChartData
