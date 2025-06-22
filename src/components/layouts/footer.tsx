import { memo } from 'react'

export const Footer = memo(() => (
  <footer className='w-full flex items-center justify-center py-12 px-8'>
    <div>PT Indonesia Asahan Aluminium ⓒ {new Date().getFullYear()} - Hak Cipta Dilindungi Hukum</div>
  </footer>
))
