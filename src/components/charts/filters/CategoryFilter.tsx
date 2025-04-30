import { Button, NumberInput, Select, SelectItem } from '@heroui/react'
import { memo, useCallback, useMemo } from 'react'
import { X } from 'react-feather'
import clsx from 'clsx'

import { CategoryFilterInputType, NestedCategoryFilterStateProperties } from '@/types/chart'

type Props = {
  properties: NestedCategoryFilterStateProperties | null
  onChangeFilters: (values: Array<{ name: string; value: string | null }>) => void
}

type FilterItemProperty = NestedCategoryFilterStateProperties['options'][number] & {
  visible: boolean
  selected: boolean
  selected_name: string | null
  selected_value: string | null
}

const CategoryFilter: React.FC<Props> = ({ properties, onChangeFilters }) => {
  const filters = useMemo<FilterItemProperty[]>(() => {
    const options = properties?.options || []
    const values = properties?.values || []

    return options.map((r, i) => ({
      ...r,
      visible: i === 0 ? true : !!values?.[i - 1]?.value,
      selected: !!values?.[i],
      selected_name: values?.[i]?.name ?? null,
      selected_value: values?.[i]?.value ?? null
    }))
  }, [properties])

  const selectedNames = useMemo(() => {
    return properties?.values?.map((r) => r.name) || []
  }, [properties])

  const onChange = useCallback(
    (index: number, name: string, value: string | null) => {
      const values = properties?.values || []

      if (values?.[index]) {
        const newValues = [
          ...(properties?.values || []).slice(0, index),
          { name, value },
          ...(properties?.values || []).slice(index + 1)
        ]

        if (name && value && properties?.options?.[index + 1]) {
          const nextName = properties.options[index + 1].name
          const existingNameIndex = newValues.findIndex((r) => r.name === nextName)

          if (existingNameIndex === -1) {
            newValues.push({
              name: properties.options[index + 1].name,
              value: null
            })
          }
        }

        onChangeFilters(newValues)
      } else {
        onChangeFilters([...(properties?.values || []), { name, value }])
      }
    },
    [onChangeFilters, properties?.values, properties?.options]
  )

  const onRemove = useCallback(
    (index: number) => {
      const values = properties?.values || []

      if (values[index - 1]) {
        values[index - 1].value = null
      }
      values.splice(index, 1)
      onChangeFilters(values)
    },
    [onChangeFilters, properties?.values]
  )

  return (
    <div className='w-full space-y-2'>
      {filters.map((r, i) => {
        if (!r.visible) return null

        const item = r.selected_name ? filters.find((f) => f.name === r.selected_name) : undefined
        const visibleFiltersLength = filters.filter((r) => r.visible).length

        return (
          <FilterItem
            isCategoryDisabled={i < visibleFiltersLength - 1}
            isSelected={r.selected}
            label_name={properties?.label_name || ''}
            required={properties?.required || false}
            key={r.name}
            item={item}
            selectedNames={selectedNames}
            filters={filters}
            currentValue={properties?.values?.[i]}
            onChange={(name, value) => onChange(i, name, value)}
            onRemove={i > 0 && i === visibleFiltersLength - 1 ? () => onRemove(i) : undefined}
          />
        )
      })}
    </div>
  )
}

const FilterItem: React.FC<{
  isCategoryDisabled: boolean
  isSelected: boolean
  label_name: string
  required: boolean
  item?: FilterItemProperty
  selectedNames: string[]
  filters: FilterItemProperty[]
  currentValue?: {
    name: string
    value: string | null
  }
  onChange: (name: string, value: string | null) => void
  onRemove?: () => void
}> = ({
  isCategoryDisabled,
  isSelected,
  label_name,
  required,
  item,
  selectedNames,
  filters,
  currentValue,
  onChange,
  onRemove
}) => {
  const disabledKeys = useMemo(() => {
    return selectedNames.filter((r) => r !== currentValue?.name)
  }, [selectedNames, currentValue?.name])

  const _onRemove = () => {
    onRemove?.()
  }

  return (
    <div className='w-full flex items-center gap-2'>
      <Select
        className='max-w-[15rem]'
        label={label_name}
        placeholder={`Pilih ${label_name}`}
        isRequired={required}
        disabledKeys={disabledKeys}
        isDisabled={isCategoryDisabled}
        selectedKeys={currentValue?.name ? [currentValue.name] : []}
        onChange={(e) => {
          const { value } = e.target

          if (!value) return
          onChange(value, null)
        }}
      >
        {filters.map((option) => (
          <SelectItem key={option.name}>{option.label_name}</SelectItem>
        ))}
      </Select>
      <div className='w-full'>
        {item && isSelected && (
          <>
            {item.type === CategoryFilterInputType.OPTIONS && (
              <div className='w-full'>
                <Select
                  className='w-full'
                  label={item.label_name}
                  placeholder={`Pilih ${item.label_name}`}
                  isRequired={item.required}
                  selectedKeys={currentValue?.value ? [currentValue.value] : []}
                  onChange={(e) => {
                    const { value } = e.target

                    if (!value) return
                    onChange(currentValue?.name || '', value)
                  }}
                >
                  {(item.options as Array<{ id: string; name: string }>).map((option) => (
                    <SelectItem key={option.id}>{option.name}</SelectItem>
                  ))}
                </Select>
              </div>
            )}
            {item.type === CategoryFilterInputType.VALUE_OPTIONS && (
              <div className='w-full'>
                <Select
                  className='w-full'
                  label={item.label_name}
                  placeholder={`Pilih ${item.label_name}`}
                  isRequired={item.required}
                  selectedKeys={currentValue?.value ? [currentValue.value] : []}
                  onChange={(e) => {
                    const { value } = e.target

                    if (!value) return
                    onChange(currentValue?.name || '', value)
                  }}
                >
                  {(item.options as string[]).map((option) => (
                    <SelectItem key={option}>{option}</SelectItem>
                  ))}
                </Select>
              </div>
            )}
            {item.type === CategoryFilterInputType.NUMBER && (
              <div className='w-full'>
                <NumberInput
                  className='w-full'
                  label={`${item.label_name} (${item.min} - ${item.max})`}
                  placeholder={`Masukkan ${item.label_name}`}
                  isRequired={item.required}
                  // minValue={currentValue?.value && item.min ? parseInt(item.min) : undefined}
                  // maxValue={currentValue?.value && item.max ? parseInt(item.max) : undefined}
                  value={currentValue?.value ? parseInt(currentValue.value) : 0}
                  onValueChange={(value) => {
                    const min = item.min ? parseInt(item.min) : undefined
                    const max = item.max ? parseInt(item.max) : undefined

                    if (typeof min === 'number' && typeof max === 'number') {
                      if (value < min || value > max) return
                    }
                    onChange(currentValue?.name || '', value?.toString?.() || null)
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
      <Button
        variant='light'
        color='danger'
        size='sm'
        onPress={_onRemove}
        isIconOnly
        startContent={<X />}
        className={clsx(typeof onRemove !== 'function' && 'invisible')}
      />
    </div>
  )
}

export default memo(CategoryFilter)
