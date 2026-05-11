export function configureMathJax() {
  if (!window.MathJax) return;

  window.MathJax.Hub.Config({
    extensions: ['tex2jax.js', '[tex]/color','[tex]/_', '[tex]/textcolor'],
    //  extensions: [
    //   'tex2jax.js',
    //   '[tex]/color',
    //   '[tex]/textcolor',
    //   '[tex]/bbox',
    //   '[tex]/boldsymbol',
    //   '[tex]/amscd',
    //   '[tex]/braket',
    //   '[tex]/cancel',
    //   '[tex]/enclose',
    //   '[tex]/mhchem',
    //   '[tex]/unicode',
    //   '[tex]/upgreek',
    //   '[tex]/mathtools',
    //   '[tex]/_',
    //   '[tex]/raise',
    //   '[tex]/raisebox',
    // ],
    jax: ['input/TeX', 'output/HTML-CSS'],
    showMathMenu: false,
    tex2jax: {
      inlineMath: [
        ['$', '$'],
        ['\\(', '\\)'],
      ],
      displayMath: [
        ['$$', '$$'],
        ['\\[', '\\]'],
      ],
      processEscapes: true,
    },
    'HTML-CSS': { availableFonts: ['TeX'] },
  });
}