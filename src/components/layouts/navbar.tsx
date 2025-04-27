import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem
} from '@heroui/navbar'
import { Link } from '@heroui/link'
import { link as linkStyles } from '@heroui/theme'
import NextLink from 'next/link'
import clsx from 'clsx'
import { useMemo } from 'react'
import { Grid, Settings, User } from 'react-feather'
import { useRouter } from 'next/router'

import { siteConfig } from '@/config/site'
// import { ThemeSwitch } from '@/components/theme-switch'
import { Logo } from '@/components/icons'
import { RoleType, useProfile } from '@/hooks/profile'
import { BACKOFFICE_URL } from '@/config/constants'

export const Navbar = () => {
  const router = useRouter()
  const { profile } = useProfile()

  const menus = useMemo(() => {
    return [
      ...(profile
        ? [
            ...(profile.roles.includes(RoleType.ADMINISTRATOR)
              ? [
                  {
                    label: 'Pengaturan',
                    href: '/settings',
                    icon: Settings,
                    active: router.pathname.startsWith('/settings')
                  }
                ]
              : []),
            {
              label: 'Web Anode Tracking',
              href: BACKOFFICE_URL,
              icon: Grid,
              active: false
            }
          ]
        : [])
    ]
  }, [router.pathname, profile])

  return (
    <HeroUINavbar maxWidth='xl' position='sticky'>
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand className='gap-3 max-w-fit'>
          <NextLink className='flex justify-start items-center gap-1' href='/'>
            <Logo />
            <p className='font-bold text-inherit'>ACME</p>
          </NextLink>
        </NavbarBrand>
        <div className='hidden lg:flex gap-4 justify-start ml-2'>
          {menus.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium transition-all',
                  item.active && 'text-primary font-bold'
                )}
                color='foreground'
                href={item.href ?? '#'}
              >
                <item.icon className='w-4 h-4 mr-2' />
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent className='hidden sm:flex basis-1/5 sm:basis-full' justify='end'>
        <NavbarItem className='hidden sm:flex gap-4'>
          {/* <ThemeSwitch /> */}
          {profile && (
            <Link href='/profile' className='w-fit' color='foreground'>
              <User className='mr-2' />
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className='sm:hidden basis-1 pl-4' justify='end'>
        {/* <ThemeSwitch /> */}
        {profile && (
          <Link href='/profile' className='w-fit' color='foreground'>
            <User className='mr-2' />
          </Link>
        )}
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {menus.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={index === 2 ? 'primary' : index === siteConfig.navMenuItems.length - 1 ? 'danger' : 'foreground'}
                href='#'
                size='lg'
              >
                <item.icon className='w-4 h-4 mr-2' />
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  )
}
