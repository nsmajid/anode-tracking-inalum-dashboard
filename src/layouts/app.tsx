import { useMemo } from 'react'
import { Button, Card, CardBody, CardHeader, Divider } from '@heroui/react'
import { Home, Settings, User } from 'react-feather'
import { useRouter } from 'next/router'

import { Head } from './head'

import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const settingsMenu = useMemo(() => {
    return [
      {
        title: 'Home',
        icon: Home,
        path: '/',
        active: router.pathname === '/'
      },
      {
        title: 'Pengaturan',
        icon: Settings,
        path: '/settings',
        active: router.pathname.startsWith('/settings')
      },
      {
        title: 'Profile',
        icon: User,
        path: '/profile',
        active: router.pathname.startsWith('/profile')
      }
    ]
  }, [router.pathname])

  return (
    <div className='relative flex flex-col min-h-[100dvh]'>
      <Head />
      <Navbar />
      <main className='container mx-auto max-w-7xl px-6 flex-grow'>
        <section className='w-full py-8 md:py-10'>
          <div className='w-full flex gap-8'>
            <div className='w-32'>
              <Card className='max-w-[400px]'>
                <CardHeader className='flex gap-3'>
                  <div className='w-full text-center text-md'>Menu</div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className='w-full flex flex-col gap-4'>
                    {settingsMenu.map((item) => (
                      <Button
                        key={item.title}
                        className='transition-all h-auto p-4'
                        color='primary'
                        variant={item.active ? 'flat' : 'light'}
                        onPress={() => router.push(item.path)}
                      >
                        <div className='w-full flex flex-col items-center gap-2'>
                          <div>
                            <item.icon size={42} />
                          </div>
                          <div className='text-xs'>{item.title}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className='flex-1'>{children}</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
