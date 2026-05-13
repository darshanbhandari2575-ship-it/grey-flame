import { memo } from 'react'
import { imageDimensions, imageSrcSet, imageUrl } from '../utils/imageUrls'

function ProductDetail({ product, recentlyViewed, onOpen, onAdd, onAskWhatsApp }) {
  if (!product) return null

  const price = product.price ? `Rs. ${product.price}` : 'Price on request'
  const dimensions = product.imageDimensions || imageDimensions(product.img)

  return (
    <>
      <div className="pdv">
        <div className="pim">
          <img
            src={imageUrl(product.img, 1080)}
            srcSet={imageSrcSet(product.img, [768, 1080, 1440])}
            sizes="(max-width: 900px) 100vw, 50vw"
            alt={product.name}
            width={dimensions?.width}
            height={dimensions?.height}
            loading="eager"
            style={{ objectFit: "cover" }}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>
        <div className="info">
          <div className="ct">{product.categoryName || product.categoryId || product.category}</div>
          <h1>{product.name}</h1>
          <p className="desc">hand-poured & finished in our small studio. each piece is unique - small variations are part of the craft.</p>
          <div className="pr-r">{price}</div>
          <div className="acts">
            <button className="btn" onClick={() => onAdd(product.id)}>add to bag</button>
            <button className="btn gh" onClick={() => onAskWhatsApp(product.name)}>ask on whatsapp</button>
          </div>
        </div>
      </div>
      {recentlyViewed.length > 0 && (
        <div className="rv">
          <h3>recently viewed.</h3>
          <div className="rv-grid">
            {recentlyViewed.map((item) => {
              const itemDimensions = item.imageDimensions || imageDimensions(item.img)

              return (
                <div key={item.id} className="p" onClick={() => onOpen(item.id)}>
                  <div className="img">
                    <img
                      src={imageUrl(item.img, 480)}
                      srcSet={imageSrcSet(item.img)}
                      sizes="(max-width: 900px) 50vw, 25vw"
                      alt={item.name}
                      width={itemDimensions?.width}
                      height={itemDimensions?.height}
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                  <h4>{item.name}</h4>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default memo(ProductDetail)
