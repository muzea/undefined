const template = require('./render');

template.dirty();

console.log(template.render('./template', { name: 'MuYu' }));
