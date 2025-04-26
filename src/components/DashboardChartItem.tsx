import { Card, CardBody, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import Link from 'next/link'
import { memo } from 'react'
import { Copy, Edit, Globe, Lock, MoreVertical, PieChart, Trash } from 'react-feather'

import { DashboardSettingItem } from '@/types/dashboard-settings'
import { EnumChartType } from '@/types/chart'

type Props = {
  data: DashboardSettingItem
  editable?: boolean
  onCopy?: () => void
  onDelete?: () => void
}

const DashboardChartItem: React.FC<Props> = ({ data, editable = false, onCopy, onDelete }) => {
  return (
    <Card key={data.id} shadow='sm'>
      <CardBody className='p-4'>
        <div className='w-full flex items-start gap-4'>
          <div>
            <PieChart className='w-12 h-12' />
          </div>
          <div className='w-full space-y-1'>
            <a
              target='_blank'
              rel='noopener noreferrer'
              className='w-fit block text-lg font-semibold underline hover:text-primary transition-all'
              href={`${window.location.origin}/dashboard/${data.id}`}
            >
              {data.dashboard_name}
            </a>
            <div className='flex flex-wrap items-center gap-4'>
              {data.dashboard_public ? (
                <Chip color='primary' className='pl-2' startContent={<Globe className='w-3 h-3' />}>
                  Public
                </Chip>
              ) : (
                <Chip color='danger' className='pl-2' startContent={<Lock className='w-3 h-3' />}>
                  Private
                </Chip>
              )}
              {data.dashboard_type === EnumChartType.CUSTOM ? (
                <Chip color='primary' className='pl-2' startContent={<Edit className='w-3 h-3' />}>
                  Custom
                </Chip>
              ) : (
                <Chip color='danger' className='pl-2' startContent={<Lock className='w-3 h-3' />}>
                  Basic
                </Chip>
              )}
              <div className='text-sm'>
                <b>Resolusi:</b> {data.dashboard_resolution}
              </div>
            </div>
            {data.plants ? (
              <div className='flex flex-wrap items-center gap-2 py-1'>
                <div className='text-sm font-medium'>Plants: </div>
                {data.plants.split(',').map((p) => (
                  <Chip key={p} color='warning' size='sm'>
                    {p}
                  </Chip>
                ))}
              </div>
            ) : null}
          </div>
          {(editable || typeof onCopy === 'function' || typeof onDelete === 'function') && (
            <div>
              <Dropdown>
                <DropdownTrigger>
                  <div title='Opsi' className='cursor-pointer'>
                    <MoreVertical className='w-6 h-6' />
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label='Static Actions'>
                  {typeof onCopy === 'function' ? (
                    <DropdownItem key='copy' startContent={<Copy className='w-4 h-4' />} onPress={onCopy}>
                      Salin URL
                    </DropdownItem>
                  ) : null}
                  {editable ? (
                    <DropdownItem
                      key='edit'
                      startContent={<Edit className='w-4 h-4' />}
                      as={Link}
                      href={`/settings/${data.id}/group-edit`}
                    >
                      Edit
                    </DropdownItem>
                  ) : null}
                  {data.dashboard_type === EnumChartType.CUSTOM && typeof onDelete === 'function' ? (
                    <DropdownItem
                      key='delete'
                      startContent={<Trash className='w-4 h-4' />}
                      className='text-danger'
                      color='danger'
                      onPress={() => {
                        const confirmation = window.confirm('Apakah anda yakin ingin menghapus data ini?')

                        if (confirmation) onDelete()
                      }}
                    >
                      Hapus
                    </DropdownItem>
                  ) : null}
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default memo(DashboardChartItem)
