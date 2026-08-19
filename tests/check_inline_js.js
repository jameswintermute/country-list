'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('src/index.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(source => source.trim());

assert(scripts.length > 0, 'no inline JavaScript blocks found');
scripts.forEach((source, index) => {
  new vm.Script(source, {filename: `src/index.html:inline-${index + 1}`});
});
console.log(`inline JavaScript syntax: ok (${scripts.length} block${scripts.length === 1 ? '' : 's'})`);
