import {
  CategoryFilterStateProperties,
  ClassFilterStateProperties,
  CycleFilterStateProperties,
  DateRangeFilterStateProperties,
  KorelasiParametersFilterStateProperties,
  KorelasiParametersMinMaxFilterStateProperties,
  LabelViewFilterStateProperties,
  LotFilterStateProperties,
  NestedCategoryFilterStateProperties,
  NumericFilterStateProperties,
  ParametersFilterStateProperties,
  PlantFilterStateProperties,
  QCParametersFilterStateProperties
} from '@/types/chart'

type BuildChartFiltersProperties = {
  nested_category?: NestedCategoryFilterStateProperties | null
  parameters?: ParametersFilterStateProperties | null
  qc_parameters?: QCParametersFilterStateProperties | null
  korelasi_parameters_1?: KorelasiParametersFilterStateProperties | null
  korelasi_parameters_1_min?: KorelasiParametersMinMaxFilterStateProperties | null
  korelasi_parameters_1_max?: KorelasiParametersMinMaxFilterStateProperties | null
  korelasi_parameters_2?: KorelasiParametersFilterStateProperties | null
  korelasi_parameters_2_min?: KorelasiParametersMinMaxFilterStateProperties | null
  korelasi_parameters_2_max?: KorelasiParametersMinMaxFilterStateProperties | null
  class?: ClassFilterStateProperties | null
  lot?: LotFilterStateProperties | null
  cycle?: CycleFilterStateProperties | null
  date_range?: DateRangeFilterStateProperties | null
  label_view?: LabelViewFilterStateProperties | null
  numeric?: NumericFilterStateProperties | null
  category?: CategoryFilterStateProperties | null
  plant?: PlantFilterStateProperties | null
  selected_sub_plants?: string[]
}

export const buildChartFilters = (properties: BuildChartFiltersProperties) => {
  const {
    nested_category,
    parameters,
    qc_parameters,
    korelasi_parameters_1,
    korelasi_parameters_1_min,
    korelasi_parameters_1_max,
    korelasi_parameters_2,
    korelasi_parameters_2_min,
    korelasi_parameters_2_max,
    class: class_filter,
    lot,
    cycle,
    date_range,
    label_view,
    numeric,
    category,
    plant,
    selected_sub_plants
  } = properties

  let params: Record<string, string | number | Array<{ name: string; value: string }>> = {}

  if (parameters?.value) {
    params = {
      ...params,
      [parameters.name]: parameters.value
    }
  }

  if (qc_parameters?.value) {
    params = {
      ...params,
      [qc_parameters.name]: qc_parameters.value.join(',')
    }
  }

  if (korelasi_parameters_1?.value) {
    params = {
      ...params,
      [korelasi_parameters_1.name]: korelasi_parameters_1.value
    }
  }

  if (korelasi_parameters_2?.value) {
    params = {
      ...params,
      [korelasi_parameters_2.name]: korelasi_parameters_2.value
    }
  }

  if (lot?.value) {
    params = {
      ...params,
      [lot.name]: lot.value
    }
  }

  if (cycle?.start.value) {
    params = {
      ...params,
      [cycle.start.name]: cycle.start.value
    }
  }

  if (cycle?.end.value) {
    params = {
      ...params,
      [cycle.end.name]: cycle.end.value
    }
  }

  if (date_range?.start.value) {
    params = {
      ...params,
      [date_range.start.name]: date_range.start.value
    }
  }

  if (date_range?.end.value) {
    params = {
      ...params,
      [date_range.end.name]: date_range.end.value
    }
  }

  if (numeric?.value) {
    params = {
      ...params,
      [numeric.name]: numeric.value
    }
  }

  if (label_view?.value) {
    params = {
      ...params,
      [label_view.name]: label_view.value
    }
  }

  if (nested_category && nested_category?.values?.some((r) => !!r.value)) {
    params = {
      ...params,
      [nested_category.name]: nested_category.values
        .filter((r) => !!r.value)
        .map((r) => ({
          name: r.name,
          value: r.value as string
        }))
    }
  }

  if (korelasi_parameters_1_min?.value) {
    params = {
      ...params,
      [korelasi_parameters_1_min.name]: korelasi_parameters_1_min.value
    }
  }

  if (korelasi_parameters_1_max?.value) {
    params = {
      ...params,
      [korelasi_parameters_1_max.name]: korelasi_parameters_1_max.value
    }
  }

  if (korelasi_parameters_2_min?.value) {
    params = {
      ...params,
      [korelasi_parameters_2_min.name]: korelasi_parameters_2_min.value
    }
  }

  if (korelasi_parameters_2_max?.value) {
    params = {
      ...params,
      [korelasi_parameters_2_max.name]: korelasi_parameters_2_max.value
    }
  }

  if (class_filter?.value) {
    params = {
      ...params,
      [class_filter.name]: class_filter.value
    }
  }

  if (category?.value) {
    params = {
      ...params,
      [category.name]: category.value
    }
  }

  if (plant?.name && selected_sub_plants && selected_sub_plants?.length > 0) {
    params = {
      ...params,
      [plant.name]: selected_sub_plants.join(',')
    }
  }

  return params
}
