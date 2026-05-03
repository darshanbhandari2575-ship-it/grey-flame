import { useEffect, useMemo, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Categories from './components/Categories'
import ProductGrid from './components/ProductGrid'
import ProductDetail from './components/ProductDetail'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import { PRODUCTS, WHATSAPP_NUMBER } from './data/products'

function Toast({ message }) {
  return <div className={`toast ${message ? 'show' : ''}`}>{message}</div>
}

export default function App() {
  const [view, setView] = useState('home')
  const [filter, setFilter] = useState('all')
  const [cart, setCart] = useState([])
  const [recent, setRecent] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [giftWrap, setGiftWrap] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const count = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart])
  const selectedProduct = useMemo(() => PRODUCTS.find((item) => item.id === selectedId) || null, [selectedId])
  const recentlyViewed = useMemo(() => recent.filter((id) => id !== selectedId).slice(0, 4).map((id) => PRODUCTS.find((item) => item.id === id)).filter(Boolean), [recent, selectedId])
  const cartItems = useMemo(() => cart.map((item) => ({ ...item, product: PRODUCTS.find((p) => p.id === item.id) })).filter((item) => item.product), [cart])

  useEffect(() => {
    if (!toastMessage) return undefined
    const timer = setTimeout(() => setToastMessage(''), 2200)
    return () => clearTimeout(timer)
  }, [toastMessage])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  const go = (nextView) => setView(nextView)

  const addToBag = (id, customization = '') => {
    const details = customization.trim()
    const key = `${id}::${details}`
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key)
      if (existing) return prev.map((item) => item.key === key ? { ...item, qty: item.qty + 1 } : item)
      return [...prev, { id, key, customization: details, qty: 1 }]
    })
    setToastMessage(details ? 'customized piece added' : 'added to bag')
  }

  const removeFromBag = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key))
  }

  const updateQty = (key, delta) => {
    setCart((prev) => prev.flatMap((item) => {
      if (item.key !== key) return [item]
      const qty = item.qty + delta
      return qty <= 0 ? [] : [{ ...item, qty }]
    }))
  }

  const openProduct = (id) => {
    setSelectedId(id)
    setRecent((prev) => [id, ...prev.filter((item) => item !== id)].slice(0, 5))
    setView('product')
  }

  const selectCategory = (category) => {
    setFilter(category)
    setView('shop')
  }

  const askWhatsApp = (name) => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`hi! i'd like to know more about: ${name}`)}`, '_blank')
  }

  const checkout = () => {
    if (cart.length === 0) {
      setToastMessage('your bag is empty')
      return
    }
    let msg = "hi grey flame! i'd like to order:\n\n"
    cart.forEach((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id)
      if (product) {
        msg += `- ${product.name} x ${item.qty}\n`
        if (item.customization) msg += `  Customization: ${item.customization}\n`
      }
    })
    if (giftWrap) msg += '\n+ gift wrap (Rs. 99)'
    msg += '\n\nplease share total & payment details. thank you!'
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <div className="grain"></div>
      <Nav onGo={go} count={count} onOpenCart={() => setDrawerOpen(true)} />

      <div className={`view ${view === 'home' ? 'active' : ''}`}>
        <Hero />
        <Marquee />
        <Categories onSelect={selectCategory} />
      </div>

      <div className={`view ${view === 'shop' ? 'active' : ''}`}>
        <ProductGrid products={PRODUCTS} filter={filter} setFilter={setFilter} onOpen={openProduct} onAdd={addToBag} />
      </div>

      <div className={`view ${view === 'product' ? 'active' : ''}`}>
        <ProductDetail product={selectedProduct} recentlyViewed={recentlyViewed} onOpen={openProduct} onAdd={addToBag} onAskWhatsApp={askWhatsApp} />
      </div>

      <div className={`view ${view === 'about' ? 'active' : ''}`}>
        <div className="about-v"><span className="micro" style={{ color: 'var(--ember)' }}>the studio</span><h1>made by hand,<br /><em>lit by hour.</em></h1><p>grey flame is a quiet little studio working with wax, resin and concrete - shaping pieces that don't shout, but stay with you.</p><p>every piece is poured, set, and finished by hand. no two are quite alike. that's the whole point.</p></div>
      </div>

      <div className={`view ${view === 'contact' ? 'active' : ''}`}>
        <div className="contact-v"><span className="micro" style={{ color: 'var(--ember)' }}>say hello</span><h1>let&apos;s <em>talk.</em></h1><p>WhatsApp us, dm us on instagram, or send a slow letter.</p><p style={{ marginTop: '30px' }}><a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="btn">WhatsApp the studio</a></p></div>
      </div>

      <CartDrawer open={drawerOpen} cartItems={cartItems} count={count} giftWrap={giftWrap} setGiftWrap={setGiftWrap} onClose={() => setDrawerOpen(false)} onRemove={removeFromBag} onUpdateQty={updateQty} onCheckout={checkout} />
      <Footer onGo={go} />
      <Toast message={toastMessage} />
    </>
  )
}
