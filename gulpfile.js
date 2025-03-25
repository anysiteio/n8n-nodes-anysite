// eslint-disable-next-line @typescript-eslint/no-require-imports
const { src, dest } = require('gulp');

function copyIcons() {
  return src('./nodes/**/*.{png,svg}').pipe(dest('./dist/nodes'));
}

exports['build:icons'] = copyIcons;
