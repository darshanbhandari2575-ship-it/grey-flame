import { memo, useState } from 'react'
import { CATS } from '../data/products'
import { imageSrcSet, imageUrl } from '../utils/imageUrls'

const ProductCard = memo(function ProductCard({ product, onOpen, onAdd }) {
  const [customizing, setCustomizing] = useState(false)
  const [customization, setCustomization] = useState('')
  const isConcrete = product.category === 'concrete'
  const price = product.price ? `Rs. ${product.price}` : 'Price on request'

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
          src={imageUrl(product.img)}
          srcSet={imageSrcSet(product.img)}
          sizes="(max-width: 900px) 50vw, 25vw"
          alt={product.name}
          loading="lazy"
          decoding="async"
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
      <div className="pr">{CATS[product.category]} · {price}</div>
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

function ProductGrid({ products, filter, setFilter, onOpen, onAdd }) {
  const list = filter === 'all' ? products : products.filter((p) => p.category === filter)

  return (
    <>
      <div className="shop-h"><span className="micro" style={{ color: 'var(--ember)' }}>the studio</span><h2>everything we make.</h2></div>
      <div className="fl">
        <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>all</button>
        {Object.keys(CATS).map((key) => (
          <button key={key} className={filter === key ? 'on' : ''} onClick={() => setFilter(key)}>{CATS[key]}</button>
        ))}
      </div>
      {list.length > 0 ? (
        <div className="pg">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={onOpen} onAdd={onAdd} />
          ))}
        </div>
      ) : (
        <div className="empty-cat">Resin pieces are coming soon.</div>
      )}
    </>
  )
}

export default memo(ProductGrid)
