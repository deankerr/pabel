import { v } from 'convex/values'

export const vEnum = <T extends ReadonlyArray<string>>(values: T) =>
  //@ts-expect-error this should be allowed
  v.union(...values.map((e) => v.literal(e)))

export const raise = (message: string): never => {
  throw new Error(message)
}

export function invariant<T>(condition: T, message?: string): asserts condition is NonNullable<T> {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}
