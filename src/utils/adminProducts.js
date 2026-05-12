export const ADMIN_PRODUCTS_KEY = 'greyflames_admin_products'

export function readAdminProducts() {
  try {
    const raw = window.localStorage.getItem(ADMIN_PRODUCTS_KEY)
    if (!raw) return []

    const products = JSON.parse(raw)
    return Array.isArray(products) ? products : []
  } catch {
    return []
  }
}

export function saveAdminProducts(products) {
  window.localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products))
}
