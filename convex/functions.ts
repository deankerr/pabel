import { entsTableFactory } from 'convex-ents'
import { customCtx, customMutation, customQuery } from 'convex-helpers/server/customFunctions'
import {
  internalMutation as baseInternalMutation,
  internalQuery as baseInternalQuery,
  mutation as baseMutation,
  MutationCtx as BaseMutationCtx,
  query as baseQuery,
  QueryCtx as BaseQueryCtx,
} from './_generated/server'
import { getEntDefinitionsWithRules, getViewerId } from './rules'
import { entDefinitions } from './schema'
import { error } from './util'

export const query = customQuery(
  baseQuery,
  customCtx(async (baseCtx) => {
    return await queryCtx(baseCtx)
  }),
)

export const internalQuery = customQuery(
  baseInternalQuery,
  customCtx(async (baseCtx) => {
    return await queryCtx(baseCtx)
  }),
)

export const mutation = customMutation(
  baseMutation,
  customCtx(async (baseCtx) => {
    return await mutationCtx(baseCtx)
  }),
)

export const internalMutation = customMutation(
  baseInternalMutation,
  customCtx(async (baseCtx) => {
    return await mutationCtx(baseCtx)
  }),
)

async function queryCtx(baseCtx: BaseQueryCtx) {
  const ctx = {
    unsafeDb: baseCtx.db,
    db: undefined,
    skipRules: { table: entsTableFactory(baseCtx, entDefinitions) },
  }
  const entDefinitionsWithRules = getEntDefinitionsWithRules(ctx as any)
  const viewerId = await getViewerId({ ...baseCtx, ...ctx })
  ;(ctx as any).viewerId = viewerId
  const viewerIdX = () => {
    if (viewerId === null) {
      throw error('Expected authenticated viewer')
    }
    return viewerId
  }

  const table = entsTableFactory(baseCtx, entDefinitionsWithRules)
  ;(ctx as any).table = table
  // Example: add `viewer` and `viewerX` helpers to `ctx`:
  const viewer = async () => (viewerId !== null ? await table('users').get(viewerId) : null)
  ;(ctx as any).viewer = viewer
  const viewerX = async () => {
    const ent = await viewer()
    if (ent === null) {
      throw new Error('Expected authenticated viewer')
    }
    return ent
  }
  ;(ctx as any).viewerX = viewerX
  return { ...ctx, table, viewer, viewerX, viewerId, viewerIdX }
}

async function mutationCtx(baseCtx: BaseMutationCtx) {
  const ctx = {
    unsafeDb: baseCtx.db,
    db: undefined,
    skipRules: { table: entsTableFactory(baseCtx, entDefinitions) },
  }
  const entDefinitionsWithRules = getEntDefinitionsWithRules(ctx as any)

  const viewerId = await getViewerId({ ...baseCtx, ...ctx })
  ;(ctx as any).viewerId = viewerId

  const viewerIdX = () => {
    if (viewerId === null) {
      throw error('Expected authenticated viewer')
    }
    return viewerId
  }

  const table = entsTableFactory(baseCtx, entDefinitionsWithRules)
  ;(ctx as any).table = table

  // Example: add `viewer` and `viewerX` helpers to `ctx`:
  const viewer = async () => (viewerId !== null ? await table('users').get(viewerId) : null)
  ;(ctx as any).viewer = viewer
  const viewerX = async () => {
    const ent = await viewer()
    if (ent === null) {
      throw new Error('Expected authenticated viewer')
    }
    return ent
  }
  ;(ctx as any).viewerX = viewerX
  return { ...ctx, table, viewer, viewerX, viewerId, viewerIdX }
}