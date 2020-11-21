const { copy, writeFile, existsSync, unlink } = require('fs-extra');
const { spawn } = require('child_process');
const { rejects } = require('assert');
const { join } = require('path');
const CWD = process.cwd();

function noop() { };

function copyDirectory(from, to, options) {
  // create own promise here to maintain
  // same implementation as what child proc will return.
  return new Promise((res, rej) => {
    copy(from, to, options, (err) => {
      if (err)
        return rej(err)
      res({ code: 0 });
    });
  });
}

function unlinkDirectory(dir) {
  return new Promise((res, rej) => {
    unlink(dir, (err) => {
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
    writeFile(path, typeof config === 'string' ? config : JSON.stringify(config, null, 2), (err) => {
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

module.exports = {
  ensureArray,
  saveJSON,
  saveConfig,
  savePackage,
  run,
  copyFile: copyDirectory,
  copyDirectory,
  unlinkFile: unlinkDirectory,
  unlinkDirectory,
  existsSync,
  setAddonEnabled,
  setAddonDisabled
};
