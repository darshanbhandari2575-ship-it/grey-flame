import { memo, useState } from 'react'
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
    <div className="p">
      <div className="img" onClick={() => onOpen(product.id)}>
        <img
          src={imageUrl(product.img, 480)}
          srcSet={imageSrcSet(product.img)}
          sizes="(max-width: 900px) 50vw, 25vw"
          alt={product.name}
          width={dimensions?.width}
          height={dimensions?.height}
          loading={loading}
          style={{ objectFit: "cover" }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className={`qa-row ${isConcrete ? 'with-custom' : ''}`}>
          <button className="qa" onClick={(e) => { e.stopPropagation(); onAdd(product.id) }}>+ quick add</button>
          {isConcrete && (
            <button className="qa custom" onClick={(e) => { e.stopPropagation(); setCustomizing(true) }}>Customize</button>
          )}
        </div>
      </div>
      <h4 onClick={() => onOpen(product.id)}>{product.name}</h4>
      <div className="pr">{product.categoryName || product.category} · {price}</div>
      {customizing && (
        <div className="custom-box" onClick={(e) => e.stopPropagation()}>
          <input
            value={customization}
            onChange={(e) => setCustomization(e.target.value)}
            placeholder="Enter your customization details (e.g. names, date, event)"
            autoFocus
          />
          <div className="custom-actions">
            <button onClick={() => { setCustomizing(false); setCustomization('') }}>Cancel</button>
            <button onClick={addWithCustomization}>Add with Customization</button>
          </div>
        </div>
      )}
    </div>
  )
})

function ProductGrid({ products, categories, subcategories, filter, setFilter, onOpen, onAdd }) {
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
    <>
      <div className="shop-h"><span className="micro" style={{ color: 'var(--ember)' }}>the studio</span><h2>everything we make.</h2></div>
      <div className="fl">
        <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>all</button>
        {categories.map((category) => (
          <button key={category.id} className={selectedCategory === category.id ? 'on' : ''} onClick={() => setFilter(category.id)}>{category.name}</button>
        ))}
      </div>
      {visibleSubcategories.length > 0 && (
        <div className="fl">
          {visibleSubcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              className={filterType === 'subcategory' && filterId === subcategory.id ? 'on' : ''}
              onClick={() => setFilter(`subcategory:${subcategory.id}`)}
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      )}
      {list.length > 0 ? (
        <div className="pg">
          {list.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onOpen={onOpen} onAdd={onAdd} />
          ))}
        </div>
      ) : (
        <div className="empty-cat">Resin pieces are coming soon.</div>
      )}
    </>
  )
}

export default memo(ProductGrid)
