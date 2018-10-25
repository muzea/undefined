const path = require('path');
const fs = require('fs');
const babel = require('babel-core');
const glob = require('glob');
const myJsx = require('./jsx');

function checkPath(item) {
  const dir = path.dirname(item);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function transform(tempaltePath) {
  const fileList = glob.sync(tempaltePath + '**/*.jsx');
  const resultPath = '.result';
  function getResultFileName(item) {
    const relative = path.relative(tempaltePath, item);
    const result = path.basename(relative, path.extname(relative)) + '.js';
    return path.join(tempaltePath, resultPath, result);
  }
  for(const item of fileList) {
    const dst = getResultFileName(item);
    const { code } = babel.transformFileSync(item, {
      plugins: [myJsx],
      parserOpts: {
        plugins: ['jsx']
      }
    });
    checkPath(dst);
    fs.writeFileSync(dst, code);
  }
}

transform('./template')
