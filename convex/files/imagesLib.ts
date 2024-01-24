'use node'

import { ConvexError, v } from 'convex/values'
import imagesize from 'image-size'
import { api, internal } from '../_generated/api'
import { internalAction } from '../_generated/server'

const maxUploadBytes = 20 * 1024 * 1024
const allowedImageFormats = ['bmp', 'gif', 'heic', 'jpeg', 'jpg', 'png', 'tiff', 'webp'] as const

const kb = (bytes: number) => Math.floor(bytes / 1024) + 'kb'

// export const processImage = internalAction({
//   args: {
//     id: v.id('images'),
//   },
//   handler: async (ctx, { id }) => {
//     const image = await ctx.runQuery(api.files.images.get, { id })
//     if (!image) throw new ConvexError({ message: 'no image returned for id', id })

//     if (image.source) return id //* nothing to do

//     //* fetch source image
//     const sourceUrl = new URL(image.sourceUrl).toString()
//     const response = await fetch(sourceUrl)
//     if (!response.ok)
//       throw new ConvexError({ message: `${response.status} ${response.statusText}`, image })

//     //todo fix sinkin mimetype
//     const contentType = response.headers.get('Content-Type')
//     const blob = await response.blob()
//     const metadata = imagesize(new Uint8Array(await blob.arrayBuffer()))
//     console.log('file uploaded:', { sourceUrl, contentType, size: kb(blob.size), metadata })

//     if (blob.size > maxUploadBytes) {
//       throw new ConvexError({
//         message: `max upload size exceeded ${kb(blob.size)}kb > ${kb(maxUploadBytes)}kb`,
//         image,
//         metadata,
//       })
//     }

//     if (!allowedImageFormats.find((f) => f === metadata.type)) {
//       throw new ConvexError({
//         message: `invalid file format: "${metadata.type}"`,
//         image,
//         metadata,
//       })
//     }

//     const { width, height } = metadata
//     if (!width || !height) {
//       throw new ConvexError({
//         message: `invalid image size: width ${width}, height ${height}`,
//         image,
//         metadata,
//       })
//     }

//     const storageId = await ctx.storage.store(blob)
//     const url = await ctx.storage.getUrl(storageId)
//     if (!url) throw new ConvexError({ message: 'failed to get storage url', image })
//     const source = {
//       storageId,
//       url,
//       width,
//       height,
//       nsfw: 'unknown' as const,
//     }

//     await ctx.runMutation(internal.files.images.updateStorage, { id, source })
//     return id
//   },
// })