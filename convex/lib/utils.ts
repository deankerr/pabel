import { customAlphabet } from 'nanoid/non-secure'

import type { MutationCtx } from '../types'

// see https://github.com/xixixao/saas-starter/blob/main/convex/utils.ts
// permanent loading state for a paginated query until a different result is returned
export function emptyPage() {
  return {
    page: [],
    isDone: false,
    continueCursor: '',
    pageStatus: 'SplitRequired' as const,
  }
}

export const generateSlug = async (ctx: MutationCtx) => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789')

  async function getAvailableSlug(): Promise<string> {
    const slug = nanoid(8)
    const existing = await ctx.table('threads', 'slug', (q) => q.eq('slug', slug)).first()
    return existing ? await getAvailableSlug() : slug
  }

  return await getAvailableSlug()
}

export const generateRandomString = (length: number) => {
  const generate = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  return generate(length)
}

const uidMagic = 1627826378900 // turn back time to reduce the size of the uid
export const generateId = (letter: string, number: number): string => {
  const char1 = letter.charAt(0)
  const code = base36Encode(Math.trunc(number) - uidMagic)
  const char2 = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 1)
  return `${char1}${code}${char2()}`
}

function base36Encode(number: number): string {
  if (!Number.isInteger(number)) {
    throw new TypeError(`number must be an integer: ${number}`)
  }
  if (number < 0) {
    throw new RangeError(`number must be positive: ${number}`)
  }

  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
  let base36 = ''

  while (number > 0) {
    const remainder = number % 36
    base36 = alphabet[remainder] + base36
    number = Math.floor(number / 36)
  }

  return base36 || '0'
}
