import { memo, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { fadeUp, imageReveal, staggerContainer } from '../motion'

function Hero() {
  const sectionRef = useRef(null)
  const heroImage = '/images/optimized/greyflames-hero-1440.webp'
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -34])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 10])

  return (
    <section className="hero" ref={sectionRef}>
      <motion.div className="depth-glow hero-glow" aria-hidden="true" style={{ y: backgroundY }} />
      <motion.div className="hero-copy" variants={staggerContainer} initial="hidden" animate="visible" style={{ y: copyY }}>
        <motion.div className="eb" variants={fadeUp}>
          <span className="dot"></span>
          <span className="micro">est. studio &middot; made in india</span>
        </motion.div>
        <motion.h1 variants={fadeUp}>hand-poured.<br /><em>softly lit.</em><br />slowly made.</motion.h1>
        <motion.div className="meta" variants={staggerContainer}>
          <motion.div className="tag" variants={fadeUp}>a small studio of resin, wax & concrete - shaped by hand, lit by hour.</motion.div>
          <motion.div className="st" variants={staggerContainer}>
            {[
              ['60', 'pieces'],
              ['3', 'collections'],
              ['100%', 'handmade'],
            ].map(([number, label]) => (
              <motion.div key={label} variants={fadeUp}>
                <div className="n">{number}</div>
                <div className="l">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div className="hero-art" aria-hidden="true" variants={imageReveal} initial="hidden" animate="visible" style={{ y: imageY }}>
        <img
          src={heroImage}
          srcSet="/images/optimized/greyflames-hero-768.webp 768w, /images/optimized/greyflames-hero-1080.webp 1080w, /images/optimized/greyflames-hero-1440.webp 1440w"
          sizes="(max-width: 900px) 62vw, 48vw"
          alt=""
          width="1672"
          height="941"
          loading="eager"
          fetchPriority="high"
          style={{ objectFit: 'cover' }}
        />
      </motion.div>
    </section>
  )
}

export default memo(Hero)
