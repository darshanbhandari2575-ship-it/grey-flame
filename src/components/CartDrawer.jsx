import { memo } from 'react'
import { imageDimensions, imageSrcSet, imageUrl } from '../utils/imageUrls'

function CartDrawer({ open, cartItems, count, giftWrap, setGiftWrap, onClose, onRemove, onUpdateQty, onCheckout }) {
  return (
    <div className={`drawer ${open ? 'open' : ''}`}>
      <div className="dh"><h3>your bag</h3><button className="cl" onClick={onClose}>x</button></div>
      <div className="body">
        {cartItems.length === 0 ? (
          <div className="empty">your bag is empty.<br />start with something soft.</div>
        ) : (
          cartItems.map(({ product, qty, key, customization }) => {
            const dimensions = product.imageDimensions || imageDimensions(product.img)

            return (
              <div className="ci" key={key}>
                <div className="im">
                  <img
                    src={imageUrl(product.img, 160)}
                    srcSet={imageSrcSet(product.img, [160, 320, 480])}
                    sizes="70px"
                    alt={product.name}
                    width={dimensions?.width}
                    height={dimensions?.height}
                    loading="lazy"
                    style={{ objectFit: "cover" }}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <div className="it">
                  <h5>{product.name}</h5>
                  {customization && <p className="custom-note">{customization}</p>}
                  <div className="qty">
                    <button onClick={() => onUpdateQty(key, -1)}>-</button>
                    {qty}
                    <button onClick={() => onUpdateQty(key, 1)}>+</button>
                  </div>
                  <button className="rm" onClick={() => onRemove(key)}>remove</button>
                </div>
              </div>
            )
          })
        )}
      </div>
      <div className="ft">
        <label className="gw"><input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} /> add gift wrap (+Rs. 99)</label>
        <div className="tot"><span>items</span><span>{count}</span></div>
        <button className="btn" onClick={onCheckout}>checkout via whatsapp</button>
      </div>
    </div>
  )
}

export default memo(CartDrawer)
