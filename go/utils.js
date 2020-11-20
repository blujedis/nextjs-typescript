const { createWriteStream, createReadStream, ensureDirSync } = require('fs-extra');
const colors = require('ansi-colors');
const { dirname } = require('path');

function noop() { };

function copyFile(from, to, done = noop) {
  const readable = createReadStream(from, { encoding: 'utf8', highWaterMark: 16 * 1024 });
  const writer = createWriter(to);
  readable.on('error', (err) => {
    console.error(colors.redBright(`\n${err.stack}\n`));
    process.exit();
  });
  writer
    .on('error', (err) => {
      console.error(colors.redBright(`\n${err.stack}\n`));
      process.exit();
    })
    .on('close', done); //callback on finished.
  readable.pipe(writer);
}

function createWriter(to, options = {}) {
  ensureDirSync(dirname(to)); // ensure the directory exists.
  return createWriteStream(to, options);
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'undefined')
    return [value];
  return [];
}

module.exports = {
  ensureArray,
  copyFile,
  createWriter
};