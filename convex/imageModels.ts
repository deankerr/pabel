import { paginationOptsValidator, WithoutSystemFields } from 'convex/server'
import { v } from 'convex/values'
import { Doc } from './_generated/dataModel'
import { internalMutation, internalQuery, query } from './_generated/server'
import { modelBases, modelTypes, nsfwRatings } from './constants'
import * as images from './files/images'
import { ImageModel } from './types'
import { raise, vEnum } from './util'

export const imageModelFields = {
  name: v.string(),
  description: v.string(),
  base: vEnum(modelBases),
  type: vEnum(modelTypes),
  nsfw: vEnum(nsfwRatings),
  imageIds: v.array(v.id('images')),
  tags: v.array(v.string()),

  civitaiId: v.union(v.string(), v.null()),
  civitaiModelDataId: v.union(v.id('civitaiModelData'), v.null()),

  sinkinProviderId: v.optional(v.id('imageModelProviders')),
  sinkinApiModelId: v.optional(v.string()),

  hidden: v.boolean(),
}

export const list = query({
  args: {
    take: v.optional(v.number()),
    type: v.optional(vEnum(modelTypes)),
  },
  handler: async (ctx, { take, type }) => {
    const models = await ctx.db.query('imageModels').take(take ?? 10)

    const withImagesUrls = await Promise.all(
      models.map(async (m) => ({ ...m, images: await images.getIds(ctx, { ids: m.imageIds }) })),
    )
    return withImagesUrls
  },
})

export const listPage = query({
  args: {
    paginationOpts: paginationOptsValidator,
    type: v.optional(v.union(vEnum(modelTypes), v.literal('any'))),
  },
  handler: async (ctx, args) => {
    console.log('type', args.type)
    const results = await ctx.db
      .query('imageModels')
      .filter((q) => {
        if (!args.type || args.type === 'any') return true
        return q.eq(q.field('type'), args.type)
      })
      .paginate(args.paginationOpts)

    const withImagesUrls = await Promise.all(
      results.page.map(async (m) => ({
        ...m,
        images: await images.getIds(ctx, { ids: m.imageIds }),
      })),
    )
    return { ...results, page: withImagesUrls }
  },
})

export const listByCivitaiId = internalQuery(
  async (ctx) => await ctx.db.query('imageModels').withIndex('by_civitaiId').collect(),
)

export const listWithProvider = query(async (ctx) => {
  const models = await list(ctx, {})
  const withProviders = await Promise.all(
    models.map(async (m) => ({
      ...m,
      provider: m.sinkinProviderId ? await ctx.db.get(m.sinkinProviderId) : null,
    })),
  )

  return withProviders
})

export const getByCivitaiId = internalQuery(
  async (ctx, { civitaiId }: { civitaiId: string }) =>
    await ctx.db
      .query('imageModels')
      .withIndex('by_civitaiId', (q) => q.eq('civitaiId', civitaiId))
      .first(),
)

export const create = internalMutation(
  async (ctx, { doc }: { doc: WithoutSystemFields<ImageModel> }) => {
    const id = await ctx.db.insert('imageModels', { ...doc })
    // if (doc.civitaiId)
    //   await ctx.scheduler.runAfter(0, internal.imageModels.addCivitaiData, {
    //     id,
    //     civitaiId: doc.civitaiId,
    //   })
    return id
  },
)

export const update = internalMutation(
  async (ctx, { doc }: { doc: Partial<Doc<'imageModels'>> }) => {
    await ctx.db.patch(doc._id ?? raise('imageModel update missing _id'), doc)
  },
)

// export const addCivitaiData = internalAction(
//   async (ctx, { id, civitaiId }: { id: Id<'imageModels'>; civitaiId: string }) => {
//     const civitaiModelDataId = await ctx.runMutation(internal.providers.civitai.registerCivitaiId, {
//       civitaiId,
//     })
//     await ctx.runMutation(internal.imageModels.update, {
//       doc: {
//         _id: id,
//         civitaiModelDataId,
//       },
//     })
//   },
// )
