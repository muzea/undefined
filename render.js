const path = require('path');
const dangerousStyleValue = require('./dangerousStyleValue');
const hyphenateStyleName = require('./hyphenateStyleName');


const styleNameCache = {};
const processStyleName = function(styleName) {
  if (styleNameCache.hasOwnProperty(styleName)) {
    return styleNameCache[styleName];
  }
  const result = hyphenateStyleName(styleName);
  styleNameCache[styleName] = result;
  return result;
};

/**
 * 
 * @param {*} styles
 * @returns {string}
 */
function createMarkupForStyles(styles) {
  let serialized = '';
  let delimiter = '';
  for (const styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }
    const styleValue = styles[styleName];
    if (styleValue != null) {
      serialized += delimiter + processStyleName(styleName) + ':';
      serialized += dangerousStyleValue(
        styleName,
        styleValue,
      );

      delimiter = ';';
    }
  }
  return serialized || null;
}

function dirty() {
  global.createElement = function(type, props) {
    const { children, className, style, ...rest } = props;
    let klass = '';
    if (className) {
      klass = ` class="${className}"`;
    }
    let styleStr = '';
    if (style != null) {
      styleStr = ` style="${createMarkupForStyles(style)}"`;
    }
    let restStr = '';
    if (rest != null) {
      const keys = Object.keys(rest);
      if (keys.length) {
        restStr = ` ${keys.map(key => `${key}="${rest[key]}"`).join(' ')}`;
      }
    }
    return `<${type}${klass}${styleStr}${restStr}>${children.join('')}</${type}>`
  }
}

function render(tempaltePath, props) {
  const appPath = path.resolve(path.join(tempaltePath, '.result', 'App.js'));
  const app = require(appPath);
  return app(props);
}

module.exports = {
  dirty,
  render,
}

