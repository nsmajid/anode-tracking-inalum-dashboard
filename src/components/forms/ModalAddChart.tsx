import { ChartItem } from '@/types/dashboard-settings'
import { Button, Checkbox, CheckboxGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { memo, useCallback, useEffect, useState } from 'react'

type Props = {
  isOpen: boolean
  onOpenChange: () => void
  onAddCallback: (options: ChartItem[]) => void
  options: ChartItem[]
}

const ModalAddChart: React.FC<Props> = ({ isOpen, onOpenChange, options, onAddCallback }) => {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    setSelected([])
  }, [isOpen])

  const onAdd = useCallback(() => {
    const selectedRecords = options.filter((option) => selected.includes(option.id))

    onAddCallback(selectedRecords)
  }, [selected, options, onAddCallback])

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Pilih Chart</ModalHeader>
              <ModalBody>
                {options.length > 0 ? (
                  <CheckboxGroup size='lg' value={selected} onValueChange={setSelected}>
                    {options.map((option) => (
                      <Checkbox key={option.id} value={option.id}>
                        {option.chart_name}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                ) : (
                  <div className='w-full flex min-h-32 border-2 border-dashed border-primary-100 rounded-xl'>
                    <div className='m-auto text-sm text-primary-300'>Tidak ada chart lagi yang tersedia</div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className='flex justify-between gap-2'>
                <Button color='default' onPress={onClose}>
                  Batal
                </Button>
                <Button color='primary' onPress={onAdd} isDisabled={selected.length < 1}>
                  Tambahkan Chart
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default memo(ModalAddChart)
