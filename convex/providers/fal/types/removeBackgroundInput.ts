/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */

export interface RemoveBackgroundInput {
  /** 
            If set to true, the resulting image be cropped to a bounding box around the subject
         */
  crop_to_bbox?: boolean
  /** Input image url. */
  image_url: string
  /** 
            If set to true, the function will wait for the image to be generated and uploaded
            before returning the response. This will increase the latency of the function but
            it allows you to get the image directly in the response without going through the CDN.
         */
  sync_mode?: boolean
}