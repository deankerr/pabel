'use node'

import sharp from 'sharp'

import type { FormatEnum } from 'sharp'

const BLUR_FORMAT: keyof FormatEnum = 'png'
const BLUR_SIZE = 8
const BLUR_BRIGHTNESS = 1.25
const BLUR_SATURATION = 1.4

export const optimizeImage = async (input: Blob) => {
  const blurOptions = {
    format: BLUR_FORMAT,
    size: BLUR_SIZE,
    brightness: BLUR_BRIGHTNESS,
    saturation: BLUR_SATURATION,
  }

  const inputArrayBuffer = await input.arrayBuffer()
  const { width, height, format } = await sharp(inputArrayBuffer)
    .metadata()
    .then(({ width, height, format }) => {
      if (!(width && height && format)) {
        throw new Error('Failed to get required image metadata')
      }
      return { width, height, format }
    })

  const webpBuffer = await sharp(inputArrayBuffer).webp({ effort: 4 }).toBuffer()
  const webpBlob = new Blob([webpBuffer], { type: 'image/webp' })

  // see https://github.com/joe-bell/plaiceholder/blob/main/packages/plaiceholder/src/index.ts
  const pipeline = sharp(inputArrayBuffer)
    .resize(blurOptions.size, blurOptions.size, { fit: 'inside' })
    .toFormat(blurOptions.format)
    .modulate({
      brightness: blurOptions.brightness,
      saturation: blurOptions.saturation,
    })

  // dominant hex color
  const color = await pipeline
    .clone()
    .stats()
    .then(({ dominant: { r, g, b } }) => {
      return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
    })

  // base64
  const blur = await pipeline.clone().normalise().toBuffer({ resolveWithObject: true })
  const blurDataUrl = `data:image/${blur.info.format};base64,${blur.data.toString('base64')}`

  // new input blob with type from metadata
  const inputBlob = new Blob([input], { type: `image/${format}` })

  return { inputBlob, webpBlob, blurDataUrl, color, width, height, format }
}

export const resizeImage = async (input: Blob, toWidth: number) => {
  const resized = await sharp(await input.arrayBuffer())
    .resize({ width: toWidth })
    .toBuffer()
  return new Blob([resized])
}

export const processImageSrcset = async (input: Blob, widths: Readonly<number[]>) => {
  const arrBuffer = await input.arrayBuffer()
  const metadata = await sharp(arrBuffer)
    .metadata()
    .then(({ width, height, format }) => {
      if (!(width && height && format)) {
        throw new Error('Failed to get required image metadata')
      }
      return { width, height, format }
    })

  const pipeline = sharp(arrBuffer)
  const srcset: { width: number; blob: Blob }[] = []

  for (const width of widths) {
    if (width >= metadata.width) continue

    const resizedBuffer = await pipeline.clone().resize({ width }).toBuffer()
    const resizedBlob = new Blob([resizedBuffer], { type: input.type })
    srcset.push({ width, blob: resizedBlob })
  }

  return srcset
}
