import { memo } from 'react'
import { imageSrcSet, imageUrl } from '../utils/imageUrls'

const categories = [
  ['concrete', '01', 'Concrete Art', 'Big shell.jpg'],
  ['candles', '02', 'Candles', 'Bloomed lotus candle_.jpg'],
  ['resin', '03', 'Resin', 'resin-art.jpg'],
]

function Categories({ onSelect }) {
  return (
    <section className="cats">
      <h2>three quiet collections.</h2>

      <div className="cg">
        {categories.map(([key, num, title, img]) => (
          <div key={key} className="cc" onClick={() => onSelect(key)}>
            <img
              src={imageUrl(img)}
              srcSet={imageSrcSet(img)}
              sizes="(max-width: 900px) 100vw, 33vw"
              className="cat-img"
              alt=""
              loading="lazy"
              decoding="async"
              style={{ objectFit: "cover" }}
            />
            <div className="lb">
              <small>{num}</small>
              <h3>{title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default memo(Categories)
