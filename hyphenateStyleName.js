/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const uppercasePattern = /([A-Z])/g;
const msPattern = /^ms-/;

function hyphenateStyleName(name) {
  return name
    .replace(uppercasePattern, '-$1')
    .toLowerCase()
    .replace(msPattern, '-ms-');
}

module.exports = hyphenateStyleName;
