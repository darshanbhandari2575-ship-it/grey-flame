const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL || ''

export function imageUrl(fileName, width) {
  if (!CLOUDINARY_BASE_URL) return `/images/${fileName}`

  const transformations = width ? `f_auto,q_80,w_${width},c_limit` : 'f_auto,q_80'
  return `${CLOUDINARY_BASE_URL.replace(/\/$/, '')}/${transformations}/${encodeURI(fileName)}`
}

export function imageSrcSet(fileName, widths = [480, 768, 1080]) {
  return widths.map((width) => `${imageUrl(fileName, width)} ${width}w`).join(', ')
}
