import svgToDataUri from 'mini-svg-data-uri'
import { ImageResponse } from 'next/og'

import { environment } from '@/lib/utils'

export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

const orange = '#fa7214'
const amber = '#FFC53D'
const gold = '#8C7A5E'

const color = environment === 'prod' ? orange : environment === 'prev' ? amber : gold

const sun = svgToDataUri(`<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
<g fill="${color}" transform="matrix(1.5624768733978271, 0, 0, 1.5624768733978271, -149.993896484375, -128.97093200683594)">
  <path d="m157.87 382.38c3.0156 2.3438 6.1133 4.582 9.2969 6.7109h177.67c3.1797-2.1289 6.2812-4.3672 9.2969-6.7109z"/>
  <path d="m96 256c0 7.1211 0.46875 14.137 1.3711 21.012h317.26c0.90234-6.875 1.3711-13.891 1.3711-21.012 0-2.3398-0.054687-4.6641-0.15234-6.9766h-319.7c-0.097656 2.3125-0.15234 4.6367-0.15234 6.9766z"/>
  <path d="m401.39 189.12c-25.324-54.965-80.902-93.121-145.39-93.121s-120.07 38.156-145.39 93.121z"/>
  <path d="m100.45 293.59c1.6094 6.6875 3.6406 13.211 6.0625 19.543h298.99c2.4219-6.332 4.4492-12.855 6.0625-19.543z"/>
  <path d="m117.69 336.48c1.9688 3.375 4.0586 6.6758 6.2617 9.8867h264.1c2.2031-3.2148 4.293-6.5117 6.2617-9.8867z"/>
  <path d="m108.9 192.96c-6.1758 14.395-10.301 29.879-12.008 46.082h318.22c-1.707-16.203-5.832-31.688-12.008-46.082z"/>
</g>
</svg>`)

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <img alt="" width={32} height={32} src={sun} />
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    },
  )
}
