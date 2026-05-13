import { PRODUCTS } from './products'

export const DEFAULT_CATEGORIES = [
  { id: 'concrete', name: 'Concrete Art', image: 'Big shell.jpg' },
  { id: 'candles', name: 'Candles', image: 'Bloomed lotus candle_.jpg' },
  { id: 'resin', name: 'Resin', image: 'resin-art.jpg' },
]

export const DEFAULT_SUBCATEGORIES = [
  { id: 'concrete-general', name: 'Concrete Collection', categoryId: 'concrete' },
  { id: 'candles-christmas', name: 'Christmas', categoryId: 'candles' },
  { id: 'candles-diwali-35', name: 'Diwali 3.5 inch urli', categoryId: 'candles' },
  { id: 'candles-diwali-55', name: 'Diwali 5.5 inch urli', categoryId: 'candles' },
  { id: 'candles-bouquets', name: 'Bouquets', categoryId: 'candles' },
  { id: 'candles-top-tier', name: 'Top Tier Candles', categoryId: 'candles' },
  { id: 'resin-general', name: 'Resin Collection', categoryId: 'resin' },
]

export const DEFAULT_PRODUCTS = PRODUCTS.map((product) => ({
  ...product,
  categoryId: product.category,
  subcategoryId: defaultSubcategoryId(product),
}))

function defaultSubcategoryId(product) {
  if (product.category === 'concrete') return 'concrete-general'
  if (product.category === 'resin') return 'resin-general'

  const fileName = product.img.toLowerCase()
  if (['christmas', 'santa', 'reindeer', 'xmas', 'snowflake', 'rudolf', 'snowman', 'winter wonderland'].some((term) => fileName.includes(term))) {
    return 'candles-christmas'
  }
  if ((fileName.includes('diwali') || fileName.includes('urli')) && fileName.includes('3.5')) return 'candles-diwali-35'
  if ((fileName.includes('diwali') || fileName.includes('urli')) && fileName.includes('5.5')) return 'candles-diwali-55'
  if (/(?:^|[-_])(?:img|dsc)[-_]/i.test(product.img)) return 'candles-bouquets'
  return 'candles-top-tier'
}

export function mergeCatalog(defaultItems, firestoreItems) {
  const firestoreById = new Map(firestoreItems.map((item) => [item.id, item]))
  const mergedDefaults = defaultItems
    .filter((item) => firestoreById.get(item.id)?.archived !== true)
    .map((item) => firestoreById.get(item.id) || item)
  const additions = firestoreItems.filter((item) => !defaultItems.some((defaultItem) => defaultItem.id === item.id) && item.archived !== true)

  return [...mergedDefaults, ...additions]
}
