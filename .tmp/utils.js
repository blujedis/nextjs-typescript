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