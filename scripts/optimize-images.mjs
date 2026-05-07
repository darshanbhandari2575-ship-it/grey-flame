import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const sourceDir = path.join(process.cwd(), 'public', 'images')
const outputDir = path.join(sourceDir, 'optimized')
const widths = [160, 320, 480, 768, 1080, 1440]
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function optimizedImageName(fileName, width) {
  const slug = fileName
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${slug}-${width}.webp`
}

await mkdir(outputDir, { recursive: true })

const files = await readdir(sourceDir, { withFileTypes: true })
const images = files
  .filter((file) => file.isFile() && supportedExtensions.has(path.extname(file.name).toLowerCase()))
  .map((file) => file.name)

for (const fileName of images) {
  const source = path.join(sourceDir, fileName)
  const metadata = await sharp(source).metadata()

  for (const width of widths) {
    if (!metadata.width || metadata.width < width) continue

    await sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(outputDir, optimizedImageName(fileName, width)))
  }
}
