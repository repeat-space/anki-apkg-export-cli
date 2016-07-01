# anki-apkg-export-cli

[![Build Status](https://travis-ci.org/ewnd9/anki-apkg-export-cli.svg?branch=master)](https://travis-ci.org/ewnd9/anki-apkg-export-cli)

CLI for generating Anki's decks

## Install

```
$ npm install anki-apkg-export-cli -g
```

## Usage

```sh
$ anki-apkg-export

  Usage
    $ anki-apkg-export "<glob-filter>"

  Options
    --groups Split files by empty lines

  Examples
    $ anki-apkg-export **/*.txt
    $ anki-apkg-export **/*.txt --groups
```

## One line example

```sh
$ cat dict.txt

Source 1 - Translation 1
Source 2 - Translation 2

$ anki-apkg-export *.txt
```

### card 1

```txt
front:

Source 1

back:

Translation 1
```

### card 2

```txt
front:

Source 2

back:

Translation 2
```

## Groups example

```sh
$ cat dict.txt

Source 1 - Translation 1
Example 1-1 - Example Translation 1-1
Example 1-2 - Example Translation 1-2

Source 2 - Translation 2
Example 2-1 - Example Translation 2-1

$ anki-apkg-export *.txt --groups
```

### card 1:

```txt
front:

Source 1

Example 1-1
Example 1-2

back:

Translation 1

Example 1-1 - Example Translation 1-1
Example 1-2 - Example Translation 1-2
```

### card 2

```txt
front:

Source 2

Example 2-1

back:

Translation 2

Example 2-1 - Example Translation 2-1
```


## Related

- [`anki-apkg-export`](https://github.com/ewnd9/anki-apkg-export) - api
- [`anki-apkg-export-app`](http://ewnd9.com/anki-apkg-export-app/) - web app

## License

MIT © [ewnd9](http://ewnd9.com)
