import { memo } from 'react'
import { motion } from 'framer-motion'
import { buttonMotion, imageReveal, productCardReveal, smoothReveal, staggerContainer } from '../motion'
import { imageDimensions, imageSrcSet, imageUrl } from '../utils/imageUrls'

function ProductDetail({ product, recentlyViewed, onOpen, onAdd, onAskWhatsApp }) {
  if (!product) return null

  const price = product.price ? `Rs. ${product.price}` : 'Price on request'
  const dimensions = product.imageDimensions || imageDimensions(product.img)

  return (
    <>
      <div className="pdv">
        <motion.div className="pim" variants={imageReveal} initial="hidden" animate="visible">
          <img
            src={imageUrl(product.img, 1080)}
            srcSet={imageSrcSet(product.img, [768, 1080, 1440])}
            sizes="(max-width: 900px) 100vw, 50vw"
            alt={product.name}
            width={dimensions?.width}
            height={dimensions?.height}
            loading="eager"
            style={{ objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </motion.div>
        <motion.div className="info" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div className="ct" variants={smoothReveal}>{product.categoryName || product.categoryId || product.category}</motion.div>
          <motion.h1 variants={smoothReveal}>{product.name}</motion.h1>
          <motion.p className="desc" variants={smoothReveal}>hand-poured & finished in our small studio. each piece is unique - small variations are part of the craft.</motion.p>
          <motion.div className="pr-r" variants={smoothReveal}>{price}</motion.div>
          <motion.div className="acts" variants={smoothReveal}>
            <motion.button className="btn" onClick={() => onAdd(product.id)} {...buttonMotion}>add to bag</motion.button>
            <motion.button className="btn gh" onClick={() => onAskWhatsApp(product.name)} {...buttonMotion}>ask on whatsapp</motion.button>
          </motion.div>
        </motion.div>
      </div>
      {recentlyViewed.length > 0 && (
        <motion.div className="rv" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          <motion.h3 variants={smoothReveal}>recently viewed.</motion.h3>
          <motion.div className="rv-grid" variants={staggerContainer}>
            {recentlyViewed.map((item) => {
              const itemDimensions = item.imageDimensions || imageDimensions(item.img)

              return (
                <motion.div key={item.id} className="p" onClick={() => onOpen(item.id)} variants={productCardReveal} whileHover={{ y: -5, scale: 1.012 }} whileTap={buttonMotion.whileTap}>
                  <div className="img">
                    <img
                      src={imageUrl(item.img, 480)}
                      srcSet={imageSrcSet(item.img)}
                      sizes="(max-width: 900px) 50vw, 25vw"
                      alt={item.name}
                      width={itemDimensions?.width}
                      height={itemDimensions?.height}
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                  <h4>{item.name}</h4>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default memo(ProductDetail)
