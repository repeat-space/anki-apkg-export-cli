#!/usr/bin/env node

'use strict';

const meow = require('meow');
const AnkiExport = require('anki-apkg-export').default;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const cli = meow(`
  Usage
    $ anki-apkg-export "<glob-filter>"

  Options
    --groups Split files by empty lines

  Examples
    $ anki-apkg-export **/*.txt
    $ anki-apkg-export **/*.txt --groups
`);

if (cli.input.length === 0) {
  cli.showHelp();
  process.exit(1);
}

const files = cli.input;
const delimiter = ' - ';

const log = console.log.bind(console);

if (files.length === 0) {
  log('Nothing found');
  process.exit(1);
}

files
  .forEach(file => {
    const name = path.basename(file);
    const apkg = new AnkiExport(name);

    log(`${chalk.green(name)}: Processing ${file}`);

    const files = processFile(file, apkg.addCard.bind(apkg), delimiter, cli.flags.groups);
    log(`${chalk.green(name)}: ${files.length} cards have been processed`);

    const zip = apkg.save();
    const dest = `./${name}.apkg`;

    fs.writeFileSync(dest, zip, 'binary');
    log(`${chalk.green(name)}: Package has been generated: ${path.resolve(dest)}`);
  });

function processFile(file, fn, delimiter, splitByGroups) {
  const lines = fs.readFileSync(file, 'utf-8').split(splitByGroups ? /\n\n/g : '\n');

  return lines
    .map(line => {
      if (line[0] === '#' || line.length === 0) {
        return;
      }

      let front = '';
      let back = '';

      if (splitByGroups) {
        line
          .trim()
          .split('\n')
          .forEach((line, i) => {
            const data = line.split(delimiter);

            if (data.length === 1) {
              throw new Error(`"${line}" should contain delimiter "${delimiter}"`);
            }

            front = front + (i === 1 ? '<br><br>' : (i > 1 ? '<br>' : '')) + data[0];
            back = back + (i === 1 ? '<br><br>' : (i > 1 ? '<br>' : '')) + (i === 0 ? data[1] : line);
          });
      } else {
        const data = line.split(delimiter);

        if (data.length === 1) {
          throw new Error(`"${line}" should contain delimiter "${delimiter}"`);
        }

        front = data[0];
        back = data[1];
      }

      fn(front, back);
      return line;
    })
    .filter(_ => !!_);
}
