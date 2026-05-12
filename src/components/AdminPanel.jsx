import { useEffect, useMemo, useRef, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { CANDLE_SUBCATEGORIES, CATS } from '../data/products'
import { auth, googleProvider } from '../firebase'
import { readAdminProducts, saveAdminProducts } from '../utils/adminProducts'
import { imageDimensions as getImageDimensions, imageSrcSet, imageUrl } from '../utils/imageUrls'

const allowedEmails = [
  'greyflame108@gmail.com',
  'darshanbhandari2575@gmail.com',
]

const emptyForm = {
  name: '',
  category: 'resin',
  subcategory: '',
  imageUrl: '',
  price: '',
  description: '',
}

function AdminPanel({ products, onGoHome, onProductsChange }) {
  const formRef = useRef(null)
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(Boolean(auth))
  const [showForm, setShowForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [imageData, setImageData] = useState('')
  const [imageDimensions, setImageDimensions] = useState(null)
  const [message, setMessage] = useState('')

  const isAllowed = useMemo(() => user?.email && allowedEmails.includes(user.email), [user])

  useEffect(() => {
    if (!auth) {
      setChecking(false)
      return undefined
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setChecking(false)

      if (nextUser && !allowedEmails.includes(nextUser.email)) {
        signOut(auth).finally(onGoHome)
      }
    })
  }, [onGoHome])

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'category' && value !== 'candles' ? { subcategory: '' } : {}),
    }))
  }

  const resetForm = () => {
    setSelectedProduct(null)
    setIsEditing(false)
    setForm(emptyForm)
    setImageData('')
    setImageDimensions(null)
    setMessage('')
  }

  const editProduct = (product) => {
    const isExternalImage = /^(https?:)/.test(product.img)

    setSelectedProduct(product)
    setIsEditing(true)
    setForm({
      name: product.name || '',
      category: product.category || 'resin',
      subcategory: product.subcategory || '',
      imageUrl: isExternalImage ? product.img : '',
      price: product.price ? String(product.price) : '',
      description: product.description || '',
    })
    setImageData('')
    setImageDimensions(product.imageDimensions || null)
    setMessage('')
    setShowForm(true)
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const deleteProduct = (product) => {
    const nextProducts = readAdminProducts().filter((item) => item.id !== product.id)

    saveAdminProducts(nextProducts)
    onProductsChange(nextProducts)
    if (selectedProduct?.id === product.id) {
      resetForm()
      setShowForm(false)
    }
    setMessage('Product removed.')
  }

  const login = async () => {
    if (!auth) return
    setMessage('')

    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (!allowedEmails.includes(result.user.email)) {
        setMessage('This Google account is not allowed to access admin.')
        await signOut(auth)
        onGoHome()
      }
    } catch {
      setMessage('Google sign-in could not be completed.')
    }
  }

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxWidth = 900
        const scale = Math.min(1, maxWidth / img.naturalWidth)
        const width = Math.round(img.naturalWidth * scale)
        const height = Math.round(img.naturalHeight * scale)
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        canvas.width = width
        canvas.height = height
        context.drawImage(img, 0, 0, width, height)
        setImageData(canvas.toDataURL('image/webp', 0.82))
        setImageDimensions({ width, height })
      }
      img.src = String(reader.result || '')
    }
    reader.readAsDataURL(file)
  }

  const submitProduct = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    const img = form.imageUrl.trim() || imageData || selectedProduct?.img

    if (!name || !img) {
      setMessage('Product name and image are required.')
      return
    }

    const product = {
      ...(selectedProduct || {}),
      id: selectedProduct?.id || `admin_${Date.now()}`,
      name,
      category: form.category,
      img,
    }

    if (imageData && imageDimensions) {
      product.imageDimensions = imageDimensions
    } else if (selectedProduct?.img === img && selectedProduct?.imageDimensions) {
      product.imageDimensions = selectedProduct.imageDimensions
    } else {
      delete product.imageDimensions
    }

    if (form.category === 'candles' && form.subcategory) product.subcategory = form.subcategory
    else delete product.subcategory

    if (form.price.trim()) product.price = Number(form.price)
    else delete product.price

    if (form.description.trim()) product.description = form.description.trim()
    else delete product.description
    const adminProducts = readAdminProducts()
    const existingIndex = adminProducts.findIndex((item) => item.id === product.id)
    const nextProducts = existingIndex >= 0
      ? adminProducts.map((item) => item.id === product.id ? product : item)
      : [...adminProducts, product]

    saveAdminProducts(nextProducts)
    onProductsChange(nextProducts)
    setForm(emptyForm)
    setSelectedProduct(null)
    setIsEditing(false)
    setImageData('')
    setImageDimensions(null)
    setShowForm(false)
    setMessage(isEditing ? 'Product updated.' : 'Product added.')
  }

  if (checking) {
    return <div className="admin-v"><p>checking admin access...</p></div>
  }

  if (!user || !isAllowed) {
    return (
      <div className="admin-v">
        <span className="micro" style={{ color: 'var(--ember)' }}>admin</span>
        <h1>sign in.</h1>
        <p>Admin access is restricted to approved Google accounts.</p>
        <button className="btn" onClick={login}>Sign in with Google</button>
        {message && <p className="admin-msg">{message}</p>}
      </div>
    )
  }

  return (
    <div className="admin-v">
      <div className="admin-head">
        <div>
          <span className="micro" style={{ color: 'var(--ember)' }}>admin</span>
          <h1>products.</h1>
          <p>{user.email}</p>
        </div>
        <button className="btn" onClick={() => { resetForm(); setShowForm(true) }}>Add Product</button>
      </div>

      {showForm && (
        <form className="admin-form" ref={formRef} onSubmit={submitProduct}>
          <h3>{isEditing ? 'Edit Product' : 'Add Product'}</h3>
          <label>
            Product Name
            <input value={form.name} onChange={(event) => updateField('name', event.target.value)} />
          </label>
          <label>
            Category
            <select value={form.category} onChange={(event) => updateField('category', event.target.value)}>
              {Object.entries(CATS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          {form.category === 'candles' && (
            <label>
              Subcategory
              <select value={form.subcategory} onChange={(event) => updateField('subcategory', event.target.value)}>
                <option value="">Optional</option>
                {CANDLE_SUBCATEGORIES.map((subcategory) => (
                  <option key={subcategory.key} value={subcategory.key}>{subcategory.label}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            Product Image URL (optional)
            <input value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} />
          </label>
          <label>
            Product Image Upload
            <input type="file" accept="image/*" onChange={handleImage} />
          </label>
          <label>
            Price
            <input type="number" min="0" value={form.price} placeholder="Price on request" onChange={(event) => updateField('price', event.target.value)} />
          </label>
          <label>
            Description
            <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} />
          </label>
          <div className="admin-actions">
            <button type="button" className="btn gh" onClick={() => { resetForm(); setShowForm(false) }}>Cancel</button>
            <button type="submit" className="btn">{isEditing ? 'Update Product' : 'Submit'}</button>
          </div>
        </form>
      )}

      {message && <p className="admin-msg">{message}</p>}
      <div className="admin-products">
        {products.map((product, index) => {
          const dimensions = product.imageDimensions || getImageDimensions(product.img)

          return (
            <div className="p admin-product" key={product.id}>
              <div className="admin-card-actions">
                <button className="admin-icon-btn" type="button" onClick={() => editProduct(product)} aria-label={`Edit ${product.name}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15.6 5.4l3 3L8.8 18.2l-3.4.4.4-3.4 9.8-9.8z" />
                    <path d="M14.2 6.8l3 3" />
                  </svg>
                </button>
                <button className="admin-icon-btn" type="button" onClick={() => deleteProduct(product)} aria-label={`Delete ${product.name}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 7h16" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M6 7l1 14h10l1-14" />
                    <path d="M9 7V4h6v3" />
                  </svg>
                </button>
              </div>
              <div className="img">
                <img
                  src={imageUrl(product.img, 480)}
                  srcSet={imageSrcSet(product.img)}
                  sizes="(max-width: 900px) 50vw, 25vw"
                  alt={product.name}
                  width={dimensions?.width}
                  height={dimensions?.height}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  style={{ objectFit: 'cover' }}
                  onError={(event) => { event.currentTarget.style.display = 'none' }}
                />
              </div>
              <h4>{product.name}</h4>
              <div className="pr">{CATS[product.category]} · {product.price ? `Rs. ${product.price}` : 'Price on request'}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminPanel
