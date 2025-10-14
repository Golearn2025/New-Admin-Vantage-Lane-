/**
 * SVGO Configuration pentru iconițe
 * Optimizează SVG-uri păstrând calitatea și consistența
 */

module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Păstrează viewBox pentru scalabilitate
          removeViewBox: false,
        },
      },
    },
    // Elimină titluri și descrieri (A11y via aria-label)
    'removeTitle',
    'removeDesc',
    
    // Elimină dimensiuni hardcodate
    'removeDimensions',
    
    // Optimizează path data
    'convertPathData',
    
    // Previne conflicte ID între iconițe
    'prefixIds',
    
    // Curăță atribute nefolosite
    'removeUnusedNS',
    'removeEmptyContainers',
    
    // Optimizează stroke și fill
    'convertColors',
  ],
};
