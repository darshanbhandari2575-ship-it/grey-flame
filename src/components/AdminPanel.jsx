import { useEffect, useMemo, useRef, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'
import { imageDimensions as getImageDimensions, imageSrcSet, imageUrl } from '../utils/imageUrls'
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_SUBCATEGORIES } from '../data/catalogDefaults'

const allowedEmails = [
  'greyflame108@gmail.com',
  'darshanbhandari2575@gmail.com',
]

const emptyCategory = { name: '', image: '' }
const emptySubcategory = { name: '', categoryId: '' }
const emptyProduct = {
  name: '',
  categoryId: '',
  subcategoryId: '',
  imageUrl: '',
  price: '',
  description: '',
}

function AdminPanel({ categories, subcategories, products, onGoHome }) {
  const productFormRef = useRef(null)
  const categoryFormRef = useRef(null)
  const subcategoryFormRef = useRef(null)
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(Boolean(auth))
  const [activeTab, setActiveTab] = useState('products')
  const [message, setMessage] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [productForm, setProductForm] = useState(emptyProduct)
  const [categoryForm, setCategoryForm] = useState(emptyCategory)
  const [subcategoryForm, setSubcategoryForm] = useState(emptySubcategory)
  const [productImageData, setProductImageData] = useState('')
  const [productImageDimensions, setProductImageDimensions] = useState(null)

  const isAllowed = useMemo(() => user?.email && allowedEmails.includes(user.email), [user])
  const productSubcategories = useMemo(
    () => subcategories.filter((subcategory) => subcategory.categoryId === productForm.categoryId),
    [productForm.categoryId, subcategories],
  )
  const isEditingProduct = Boolean(selectedProduct)
  const isEditingCategory = Boolean(selectedCategory)
  const isEditingSubcategory = Boolean(selectedSubcategory)

  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser)
    setChecking(false)
    if (nextUser && !allowedEmails.includes(nextUser.email)) {
      signOut(auth).finally(onGoHome)
    }
  }), [onGoHome])

  const login = async () => {
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

  const scrollTo = (ref) => window.requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))

  const updateProductField = (field, value) => {
    setProductForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'categoryId' ? { subcategoryId: '' } : {}),
    }))
  }

  const resetProductForm = () => {
    setSelectedProduct(null)
    setProductForm(emptyProduct)
    setProductImageData('')
    setProductImageDimensions(null)
  }

  const resetCategoryForm = () => {
    setSelectedCategory(null)
    setCategoryForm(emptyCategory)
  }

  const resetSubcategoryForm = () => {
    setSelectedSubcategory(null)
    setSubcategoryForm(emptySubcategory)
  }

  const handleProductImage = (event) => {
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
        setProductImageData(canvas.toDataURL('image/webp', 0.82))
        setProductImageDimensions({ width, height })
      }
      img.src = String(reader.result || '')
    }
    reader.readAsDataURL(file)
  }

  const saveCategory = async (event) => {
    event.preventDefault()
    const name = categoryForm.name.trim()
    if (!name) return setMessage('Category name is required.')
    if (categories.some((category) => category.id !== selectedCategory?.id && category.name.trim().toLowerCase() === name.toLowerCase())) {
      return setMessage('A category with that name already exists.')
    }

    const payload = { name, image: categoryForm.image.trim(), archived: false }
    if (selectedCategory) await setDoc(doc(db, 'categories', selectedCategory.id), payload, { merge: true })
    else await addDoc(collection(db, 'categories'), payload)

    setMessage(selectedCategory ? 'Category updated.' : 'Category added.')
    resetCategoryForm()
  }

  const saveSubcategory = async (event) => {
    event.preventDefault()
    const name = subcategoryForm.name.trim()
    if (!name || !subcategoryForm.categoryId) return setMessage('Subcategory name and parent category are required.')
    if (subcategories.some((subcategory) =>
      subcategory.id !== selectedSubcategory?.id &&
      subcategory.categoryId === subcategoryForm.categoryId &&
      subcategory.name.trim().toLowerCase() === name.toLowerCase()
    )) {
      return setMessage('A subcategory with that name already exists in this category.')
    }

    const payload = { name, categoryId: subcategoryForm.categoryId, archived: false }
    if (selectedSubcategory) await setDoc(doc(db, 'subcategories', selectedSubcategory.id), payload, { merge: true })
    else await addDoc(collection(db, 'subcategories'), payload)

    setMessage(selectedSubcategory ? 'Subcategory updated.' : 'Subcategory added.')
    resetSubcategoryForm()
  }

  const saveProduct = async (event) => {
    event.preventDefault()
    const name = productForm.name.trim()
    const img = productForm.imageUrl.trim() || productImageData || selectedProduct?.img
    if (!name || !img || !productForm.categoryId || !productForm.subcategoryId) {
      return setMessage('Product name, image, category, and subcategory are required.')
    }

    const payload = {
      name,
      img,
      categoryId: productForm.categoryId,
      subcategoryId: productForm.subcategoryId,
      description: productForm.description.trim(),
      archived: false,
    }

    if (productForm.price.trim()) payload.price = Number(productForm.price)
    if (productImageData && productImageDimensions) payload.imageDimensions = productImageDimensions
    else if (selectedProduct?.img === img && selectedProduct?.imageDimensions) payload.imageDimensions = selectedProduct.imageDimensions

    if (selectedProduct) await setDoc(doc(db, 'products', selectedProduct.id), payload, { merge: true })
    else await addDoc(collection(db, 'products'), payload)

    setMessage(selectedProduct ? 'Product updated.' : 'Product added.')
    resetProductForm()
  }

  const editCategory = (category) => {
    setActiveTab('categories')
    setSelectedCategory(category)
    setCategoryForm({ name: category.name || '', image: category.image || '' })
    scrollTo(categoryFormRef)
  }

  const editSubcategory = (subcategory) => {
    setActiveTab('subcategories')
    setSelectedSubcategory(subcategory)
    setSubcategoryForm({ name: subcategory.name || '', categoryId: subcategory.categoryId || '' })
    scrollTo(subcategoryFormRef)
  }

  const editProduct = (product) => {
    setActiveTab('products')
    setSelectedProduct(product)
    setProductForm({
      name: product.name || '',
      categoryId: product.categoryId || product.category || '',
      subcategoryId: product.subcategoryId || '',
      imageUrl: /^https?:/.test(product.img) ? product.img : '',
      price: product.price ? String(product.price) : '',
      description: product.description || '',
    })
    setProductImageData('')
    setProductImageDimensions(product.imageDimensions || null)
    scrollTo(productFormRef)
  }

  const archiveOrDelete = async (collectionName, item, defaultItems) => {
    if (defaultItems.some((defaultItem) => defaultItem.id === item.id)) {
      await setDoc(doc(db, collectionName, item.id), { ...item, archived: true }, { merge: true })
    } else {
      await deleteDoc(doc(db, collectionName, item.id))
    }
  }

  const deleteCategory = async (category) => {
    if (subcategories.some((subcategory) => subcategory.categoryId === category.id)) return setMessage('Delete blocked: this category still has subcategories.')
    await archiveOrDelete('categories', category, DEFAULT_CATEGORIES)
    setMessage('Category deleted.')
  }

  const deleteSubcategory = async (subcategory) => {
    if (products.some((product) => product.subcategoryId === subcategory.id)) return setMessage('Delete blocked: this subcategory still has products.')
    await archiveOrDelete('subcategories', subcategory, DEFAULT_SUBCATEGORIES)
    setMessage('Subcategory deleted.')
  }

  const deleteProduct = async (product) => {
    await archiveOrDelete('products', product, DEFAULT_PRODUCTS)
    if (selectedProduct?.id === product.id) resetProductForm()
    setMessage('Product deleted.')
  }

  if (checking) return <div className="admin-v"><p>checking admin access...</p></div>
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
          <h1>catalog.</h1>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'products' ? 'on' : ''} onClick={() => setActiveTab('products')}>Products</button>
        <button className={activeTab === 'categories' ? 'on' : ''} onClick={() => setActiveTab('categories')}>Categories</button>
        <button className={activeTab === 'subcategories' ? 'on' : ''} onClick={() => setActiveTab('subcategories')}>Subcategories</button>
      </div>

      {activeTab === 'products' && (
        <>
          <form className="admin-form" ref={productFormRef} onSubmit={saveProduct}>
            <h3>{isEditingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <label>Product Name<input value={productForm.name} onChange={(event) => updateProductField('name', event.target.value)} /></label>
            <label>
              Category
              <select value={productForm.categoryId} onChange={(event) => updateProductField('categoryId', event.target.value)}>
                <option value="">Select category</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <label>
              Subcategory
              <select value={productForm.subcategoryId} onChange={(event) => updateProductField('subcategoryId', event.target.value)}>
                <option value="">Select subcategory</option>
                {productSubcategories.map((subcategory) => <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>)}
              </select>
            </label>
            <label>Product Image URL (optional)<input value={productForm.imageUrl} onChange={(event) => updateProductField('imageUrl', event.target.value)} /></label>
            <label>Product Image Upload<input type="file" accept="image/*" onChange={handleProductImage} /></label>
            <label>Price<input type="number" min="0" value={productForm.price} placeholder="Price on request" onChange={(event) => updateProductField('price', event.target.value)} /></label>
            <label>Description<textarea value={productForm.description} onChange={(event) => updateProductField('description', event.target.value)} /></label>
            <div className="admin-actions">
              <button type="button" className="btn gh" onClick={resetProductForm}>Cancel</button>
              <button type="submit" className="btn">{isEditingProduct ? 'Update Product' : 'Add Product'}</button>
            </div>
          </form>
          <div className="admin-products">
            {products.map((product, index) => <AdminProductCard key={product.id} product={product} index={index} onEdit={editProduct} onDelete={deleteProduct} />)}
          </div>
        </>
      )}

      {activeTab === 'categories' && (
        <>
          <form className="admin-form" ref={categoryFormRef} onSubmit={saveCategory}>
            <h3>{isEditingCategory ? 'Edit Category' : 'Add Category'}</h3>
            <label>Category Name<input value={categoryForm.name} onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))} /></label>
            <label>Category Image URL (optional)<input value={categoryForm.image} onChange={(event) => setCategoryForm((current) => ({ ...current, image: event.target.value }))} /></label>
            <div className="admin-actions">
              <button type="button" className="btn gh" onClick={resetCategoryForm}>Cancel</button>
              <button type="submit" className="btn">{isEditingCategory ? 'Update Category' : 'Add Category'}</button>
            </div>
          </form>
          <div className="admin-list">
            {categories.map((category) => <AdminRow key={category.id} title={category.name} meta={category.image ? 'image set' : 'no image'} onEdit={() => editCategory(category)} onDelete={() => deleteCategory(category)} />)}
          </div>
        </>
      )}

      {activeTab === 'subcategories' && (
        <>
          <form className="admin-form" ref={subcategoryFormRef} onSubmit={saveSubcategory}>
            <h3>{isEditingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}</h3>
            <label>Subcategory Name<input value={subcategoryForm.name} onChange={(event) => setSubcategoryForm((current) => ({ ...current, name: event.target.value }))} /></label>
            <label>
              Parent Category
              <select value={subcategoryForm.categoryId} onChange={(event) => setSubcategoryForm((current) => ({ ...current, categoryId: event.target.value }))}>
                <option value="">Select category</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <div className="admin-actions">
              <button type="button" className="btn gh" onClick={resetSubcategoryForm}>Cancel</button>
              <button type="submit" className="btn">{isEditingSubcategory ? 'Update Subcategory' : 'Add Subcategory'}</button>
            </div>
          </form>
          <div className="admin-list">
            {subcategories.map((subcategory) => (
              <AdminRow
                key={subcategory.id}
                title={subcategory.name}
                meta={categories.find((category) => category.id === subcategory.categoryId)?.name || 'Unknown category'}
                onEdit={() => editSubcategory(subcategory)}
                onDelete={() => deleteSubcategory(subcategory)}
              />
            ))}
          </div>
        </>
      )}

      {message && <p className="admin-msg">{message}</p>}
    </div>
  )
}

function AdminProductCard({ product, index, onEdit, onDelete }) {
  const dimensions = product.imageDimensions || getImageDimensions(product.img)
  return (
    <div className="p admin-product">
      <ActionButtons onEdit={() => onEdit(product)} onDelete={() => onDelete(product)} label={product.name} />
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
      <div className="pr">{product.categoryName || product.categoryId} · {product.price ? `Rs. ${product.price}` : 'Price on request'}</div>
    </div>
  )
}

function AdminRow({ title, meta, onEdit, onDelete }) {
  return (
    <div className="admin-row">
      <div>
        <h4>{title}</h4>
        <p>{meta}</p>
      </div>
      <ActionButtons onEdit={onEdit} onDelete={onDelete} label={title} staticPosition />
    </div>
  )
}

function ActionButtons({ onEdit, onDelete, label, staticPosition = false }) {
  return (
    <div className={`admin-card-actions ${staticPosition ? 'static' : ''}`}>
      <button className="admin-icon-btn" type="button" onClick={onEdit} aria-label={`Edit ${label}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.6 5.4l3 3L8.8 18.2l-3.4.4.4-3.4 9.8-9.8z" /><path d="M14.2 6.8l3 3" /></svg>
      </button>
      <button className="admin-icon-btn" type="button" onClick={onDelete} aria-label={`Delete ${label}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 14h10l1-14" /><path d="M9 7V4h6v3" /></svg>
      </button>
    </div>
  )
}

export default AdminPanel
