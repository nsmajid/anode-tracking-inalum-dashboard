export enum EnumChartType {
  BASIC = 'basic',
  CUSTOM = 'custom'
}

export enum EnumChartCode {
  FISIK = 'fisik',
  KORELASI = 'korelasi',
  GRADE = 'grade',
  QC = 'qc',
  PNP = 'pnp'
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

export type ChartGradePart1Data = Omit<DefaultChartData, 'datasets'> & {
  datasets: Array<{
    label: string
    data: number[]
    custom_hover: boolean
    hover?: Array<Array<{ label: string; value: number }>>
  }>
  info: Array<{
    label: string
    min: number
    max: number
    average: number
  }>
}
export type ChartGradePart2or3Data = ChartGradePart1Data

export type ChartQCPart1Data = Array<
  DefaultChartData & {
    info: {
      min: number
      max: number
      average: number
    }
    line_min: number | null
    line_max: number | null
  }
>
export type ChartQCPart2Data = DefaultChartData & {
  info: {
    min: number
    max: number
    average: number
  }
}
export type ChartQCPart3Data = DefaultChartData & {
  info: {
    min: number
    max: number
    average: number
  }
}

export type ChartPnPPart1Data = Omit<DefaultChartData, 'datasets'> & {
  notes: (string | null)[]
  datasets: Array<{
    label: string
    data: number[]
  }>
}
