#!/usr/bin/env node

'use strict';

const meow = require('meow');
const foo = require('./');

const cli = meow(`
  Usage
    $ anki-apkg-export "<name>" "<glob>" "<delimeter>"
`);

if (cli.input.length < 3) {
  cli.showHelp();
  process.exit(1);
}

const name = process.argv[2];
const dir = process.argv[3];
const delimeter = process.argv[4];

const AnkiExport = require('anki-apkg-export').default;
const fs = require('fs');
const path = require('path');

const apkg = new AnkiExport(name);
const globby = require('globby');
const expandHomeDir = require('expand-home-dir');

const files = globby.sync(expandHomeDir(dir));

if (files.length === 0) {
  console.log(`Nothing found for "${dir}" glob`);
  process.exit(0);
}

const allLines = files.reduce((total, file) => {
  console.log(`Processing ${file}`);
  const files = processFile(file, apkg.addCard.bind(apkg), delimeter);
  console.log(`${files.length} lines processed`);

  return total.concat(files);
}, []);

console.log(`${allLines.length} words were processed`);

const zip = apkg.save();
const dest = `./${name}.apkg`;

fs.writeFileSync(dest, zip, 'binary');
console.log(`Package has been generated: ${path.resolve(dest)}`);

function processFile(file, fn, delimeter) {
  const lines = fs.readFileSync(file, 'utf-8').split('\n');

  return lines
    .map(line => {
      if (line[0] === '#' || line.length === 0) {
        return;
      }

      const data = line.split(delimeter);

      if (data.length === 1) {
        throw new Error(`"${line}" should contain delimeter "${delimeter}"`);
      }

      fn(data[0], data[1]);
      return line;
    })
    .filter(_ => !!_);
};
