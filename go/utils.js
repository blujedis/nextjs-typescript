const { ensureDirSync, copy: copyAsync, existsSync, remove: removeAsync, readFile: readFileAsync, writeFile: writeFileAsync } = require('fs-extra');
const { spawn } = require('child_process');
const { rejects } = require('assert');
const { join } = require('path');
const { EOL } = require('os');
const CWD = process.cwd();

function noop() { };

function copy(from, to, options) {
  // create own promise here to maintain
  // same implementation as what child proc will return.
  return new Promise((res, rej) => {
    copyAsync(from, to, options, (err) => {
      if (err)
        return rej(err)
      res({ code: 0 });
    });
  });
}

function readFile(path) {
  return new Promise((res, rej) => {
    readFileAsync(path, (err, data) => {
      if (err)
        return rej(err);
      res(data.toString());
    });
  });
}

function writeFile(path, data) {
  return new Promise((res, rej) => {
    writeFileAsync(path, data, (err) => {
      if (err)
        return rej(err);
      res({ code: 0 });
    });
  });
}

function remove(dir) {
  return new Promise((res, rej) => {
    removeAsync(dir, (err) => {
      if (err)
        return rej(err);
      res({ code: 0 });
    });
  });
}

function run(cmd, args = [], options) {
  options = {
    stdio: 'inherit',
    ...options
  };
  return new Promise((res, rej) => {
    const proc = spawn(cmd, args, options);
    proc.on('error', (err) => rej(err));
    proc.on('exit', (code, signal) => res({ code, signal }));
  });
}

function setAddonEnabled(config, name, save = false) {
  config.enabled = config.enabled.filter(k => k !== name);
  config.enabled.push(name);
  if (!save)
    return config;
  return saveConfig(config);
}

function setAddonDisabled(config, name, save = false) {
  config.enabled = config.enabled.filter(k => k !== name);
  if (!save)
    return config;
  return saveConfig(config);
}

function saveJSON(path, config) {
  return new Promise((res, rej) => {
    writeFileAsync(path, typeof config === 'string' ? config : JSON.stringify(config, null, 2), (err) => {
      if (err)
        return rejects(err);
      res({ code: 0 })
    });
  });
}

function saveConfig(config) {
  return saveJSON(join(__dirname, 'config.json'), config);
}

function savePackage(config) {
  return saveJSON(join(CWD, 'package.json'), config);
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'undefined')
    return [value];
  return [];
}

function splitFile(str, char = EOL) {
  return (str || '').split(EOL);
}

function fileImportRemove(linesOrString, data, asArray = true) {
  const lines = typeof linesOrString === 'string' ? splitFile(linesOrString) : linesOrString;
  const newLines = [];
  for (const line of lines) {
    if (line !== data)
      newLines.push(line)
  }
  if (!asArray)
    return newLines.join(EOL);
  return newLines;
}

// inserts at first empty line.
function fileImportAdd(linesOrString, data) {
  let lines = typeof linesOrString === 'string' ? splitFile(linesOrString) : linesOrString;
  const newLines = [];
  lines = fileImportRemove(lines, data);
  let inserted = false;
  for (const line of lines) {
    if (!inserted && /^\s*$/.test(line)) { // loose check for blank line.
      newLines.push(data);
      newLines.push(line);
      inserted = true;
    }
    else {
      newLines.push(line);
    }
  }
  return newLines.join(EOL);
}

function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  ensureArray,
  saveJSON,
  saveConfig,
  savePackage,
  run,
  copy,
  remove,
  existsSync,
  setAddonEnabled,
  setAddonDisabled,
  capitalize,
  readFile,
  writeFile,
  splitFile,
  fileImportAdd,
  fileImportRemove
};
