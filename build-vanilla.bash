#!/bin/bash

set -xe

if ! test -d "$1" ; then
    asp checkout "$1"
fi
cd "$1/repos/"
cd $(/bin/ls -D | python -c "import sys;split=[line for line in sys.stdin.read().split() if line.split('-')[0] in {'core', 'community', 'extra'}];print(split[0])")

setconf PKGBUILD arch '(riscv64 x86_64)'
extra-riscv64-build -- -d "$(realpath ./cachedir):/var/cache/pacman/pkg/"


