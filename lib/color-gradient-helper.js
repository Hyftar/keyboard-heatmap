
module.exports = {
  selectColor: (percentile, colors) => {
    const rgbFromHexString = (hex) => {
      const hexStringPattern = /^\#?([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})$/i;
      let match = null;
      if (match = hexStringPattern.exec(hex)) {
        return {
          r: parseInt(match[1], 16),
          g: parseInt(match[2], 16),
          b: parseInt(match[3], 16)
        };
      }
      return null;
    };

    const transitionBetween = (percent, colorA, colorB) => {
      return {
        r: Math.floor(colorA.r + ((colorB.r - colorA.r) * percent)),
        g: Math.floor(colorA.g + ((colorB.g - colorA.g) * percent)),
        b: Math.floor(colorA.b + ((colorB.b - colorA.b) * percent)),
      };
    };

    colors = colors.map((x) => rgbFromHexString(x));

    if (colors.length < 2 || !colors.every((x) => x)) {
      throw 'Need at least 2 colors in gradient.';
    }

    const position = percentile * (colors.length - 1);

    if (position == Math.floor(position)) {
      return colors[position];
    }

    return transitionBetween(
      position % 1,
      colors[Math.floor(position)],
      colors[Math.ceil(position)]
    );
  }
};
