import { memo } from 'react'
import { imageDimensions, imageSrcSet, imageUrl } from '../utils/imageUrls'

function Categories({ categories, onSelect }) {
  return (
    <section className="cats">
      <h2>three quiet collections.</h2>

      <div className="cg">
        {categories.map((category, index) => {
          const key = category.id
          const num = String(index + 1).padStart(2, '0')
          const title = category.name
          const img = category.image || 'resin-art.jpg'
          const dimensions = imageDimensions(img)

          return (
            <div key={key} className="cc" onClick={() => onSelect(key)}>
              <img
                src={imageUrl(img, 768)}
                srcSet={imageSrcSet(img)}
                sizes="(max-width: 900px) 100vw, 33vw"
                className="cat-img"
                alt=""
                width={dimensions?.width}
                height={dimensions?.height}
                loading="lazy"
                style={{ objectFit: "cover" }}
              />
              <div className="lb">
                <small>{num}</small>
                <h3>{title}</h3>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default memo(Categories)
