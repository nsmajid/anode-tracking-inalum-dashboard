import { memo } from 'react'
import { Select, SelectItem } from '@heroui/react'

import { ChartTypeData, ChartTypeDisplay } from '@/types/chart'

type Props = {
  state: ChartTypeData | null
  value: ChartTypeDisplay
  onChange: (value: ChartTypeDisplay) => void
}

const ChartTypeFilter: React.FC<Props> = ({ state, value, onChange }) => {
  if (!state) return null

  return (
    <div className='w-full'>
      <Select
        className='max-w-[10rem]'
        label={state.label_name}
        placeholder={`Pilih ${state.label_name}`}
        isRequired={state.required}
        selectedKeys={value ? [value] : []}
        onChange={(e) => {
          if (!e.target.value) return
          onChange(e.target.value as ChartTypeDisplay)
        }}
      >
        {(state.value || []).map((option) => (
          <SelectItem key={option.option_value}>{option.option_name}</SelectItem>
        ))}
      </Select>
    </div>
  )
}

export default memo(ChartTypeFilter)
