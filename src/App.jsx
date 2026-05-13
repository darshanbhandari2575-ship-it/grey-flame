import { useCallback, useEffect, useMemo, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Categories from './components/Categories'
import ProductGrid from './components/ProductGrid'
import ProductDetail from './components/ProductDetail'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'
import { WHATSAPP_NUMBER } from './data/products'
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_SUBCATEGORIES, mergeCatalog } from './data/catalogDefaults'
import { db } from './firebase'
import { collection, onSnapshot } from 'firebase/firestore'

function Toast({ message }) {
  return <div className={`toast ${message ? 'show' : ''}`}>{message}</div>
}

export default function App() {
  const [view, setView] = useState(() => window.location.pathname === '/admin' ? 'admin' : 'home')
  const [filter, setFilter] = useState('all')
  const [firestoreCategories, setFirestoreCategories] = useState([])
  const [firestoreSubcategories, setFirestoreSubcategories] = useState([])
  const [firestoreProducts, setFirestoreProducts] = useState([])
  const [cart, setCart] = useState([])
  const [recent, setRecent] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [giftWrap, setGiftWrap] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const count = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart])
  const categories = useMemo(() => mergeCatalog(DEFAULT_CATEGORIES, firestoreCategories), [firestoreCategories])
  const subcategories = useMemo(() => mergeCatalog(DEFAULT_SUBCATEGORIES, firestoreSubcategories), [firestoreSubcategories])
  const products = useMemo(() => mergeCatalog(DEFAULT_PRODUCTS, firestoreProducts).map((product) => {
    const categoryId = product.categoryId || product.category
    const category = categories.find((item) => item.id === categoryId)

    return {
      ...product,
      category: categoryId,
      categoryId,
      categoryName: category?.name || categoryId,
    }
  }), [categories, firestoreProducts])
  const selectedProduct = useMemo(() => products.find((item) => item.id === selectedId) || null, [products, selectedId])
  const recentlyViewed = useMemo(() => recent.filter((id) => id !== selectedId).slice(0, 4).map((id) => products.find((item) => item.id === id)).filter(Boolean), [products, recent, selectedId])
  const cartItems = useMemo(() => cart.map((item) => ({ ...item, product: products.find((p) => p.id === item.id) })).filter((item) => item.product), [cart, products])

  useEffect(() => {
    if (!toastMessage) return undefined
    const timer = setTimeout(() => setToastMessage(''), 2200)
    return () => clearTimeout(timer)
  }, [toastMessage])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  useEffect(() => {
    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setFirestoreCategories(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
    })
    const unsubscribeSubcategories = onSnapshot(collection(db, 'subcategories'), (snapshot) => {
      setFirestoreSubcategories(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
    })
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setFirestoreProducts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
    })

    return () => {
      unsubscribeCategories()
      unsubscribeSubcategories()
      unsubscribeProducts()
    }
  }, [])

  const go = useCallback((nextView) => {
    if (nextView === 'admin') {
      window.history.pushState(null, '', '/admin')
    } else if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/')
    }

    setView((current) => current === nextView ? current : nextView)
  }, [])

  const addToBag = useCallback((id, customization = '') => {
    const details = customization.trim()
    const key = `${id}::${details}`
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key)
      if (existing) return prev.map((item) => item.key === key ? { ...item, qty: item.qty + 1 } : item)
      return [...prev, { id, key, customization: details, qty: 1 }]
    })
    setToastMessage(details ? 'customized piece added' : 'added to bag')
  }, [])

  const removeFromBag = useCallback((key) => {
    setCart((prev) => prev.filter((item) => item.key !== key))
  }, [])

  const updateQty = useCallback((key, delta) => {
    setCart((prev) => prev.flatMap((item) => {
      if (item.key !== key) return [item]
      const qty = item.qty + delta
      return qty <= 0 ? [] : [{ ...item, qty }]
    }))
  }, [])

  const openProduct = useCallback((id) => {
    setSelectedId((current) => current === id ? current : id)
    setRecent((prev) => [id, ...prev.filter((item) => item !== id)].slice(0, 5))
    setView((current) => current === 'product' ? current : 'product')
  }, [])

  const selectCategory = useCallback((category) => {
    setFilter((current) => current === category ? current : category)
    setView((current) => current === 'shop' ? current : 'shop')
  }, [])

  const goHome = useCallback(() => go('home'), [go])

  const askWhatsApp = useCallback((name) => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`hi! i'd like to know more about: ${name}`)}`, '_blank')
  }, [])

  const openCart = useCallback(() => setDrawerOpen((current) => current ? current : true), [])
  const closeCart = useCallback(() => setDrawerOpen((current) => current ? false : current), [])

  const checkout = useCallback(() => {
    if (cart.length === 0) {
      setToastMessage('your bag is empty')
      return
    }
    let msg = "hi greyflames! i'd like to order:\n\n"
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.id)
      if (product) {
        msg += `- ${product.name} x ${item.qty}\n`
        if (item.customization) msg += `  Customization: ${item.customization}\n`
      }
    })
    if (giftWrap) msg += '\n+ gift wrap (Rs. 99)'
    msg += '\n\nplease share total & payment details. thank you!'
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }, [cart, giftWrap, products])

  return (
    <>
      <div className="grain"></div>
      <Nav onGo={go} count={count} onOpenCart={openCart} />

      <div className={`view ${view === 'home' ? 'active' : ''}`}>
        <Hero />
        <Marquee />
        <Categories categories={categories} onSelect={selectCategory} />
      </div>

      <div className={`view ${view === 'shop' ? 'active' : ''}`}>
        <ProductGrid products={products} categories={categories} subcategories={subcategories} filter={filter} setFilter={setFilter} onOpen={openProduct} onAdd={addToBag} />
      </div>

      <div className={`view ${view === 'product' ? 'active' : ''}`}>
        <ProductDetail product={selectedProduct} recentlyViewed={recentlyViewed} onOpen={openProduct} onAdd={addToBag} onAskWhatsApp={askWhatsApp} />
      </div>

      <div className={`view ${view === 'about' ? 'active' : ''}`}>
        <div className="about-v"><span className="micro" style={{ color: 'var(--ember)' }}>the studio</span><h1>made by hand,<br /><em>lit by hour.</em></h1><p>greyflames is a quiet little studio working with wax, resin and concrete - shaping pieces that don't shout, but stay with you.</p><p>every piece is poured, set, and finished by hand. no two are quite alike. that's the whole point.</p></div>
      </div>

      <div className={`view ${view === 'contact' ? 'active' : ''}`}>
        <div className="contact-v"><span className="micro" style={{ color: 'var(--ember)' }}>say hello</span><h1>let&apos;s <em>talk.</em></h1><p>WhatsApp us, dm us on instagram, or send a slow letter.</p><p style={{ marginTop: '30px' }}><a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="btn">WhatsApp the studio</a></p></div>
      </div>

      <div className={`view ${view === 'admin' ? 'active' : ''}`}>
        <AdminPanel categories={categories} subcategories={subcategories} products={products} onGoHome={goHome} />
      </div>

      <CartDrawer open={drawerOpen} cartItems={cartItems} count={count} giftWrap={giftWrap} setGiftWrap={setGiftWrap} onClose={closeCart} onRemove={removeFromBag} onUpdateQty={updateQty} onCheckout={checkout} />
      <Footer onGo={go} />
      <Toast message={toastMessage} />
    </>
  )
}
