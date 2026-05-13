import { memo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { buttonMotion, depthStaggerContainer, hoverLift, productCardReveal, smoothReveal, staggerContainer } from '../motion'
import { imageDimensions, imageSrcSet, imageUrl } from '../utils/imageUrls'

const ProductCard = memo(function ProductCard({ product, index, onOpen, onAdd }) {
  const [customizing, setCustomizing] = useState(false)
  const [customization, setCustomization] = useState('')
  const isConcrete = product.categoryId === 'concrete' || product.category === 'concrete'
  const price = product.price ? `Rs. ${product.price}` : 'Price on request'
  const dimensions = product.imageDimensions || imageDimensions(product.img)
  const loading = index < 4 ? 'eager' : 'lazy'

  const addWithCustomization = (event) => {
    event.stopPropagation()
    const details = customization.trim()
    if (!details) return
    onAdd(product.id, details)
    setCustomization('')
    setCustomizing(false)
  }

  return (
    <motion.div className="p" variants={productCardReveal} whileHover="hover">
      <motion.div className="img" variants={hoverLift} onClick={() => onOpen(product.id)}>
        <img
          src={imageUrl(product.img, 480)}
          srcSet={imageSrcSet(product.img)}
          sizes="(max-width: 900px) 50vw, 25vw"
          alt={product.name}
          width={dimensions?.width}
          height={dimensions?.height}
          loading={loading}
          style={{ objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className={`qa-row ${isConcrete ? 'with-custom' : ''}`}>
          <motion.button className="qa" onClick={(e) => { e.stopPropagation(); onAdd(product.id) }} {...buttonMotion}>+ quick add</motion.button>
          {isConcrete && (
            <motion.button className="qa custom" onClick={(e) => { e.stopPropagation(); setCustomizing(true) }} {...buttonMotion}>Customize</motion.button>
          )}
        </div>
      </motion.div>
      <h4 onClick={() => onOpen(product.id)}>{product.name}</h4>
      <div className="pr">{product.categoryName || product.category} &middot; {price}</div>
      {customizing && (
        <div className="custom-box" onClick={(e) => e.stopPropagation()}>
          <input
            value={customization}
            onChange={(e) => setCustomization(e.target.value)}
            placeholder="Enter your customization details (e.g. names, date, event)"
            autoFocus
          />
          <div className="custom-actions">
            <motion.button onClick={() => { setCustomizing(false); setCustomization('') }} {...buttonMotion}>Cancel</motion.button>
            <motion.button onClick={addWithCustomization} {...buttonMotion}>Add with Customization</motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )
})

function ProductGrid({ products, categories, subcategories, filter, setFilter, onOpen, onAdd }) {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [18, -50])
  const headerY = useTransform(scrollYProgress, [0, 1], [10, -4])
  const gridY = useTransform(scrollYProgress, [0, 1], [22, -10])
  const [filterType, filterId] = filter.includes(':') ? filter.split(':') : ['category', filter]
  const selectedCategory = filterType === 'subcategory'
    ? subcategories.find((subcategory) => subcategory.id === filterId)?.categoryId
    : filterId
  const visibleSubcategories = subcategories.filter((subcategory) => subcategory.categoryId === selectedCategory)
  const list = filter === 'all'
    ? products
    : filterType === 'subcategory'
      ? products.filter((product) => product.subcategoryId === filterId)
      : products.filter((product) => product.categoryId === filterId || product.category === filterId)

  return (
    <section className="shop-depth depth-section" ref={sectionRef}>
      <motion.div className="depth-glow shop-glow" aria-hidden="true" style={{ y: backgroundY }} />
      <motion.div className="depth-content" style={{ y: headerY }}>
        <motion.div className="shop-h" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.span className="micro" style={{ color: 'var(--ember)' }} variants={smoothReveal}>the studio</motion.span>
          <motion.h2 variants={smoothReveal}>everything we make.</motion.h2>
        </motion.div>
        <motion.div className="fl" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')} variants={smoothReveal} {...buttonMotion}>all</motion.button>
          {categories.map((category) => (
            <motion.button key={category.id} className={selectedCategory === category.id ? 'on' : ''} onClick={() => setFilter(category.id)} variants={smoothReveal} {...buttonMotion}>{category.name}</motion.button>
          ))}
        </motion.div>
        {visibleSubcategories.length > 0 && (
          <motion.div className="fl" variants={staggerContainer} initial="hidden" animate="visible">
            {visibleSubcategories.map((subcategory) => (
              <motion.button
                key={subcategory.id}
                className={filterType === 'subcategory' && filterId === subcategory.id ? 'on' : ''}
                onClick={() => setFilter(`subcategory:${subcategory.id}`)}
                variants={smoothReveal}
                {...buttonMotion}
              >
                {subcategory.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
      {list.length > 0 ? (
        <motion.div className="pg depth-content" variants={depthStaggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} style={{ y: gridY }}>
          {list.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onOpen={onOpen} onAdd={onAdd} />
          ))}
        </motion.div>
      ) : (
        <motion.div className="empty-cat depth-content" variants={smoothReveal} initial="hidden" animate="visible" style={{ y: gridY }}>Resin pieces are coming soon.</motion.div>
      )}
    </section>
  )
}

export default memo(ProductGrid)
