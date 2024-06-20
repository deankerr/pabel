import { ClassNameValue, cn } from '@/lib/utils'

const variants = {
  default: `url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='%23000' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_V8m1%7Btransform-origin:center;animation:spinner_zKoa 2s linear infinite%7D.spinner_V8m1 circle%7Bstroke-linecap:round;animation:spinner_YpZS 1.5s ease-out infinite%7D%40keyframes spinner_zKoa%7B100%25%7Btransform:rotate(360deg)%7D%7D%40keyframes spinner_YpZS%7B0%25%7Bstroke-dasharray:0 150;stroke-dashoffset:0%7D47.5%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-16%7D95%25%2C100%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-59%7D%7D%3C%2Fstyle%3E%3Cg class='spinner_V8m1'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3'%3E%3C%2Fcircle%3E%3C%2Fg%3E%3C%2Fsvg%3E")`,
  dots: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_qM83%7Banimation:spinner_8HQG 1.05s infinite%7D.spinner_oXPr%7Banimation-delay:.1s%7D.spinner_ZTLf%7Banimation-delay:.2s%7D@keyframes spinner_8HQG%7B0%25,57.14%25%7Banimation-timing-function:cubic-bezier(0.33,.66,.66,1);transform:translate(0)%7D28.57%25%7Banimation-timing-function:cubic-bezier(0.33,0,.66,.33);transform:translateY(-6px)%7D100%25%7Btransform:translate(0)%7D%7D%3C/style%3E%3Ccircle class='spinner_qM83' cx='4' cy='12' r='3'/%3E%3Ccircle class='spinner_qM83 spinner_oXPr' cx='12' cy='12' r='3'/%3E%3Ccircle class='spinner_qM83 spinner_ZTLf' cx='20' cy='12' r='3'/%3E%3C/svg%3E")`,
  ball: `url("data:image/svg+xml,%0A%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_rXNP%7Banimation:spinner_YeBj .8s infinite%7D@keyframes spinner_YeBj%7B0%25%7Banimation-timing-function:cubic-bezier(0.33,0,.66,.33);cy:5px%7D46.875%25%7Bcy:20px;rx:4px;ry:4px%7D50%25%7Banimation-timing-function:cubic-bezier(0.33,.66,.66,1);cy:20.5px;rx:4.8px;ry:3px%7D53.125%25%7Brx:4px;ry:4px%7D100%25%7Bcy:5px%7D%7D%3C/style%3E%3Cellipse class='spinner_rXNP' cx='12' cy='5' rx='4' ry='4'/%3E%3C/svg%3E")`,
  bars: `url("data:image/svg+xml,%0A%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_hzlK%7Banimation:spinner_vc4H .8s linear infinite;animation-delay:-.8s%7D.spinner_koGT%7Banimation-delay:-.65s%7D.spinner_YF1u%7Banimation-delay:-.5s%7D@keyframes spinner_vc4H%7B0%25%7By:1px;height:22px%7D93.75%25%7By:5px;height:14px;opacity:.2%7D%7D%3C/style%3E%3Crect class='spinner_hzlK' x='1' y='1' width='6' height='22'/%3E%3Crect class='spinner_hzlK spinner_koGT' x='9' y='1' width='6' height='22'/%3E%3Crect class='spinner_hzlK spinner_YF1u' x='17' y='1' width='6' height='22'/%3E%3C/svg%3E")`,
  ping: `url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg' stroke='%23fff'%3E%3Cg fill='none' fill-rule='evenodd' stroke-width='2'%3E%3Ccircle cx='22' cy='22' r='1'%3E%3Canimate attributeName='r' begin='0s' dur='1.8s' values='1; 20' calcMode='spline' keyTimes='0; 1' keySplines='0.165, 0.84, 0.44, 1' repeatCount='indefinite' /%3E%3Canimate attributeName='stroke-opacity' begin='0s' dur='1.8s' values='1; 0' calcMode='spline' keyTimes='0; 1' keySplines='0.3, 0.61, 0.355, 1' repeatCount='indefinite' /%3E%3C/circle%3E%3Ccircle cx='22' cy='22' r='1'%3E%3Canimate attributeName='r' begin='-0.9s' dur='1.8s' values='1; 20' calcMode='spline' keyTimes='0; 1' keySplines='0.165, 0.84, 0.44, 1' repeatCount='indefinite' /%3E%3Canimate attributeName='stroke-opacity' begin='-0.9s' dur='1.8s' values='1; 0' calcMode='spline' keyTimes='0; 1' keySplines='0.3, 0.61, 0.355, 1' repeatCount='indefinite' /%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")`,
  infinity: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='shape-rendering: auto;' width='200px' height='200px' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'%3E%3Cpath fill='none' stroke='%230a0a0a' stroke-width='10' stroke-dasharray='205.271142578125 51.317785644531256' d='M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z' stroke-linecap='round' style='transform:scale(0.8);transform-origin:50px 50px'%3E%3Canimate attributeName='stroke-dashoffset' repeatCount='indefinite' dur='2s' keyTimes='0;1' values='0;256.58892822265625'%3E%3C/animate%3E%3C/path%3E%3C/svg%3E")`,
}

export const LoadingSpinner = ({
  variant = 'default',
  className,
}: {
  variant?: keyof typeof variants
  className?: ClassNameValue
}) => {
  const maskImage = variants[variant] ?? variants['default']
  return (
    <span
      className={cn('pointer-events-none inline-block aspect-square w-6 bg-accent-11', className)}
      style={{
        maskSize: '100%',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskImage,
      }}
    >
      <span className="sr-only">Loading</span>
    </span>
  )
}
