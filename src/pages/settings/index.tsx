import { Button } from '@heroui/button'
import { Card, CardBody, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from '@heroui/react'
import Link from 'next/link'
import { useEffect } from 'react'
import { Copy, Edit, Globe, Lock, MoreVertical, PieChart, Plus, Trash } from 'react-feather'

import { subtitle, title } from '@/components/primitives'
import { useDashboardSettings } from '@/hooks/dashboard-settings'
import { useMounted } from '@/hooks/mounted'
import DefaultLayout from '@/layouts/default'
import { EnumChartType } from '@/types/chart'
import toast from 'react-hot-toast'

export default function IndexPage() {
  const mounted = useMounted()
  const { loading, records, getDashboardSettings, deleteDashboard } = useDashboardSettings()

  useEffect(() => {
    if (mounted) {
      getDashboardSettings()
    }
  }, [mounted])

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/${id}`)
    toast.success('URL berhasil disalin')
  }

  return (
    <div className='w-full space-y-6'>
      <div className='w-full flex flex-col lg:flex-row items-end gap-6'>
        <div className='w-full space-y-2'>
          <h2 className={title()}>Pengaturan</h2>
          <p className={subtitle()}>Kelola chart group anda di sini</p>
        </div>
        <Link href='/settings/group-add' className='w-full lg:w-fit'>
          <Button color='primary' size='lg' className='w-full lg:w-fit' startContent={<Plus />}>
            Tambah
          </Button>
        </Link>
      </div>
      <div className='w-full space-y-4'>
        {loading ? (
          <div className='w-full flex min-h-[60dvh]'>
            <Spinner size='lg' className='m-auto' />
          </div>
        ) : (
          <>
            {records.map((r) => (
              <Card key={r.id} shadow='sm'>
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
                        href={`${window.location.origin}/dashboard/${r.id}`}
                      >
                        {r.dashboard_name}
                      </a>
                      <div className='flex flex-wrap items-center gap-4'>
                        {r.dashboard_public ? (
                          <Chip color='primary' className='pl-2' startContent={<Globe className='w-3 h-3' />}>
                            Public
                          </Chip>
                        ) : (
                          <Chip color='danger' className='pl-2' startContent={<Lock className='w-3 h-3' />}>
                            Private
                          </Chip>
                        )}
                        {r.dashboard_type === EnumChartType.CUSTOM ? (
                          <Chip color='primary' className='pl-2' startContent={<Edit className='w-3 h-3' />}>
                            Custom
                          </Chip>
                        ) : (
                          <Chip color='danger' className='pl-2' startContent={<Lock className='w-3 h-3' />}>
                            Basic
                          </Chip>
                        )}
                        <div className='text-sm'>
                          <b>Resolusi:</b> {r.dashboard_resolution}
                        </div>
                      </div>
                      {r.plants ? (
                        <div className='flex flex-wrap items-center gap-2 py-1'>
                          <div className='text-sm font-medium'>Plants: </div>
                          {r.plants.split(',').map((p) => (
                            <Chip key={p} color='warning' size='sm'>
                              {p}
                            </Chip>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <Dropdown>
                        <DropdownTrigger>
                          <div title='Hapus' className='cursor-pointer'>
                            <MoreVertical className='w-6 h-6' />
                          </div>
                        </DropdownTrigger>
                        <DropdownMenu aria-label='Static Actions'>
                          <DropdownItem
                            key='copy'
                            startContent={<Copy className='w-4 h-4' />}
                            onPress={() => onCopy(r.id)}
                          >
                            Salin URL
                          </DropdownItem>
                          <DropdownItem
                            key='edit'
                            startContent={<Edit className='w-4 h-4' />}
                            as={Link}
                            href={`/settings/${r.id}/group-edit`}
                          >
                            Edit
                          </DropdownItem>
                          {r.dashboard_type === EnumChartType.CUSTOM ? (
                            <DropdownItem
                              key='delete'
                              startContent={<Trash className='w-4 h-4' />}
                              className='text-danger'
                              color='danger'
                              onClick={() => {
                                const confirmation = window.confirm('Apakah anda yakin ingin menghapus data ini?')

                                if (confirmation) deleteDashboard(r.id)
                              }}
                            >
                              Hapus
                            </DropdownItem>
                          ) : null}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

IndexPage.getLayout = (page: React.ReactNode) => <DefaultLayout>{page}</DefaultLayout>
