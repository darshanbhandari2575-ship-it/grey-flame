const CLOUDINARY_BASE_URL = import.meta.env?.VITE_CLOUDINARY_BASE_URL || ''
const DEFAULT_IMAGE_WIDTH = 768
const OPTIMIZED_WIDTHS = [160, 320, 480, 768, 1080, 1440]

const IMAGE_DIMENSIONS = {
  '2D Christmas tree pastel.webp': { width: 1080, height: 1920 },
  '2D Christmas tree_.webp': { width: 1080, height: 1920 },
  '3 Lotus candle 3.5_ urli.jpg': { width: 4096, height: 3072 },
  '3D Christmas candle.webp': { width: 1080, height: 1920 },
  'Big shell.jpg': { width: 8192, height: 4608 },
  'Birthday Photo Resin Plaque.png': { width: 1620, height: 1211 },
  'Birthday Resin Keepsake.png': { width: 911, height: 1211 },
  'Bloomed lotus candle_.jpg': { width: 8192, height: 6144 },
  'Bubble tray (1).jpg': { width: 8192, height: 4608 },
  'Chandrika 5.5_ Urli.jpg': { width: 4096, height: 3072 },
  'Christmas house candle_.webp': { width: 1080, height: 1920 },
  'Christmas wax sachet.webp': { width: 1080, height: 1920 },
  'Conch.jpg': { width: 8192, height: 4608 },
  'Concrete Christmas figurines.webp': { width: 1080, height: 1920 },
  'Copy of Snowflakes candle_.webp': { width: 1080, height: 1920 },
  'Dual tray customisation.jpg': { width: 8192, height: 4608 },
  'Dual tray.jpg': { width: 6144, height: 8192 },
  'Floating daisy candles 1.jpg': { width: 8192, height: 6144 },
  'Floral blooms daisy 3.5_ urli.jpg': { width: 4096, height: 3072 },
  'Floral blooms periwinkle 3.5_ urli.jpg': { width: 4096, height: 3072 },
  'Floral blooms pink roses 3.5_ urli.jpg': { width: 4096, height: 3072 },
  'Floral blooms sunflower 3.5_ urli.jpg': { width: 4096, height: 3072 },
  'Floral blooms white & yellow 3.5_ urli.jpg': { width: 4096, height: 3072 },
  'Floral blooms yellow dried flowers 3.5_ urli.jpg': { width: 4096, height: 3072 },
  'Floral blooms yellow roses 3.5_ urli.jpg': { width: 4096, height: 3072 },
  'Gulgaura 5.5_ Urli.jpg': { width: 4096, height: 3072 },
  'IMG-20260127-WA0037.jpg': { width: 1536, height: 1024 },
  'IMG-20260204-WA0062.jpg': { width: 768, height: 1360 },
  'IMG-20260204-WA0083.jpg': { width: 1536, height: 1024 },
  'IMG_20260120_181010357.jpg': { width: 4608, height: 8192 },
  'Jasmine Serenity 3.5_ urli.jpg': { width: 4096, height: 3072 },
  'Kamalini 5.5_ Urli.jpg': { width: 1280, height: 960 },
  'Lotus bud candles_.jpg': { width: 8192, height: 6144 },
  'lotus bud tea light holder.jpg': { width: 8192, height: 4608 },
  'Lotus jar + tray combo.jpg': { width: 4096, height: 2304 },
  'Lotus jar collection.jpg': { width: 8192, height: 4608 },
  'Lotus jar.jpg': { width: 6144, height: 8192 },
  'Lotus pond 3.5_ urli_.jpg': { width: 4096, height: 3072 },
  'Manorama 5.5_ Urli.jpg': { width: 4096, height: 3072 },
  'Mithai candles_.jpg': { width: 7358, height: 5518 },
  'Mithra Thank You Resin Plaque.png': { width: 682, height: 1212 },
  'Padmasar 5.5_ Urli.jpg': { width: 4096, height: 3072 },
  'Peony candles_.jpg': { width: 8192, height: 6144 },
  'Personalized Seashell Resin Plaque.png': { width: 806, height: 1209 },
  'Reindeers_.webp': { width: 1080, height: 1920 },
  'resin-art.jpg': { width: 1613, height: 1217 },
  'Rudolf Candle_.jpg': { width: 1080, height: 817 },
  'Santa & Rudolf Candle.jpg': { width: 1078, height: 777 },
  'small shell trinket tray.jpg': { width: 8192, height: 4608 },
  'Snowman candle_.webp': { width: 1080, height: 1920 },
  'Stackable christmas tree.webp': { width: 1080, height: 1920 },
  'Star fish dish.jpg': { width: 8192, height: 4608 },
  'Tray + lotus jar + vase combo.jpg': { width: 4096, height: 2304 },
  'Tray + Planter girl.jpg': { width: 4096, height: 2304 },
  'Tray + Rose jar.jpg': { width: 4096, height: 2304 },
  'Tray.jpg': { width: 8192, height: 4608 },
  'Winter wonderland_.webp': { width: 1080, height: 1920 },
}

export function imageUrl(fileName, width) {
  if (!CLOUDINARY_BASE_URL || fileName.includes('+')) {
    const dimensions = imageDimensions(fileName)
    const requestedWidth = width || DEFAULT_IMAGE_WIDTH
    const optimizedWidth = dimensions
      ? [...OPTIMIZED_WIDTHS].reverse().find((candidate) => candidate <= requestedWidth && candidate <= dimensions.width)
      : requestedWidth

    if (optimizedWidth) {
      return `/images/optimized/${optimizedImageName(fileName, optimizedWidth)}`
    }

    return `/images/${encodeURIComponent(fileName)}`
  }

  const transformations = width ? `f_auto,q_80,w_${width},c_limit` : 'f_auto,q_80'
  return `${CLOUDINARY_BASE_URL.replace(/\/$/, '')}/${transformations}/${encodeURIComponent(fileName)}`
}

export function imageSrcSet(fileName, widths = [480, 768, 1080]) {
  const dimensions = imageDimensions(fileName)
  const availableWidths = dimensions ? widths.filter((width) => width <= dimensions.width) : widths

  return availableWidths.map((width) => `${imageUrl(fileName, width)} ${width}w`).join(', ')
}

export function imageDimensions(fileName) {
  return IMAGE_DIMENSIONS[fileName]
}

export function optimizedImageName(fileName, width) {
  const slug = fileName
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${slug}-${width}.webp`
}
