import { memo, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { buttonMotion, depthStaggerContainer, productCardReveal, smoothReveal } from '../motion'
import { imageDimensions, imageSrcSet, imageUrl } from '../utils/imageUrls'

function Categories({ categories, onSelect }) {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [24, -50])
  const contentY = useTransform(scrollYProgress, [0, 1], [16, -8])

  return (
    <motion.section className="cats depth-section" ref={sectionRef} variants={depthStaggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
      <motion.div className="depth-glow cats-glow" aria-hidden="true" style={{ y: backgroundY }} />
      <motion.div className="depth-content" style={{ y: contentY }}>
        <motion.h2 variants={smoothReveal}>three quiet collections.</motion.h2>

        <motion.div className="cg" variants={depthStaggerContainer}>
          {categories.map((category, index) => {
            const key = category.id
            const num = String(index + 1).padStart(2, '0')
            const title = category.name
            const img = category.image || 'resin-art.jpg'
            const dimensions = imageDimensions(img)

            return (
              <motion.div
                key={key}
                className="cc"
                onClick={() => onSelect(key)}
                variants={productCardReveal}
                whileHover={{ y: -6, scale: 1.02, rotateX: 2, rotateY: -2 }}
                whileTap={buttonMotion.whileTap}
                transition={{ type: 'spring', stiffness: 105, damping: 15, mass: 0.8 }}
                style={{ transformPerspective: 1000 }}
              >
                <motion.img
                  src={imageUrl(img, 768)}
                  srcSet={imageSrcSet(img)}
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="cat-img"
                  alt=""
                  width={dimensions?.width}
                  height={dimensions?.height}
                  loading="lazy"
                  style={{ objectFit: 'cover' }}
                />
                <div className="lb">
                  <small>{num}</small>
                  <h3>{title}</h3>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default memo(Categories)
