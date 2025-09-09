// A lightweight PostCSS plugin to promote 2D transforms to 3D
// to improve GPU compositing in modern browsers.
//
// - translate(x[, y])     -> translate3d(x, y||0, 0)
// - translateX(x)         -> translate3d(x, 0, 0)
// - translateY(y)         -> translate3d(0, y, 0)
// - scale(sx[, sy])       -> scale3d(sx, sy||sx, 1)
// - scaleX(sx)            -> scale3d(sx, 1, 1)
// - scaleY(sy)            -> scale3d(1, sy, 1)
// - rotate(a)             -> rotate3d(0, 0, 1, a)
// - matrix(a,b,c,d,e,f)   -> matrix3d(a,b,0,0, c,d,0,0, 0,0,1,0, e,f,0,1)
//
// Existing 3D transforms (translate3d/scale3d/rotate3d/matrix3d/translateZ/rotate[XYZ]) are left intact.
//
// Options:
//   addTranslateZ (boolean, default false): if true, appends `translateZ(0)` when no 3D is present.

function splitArgs(argStr) {
  // split by comma first, fallback to whitespace
  let parts = argStr.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length <= 1) {
    parts = argStr.split(/\s+/).map((s) => s.trim()).filter(Boolean);
  }
  return parts;
}

function promoteMatrixTo3d(value) {
  return value.replace(/matrix\(\s*([^\)]+)\)/g, (_m, args) => {
    const parts = splitArgs(args);
    if (parts.length !== 6) return _m; // keep original if unexpected
    const [a, b, c, d, e, f] = parts;
    // CSS matrix3d is column-major: m11,m12,m13,m14, m21,m22,m23,m24, m31,m32,m33,m34, m41,m42,m43,m44
    return `matrix3d(${a}, ${b}, 0, 0, ${c}, ${d}, 0, 0, 0, 0, 1, 0, ${e}, ${f}, 0, 1)`;
  });
}

function promoteFunctionsTo3d(value) {
  let v = value;
  // Avoid double-promoting if already 3D-ish
  const has3d = /(matrix3d|translate3d|scale3d|rotate3d|translateZ|rotate[XYZ]\s*\()/i.test(v);

  // translate(x[, y]) -> translate3d(x, y||0, 0)
  v = v.replace(/translate\(\s*([^\)]+)\)/g, (_m, args) => {
    const [x, y] = splitArgs(args);
    return `translate3d(${x || '0'}, ${y || '0'}, 0)`;
  });

  // translateX/translateY
  v = v.replace(/translateX\(\s*([^\)]+)\)/g, (_m, x) => `translate3d(${x.trim()}, 0, 0)`);
  v = v.replace(/translateY\(\s*([^\)]+)\)/g, (_m, y) => `translate3d(0, ${y.trim()}, 0)`);

  // scale(sx[, sy]) -> scale3d(sx, sy||sx, 1)
  v = v.replace(/scale\(\s*([^\)]+)\)/g, (_m, args) => {
    const [sx, sy] = splitArgs(args);
    return `scale3d(${sx || '1'}, ${sy || sx || '1'}, 1)`;
  });

  // scaleX/scaleY
  v = v.replace(/scaleX\(\s*([^\)]+)\)/g, (_m, sx) => `scale3d(${sx.trim()}, 1, 1)`);
  v = v.replace(/scaleY\(\s*([^\)]+)\)/g, (_m, sy) => `scale3d(1, ${sy.trim()}, 1)`);

  // rotate(a) -> rotate3d(0,0,1,a)
  v = v.replace(/rotate\(\s*([^\)]+)\)/g, (_m, a) => `rotate3d(0, 0, 1, ${a.trim()})`);

  return { v, has3d };
}

module.exports = (opts = {}) => {
  const { addTranslateZ = false } = opts;
  return {
    postcssPlugin: 'postcss-transform-3d',
    Declaration(decl) {
      if (decl.prop.toLowerCase() !== 'transform') return;
      const original = decl.value;

      // First, upgrade matrix() to matrix3d()
      let next = promoteMatrixTo3d(original);

      // Then, upgrade function forms to 3D
      const { v, has3d } = promoteFunctionsTo3d(next);
      next = v;

      if (addTranslateZ && !has3d && !/translateZ\(/i.test(next)) {
        next = `${next} translateZ(0)`;
      }

      decl.value = next;
    },
  };
};

module.exports.postcss = true;

