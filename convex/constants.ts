export const nsfwRatings = ['unknown', 'safe', 'low', 'high', 'x'] as const
export const modelBases = ['sd1.5', 'sdxl', 'dalle2', 'dalle3', 'unknown'] as const
export const modelTypes = ['checkpoint', 'lora', 'unknown'] as const
export const generationStatus = [
  'pending',
  'acting',
  'complete',
  'error',
  'failed',
  'cancelled',
] as const