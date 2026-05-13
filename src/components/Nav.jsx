import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { buttonMotion } from '../motion'

export default function Nav({ onGo, count, onOpenCart }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={scrolled ? 'scrolled' : ''}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className="lg" onClick={() => onGo('home')} whileHover={{ opacity: 0.72 }} transition={{ duration: 0.24 }}>greyflames</motion.div>
      <ul>
        <li><a onClick={() => onGo('home')}>home</a></li>
        <li><a onClick={() => onGo('shop')}>shop</a></li>
        <li><a onClick={() => onGo('about')}>about</a></li>
        <li><a onClick={() => onGo('contact')}>contact</a></li>
      </ul>
      <div className="ic">
        <motion.div className="bag" onClick={onOpenCart} {...buttonMotion}>bag (<span>{count}</span>)</motion.div>
      </div>
    </motion.nav>
  )
}
