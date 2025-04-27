export enum EnumChartType {
  BASIC = 'basic',
  CUSTOM = 'custom'
}

export enum EnumChartCode {
  FISIK = 'fisik',
  KORELASI = 'korelasi',
  GRADE = 'grade',
  QC = 'qc',
  PNP = 'pnp',
  RESUME = 'resume'
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

export type ChartResumePart1Data = Omit<DefaultChartData, 'datasets'> & {
  notes: (string | null)[]
  datasets: Array<{
    label: string
    data: number[]
    custom_hover: boolean
    hover?: Array<Array<{ jenis_anoda: string; berat: number; jumlah: number }>>
  }>
  info: Array<{
    label: string
    min: number
    max: number
    average: number
  }>
}

export type ChartKorelasiPart1Data = Omit<DefaultChartData, 'datasets'> & {
  annotation: string | null
  datasets: (number | null)[]
  info: {
    min: number | null
    max: number
    average: number
  }
}

export enum CategoryFilterInputType {
  NUMBER = 'number',
  OPTIONS = 'options',
  VALUE_OPTIONS = 'value_options'
}

export type CategoryFilterOptionProperties = {
  label_name: string
  name: string
  type: CategoryFilterInputType
  default: null | string
  required: boolean
  value?: Array<{ id: string; name: string }> | string[]
  max?: string
  min?: string
}

export enum PlantType {
  ANODE_ASSEMBLY = 'Anode Assembly',
  BAKING = 'Baking',
  GREEN = 'Green'
}

export type CategoryFilterProperties = {
  label_name: string
  name: string
  required: boolean
  default: Array<{
    name: string
    value: string | null
  }>
  options: Array<CategoryFilterOptionProperties>
}

export type NestedCategoryFilterStateProperties = {
  label_name: string
  name: string
  required: boolean
  options: Array<
    Omit<CategoryFilterOptionProperties, 'value'> & {
      options: CategoryFilterOptionProperties['value']
    }
  >
  values: Array<{
    name: string
    value: string | null
  }>
}

export type ParametersFilterStateProperties = {
  label_name: string
  name: string
  required: boolean
  options: string[]
  value: string | null
}

export type QCParametersFilterStateProperties = {
  label_name: string
  name: string
  required: boolean
  options: Array<{
    option_name: string
    option_value: string
  }>
  value: string[]
}

export type KorelasiParametersFilterStateProperties = {
  label_name: string
  name: string
  required: boolean
  options: Array<{
    option_name: string
    option_value: string
  }>
  value: string | null
}

export type KorelasiParametersMinMaxFilterStateProperties = {
  label_name: string
  name: string
  required: boolean
  value: number | null
}

export type ClassFilterStateProperties = {
  label_name: string
  name: string
  required: boolean
  value: number | null
}

export type LotFilterStateProperties = {
  label_name: string
  name: string
  required: boolean
  value: string | null
  options: Array<{
    lot: string
    start_cycle: string
    end_cycle: string
  }>
}

export type CycleFilterStateProperties = {
  label_name: string
  start: {
    label_name: string
    name: string
    required: boolean
    value: string | null
  }
  end: {
    label_name: string
    name: string
    required: boolean
    value: string | null
  }
}

export type DateRangeFilterStateProperties = {
  label_name: string
  required: boolean
  range_max?: number
  start: {
    label_name: string
    name: string
    required: boolean
    value: string | null
  }
  end: {
    label_name: string
    name: string
    required: boolean
    value: string | null
  }
}

export type LabelViewFilterStateProperties = {
  label_name: string
  name: string
  required: boolean
  options: string[]
  value: string | null
}

export type NumericFilterStateProperties = {
  label_name: string
  name: string
  required: boolean
  options: string[]
  value: string | null
}

export type CategoryFilterStateProperties = {
  label_name: string
  name: string
  required: boolean
  options: string[]
  value: string | null
}

export type PlantFilterStateProperties = {
  label_name: string
  name: string
  required: boolean
  options: Record<PlantType, Array<{ option_name: string; option_value: string }>>
}
