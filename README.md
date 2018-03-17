# r2retdec
[![Twitter Follow](https://img.shields.io/twitter/follow/securisec.svg?style=social&label=Follow)]()
[![Analytics](https://ga-beacon.appspot.com/UA-113966566-4/r2wiki/readme)](https://github.com/securisec/r2wiki)
![repo size](https://img.shields.io/github/repo-size/securisec/r2retdec.svg)


r2retdec is a bridge in between radare2 and retdec and decompiles individual functions. It also provides summary of strings, xrefs and calls for a function.

## Installation
Install from r2pm.
```
r2pm init
r2pm update
r2pm -i r2retdec
```
Create a file in $HOME call .r2retdec and put the path to retdec-decompiler.sh in it.

## Uninstallation
```
r2pm -u r2retdec
```

## Usage
```
usage: $dec [-h] [-p] [-t FILE]

r2retdec help

Optional arguments:
  -h, --help  Show this help message and exit.
  -t TMP      Set temp file for decompiled code
  -p          Print dicompilation to stdout

Invoke from inside r2 shell with $dec
```

Press `h` in visual mode for visual mode help

## Dependencies
Needs a locally compiled retdec available from https://github.com/avast-tl/retdec

## Tested with
- Node version 8 and 9
- Ubuntu 16.04 Vagrant

## Supported architectures
(32b only): Intel x86, ARM, MIPS, PIC32, and PowerPC.