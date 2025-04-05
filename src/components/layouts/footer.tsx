import { Link } from '@heroui/link'
import { memo } from 'react'

export const Footer = memo(() => (
  <footer className='w-full flex items-center justify-center py-3'>
    <Link
      isExternal
      className='flex items-center gap-1 text-current'
      href='https://www.heroui.com'
      title='heroui.com homepage'
    >
      <span className='text-default-600'>Powered by</span>
      <p className='text-primary'>HeroUI</p>
    </Link>
  </footer>
))
