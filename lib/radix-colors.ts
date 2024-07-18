import * as Colors from '@radix-ui/colors'

// * hex values
const darkColors = {
  ...Colors.amberDark,
  ...Colors.blueDark,
  ...Colors.bronzeDark,
  ...Colors.brownDark,
  ...Colors.crimsonDark,
  ...Colors.cyanDark,
  ...Colors.goldDark,
  ...Colors.grassDark,
  ...Colors.grayDark,
  ...Colors.greenDark,
  ...Colors.indigoDark,
  ...Colors.irisDark,
  ...Colors.jadeDark,
  ...Colors.limeDark,
  ...Colors.mauveDark,
  ...Colors.mintDark,
  ...Colors.oliveDark,
  ...Colors.orangeDark,
  ...Colors.pinkDark,
  ...Colors.plumDark,
  ...Colors.purpleDark,
  ...Colors.redDark,
  ...Colors.rubyDark,
  ...Colors.sageDark,
  ...Colors.sandDark,
  ...Colors.skyDark,
  ...Colors.slateDark,
  ...Colors.tealDark,
  ...Colors.tomatoDark,
  ...Colors.violetDark,
  ...Colors.yellowDark,
}

const darkColorsAlpha = {
  ...Colors.amberDarkA,
  ...Colors.blueDarkA,
  ...Colors.bronzeDarkA,
  ...Colors.brownDarkA,
  ...Colors.crimsonDarkA,
  ...Colors.cyanDarkA,
  ...Colors.goldDarkA,
  ...Colors.grassDarkA,
  ...Colors.grayDarkA,
  ...Colors.greenDarkA,
  ...Colors.indigoDarkA,
  ...Colors.irisDarkA,
  ...Colors.jadeDarkA,
  ...Colors.limeDarkA,
  ...Colors.mauveDarkA,
  ...Colors.mintDarkA,
  ...Colors.oliveDarkA,
  ...Colors.orangeDarkA,
  ...Colors.pinkDarkA,
  ...Colors.plumDarkA,
  ...Colors.purpleDarkA,
  ...Colors.redDarkA,
  ...Colors.rubyDarkA,
  ...Colors.sageDarkA,
  ...Colors.sandDarkA,
  ...Colors.skyDarkA,
  ...Colors.slateDarkA,
  ...Colors.tealDarkA,
  ...Colors.tomatoDarkA,
  ...Colors.violetDarkA,
  ...Colors.yellowDarkA,
}

// * css variables
function createRadixColors() {
  const scale = (key: string) =>
    Object.fromEntries([...Array(12)].map((_, i) => [i + 1, `var(--${key}${i + 1})`]))

  return {
    blackA: scale('black-a'),
    whiteA: scale('white-a'),
    accent: scale('orange-'),
    accentA: scale('orange-a'),
    gray: scale('gray-'),
    grayA: scale('gray-a'),
    gold: scale('gold-'),
    goldA: scale('gold-a'),
    bronze: scale('bronze-'),
    bronzeA: scale('bronze-a'),
    brown: scale('brown-'),
    brownA: scale('brown-a'),
    yellow: scale('yellow-'),
    yellowA: scale('yellow-a'),
    amber: scale('amber-'),
    amberA: scale('amber-a'),
    orange: scale('orange-'),
    orangeA: scale('orange-a'),
    tomato: scale('tomato-'),
    tomatoA: scale('tomato-a'),
    red: scale('red-'),
    redA: scale('red-a'),
    ruby: scale('ruby-'),
    rubyA: scale('ruby-a'),
    crimson: scale('crimson-'),
    crimsonA: scale('crimson-a'),
    pink: scale('pink-'),
    pinkA: scale('pink-a'),
    plum: scale('plum-'),
    plumA: scale('plum-a'),
    purple: scale('purple-'),
    purpleA: scale('purple-a'),
    violet: scale('violet-'),
    violetA: scale('violet-a'),
    iris: scale('iris-'),
    irisA: scale('iris-a'),
    indigo: scale('indigo-'),
    indigoA: scale('indigo-a'),
    blue: scale('blue-'),
    blueA: scale('blue-a'),
    cyan: scale('cyan-'),
    cyanA: scale('cyan-a'),
    teal: scale('teal-'),
    tealA: scale('teal-a'),
    jade: scale('jade-'),
    jadeA: scale('jade-a'),
    green: scale('green-'),
    greenA: scale('green-a'),
    grass: scale('grass-'),
    grassA: scale('grass-a'),
    lime: scale('lime-'),
    limeA: scale('lime-a'),
    mint: scale('mint-'),
    mintA: scale('mint-a'),
    sky: scale('sky-'),
    skyA: scale('sky-a'),
  }
}

const colors = {
  hex: {
    ...darkColors,
    ...darkColorsAlpha,
  },
  css: createRadixColors(),
}

export default colors
