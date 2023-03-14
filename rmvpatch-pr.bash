#!/bin/bash

set -e

# from https://gist.github.com/devongovett/10399980
pull_request() {
  to_branch=$1
  if [ -z $to_branch ]; then
    to_branch="master"
  fi
  
  # try the upstream branch if possible, otherwise origin will do
  upstream=$(git config --get remote.upstream.url)
  origin=$(git config --get remote.origin.url)
  if [ -z $upstream ]; then
    upstream=$origin
  fi
  
  to_user=$(echo $upstream | sed -e 's/.*[\/:]\([^/]*\)\/[^/]*$/\1/')
  from_user=$(echo $origin | sed -e 's/.*[\/:]\([^/]*\)\/[^/]*$/\1/')
  repo=$(basename `git rev-parse --show-toplevel`)
  from_branch=$(git rev-parse --abbrev-ref HEAD)
  xdg-open "https://github.com/$to_user/$repo/pull/new/$to_user:$to_branch...$from_user:$from_branch"
}

if [ "$#" -ne 1 ]; then
    echo "Illegal number of parameters"
    exit 1
fi

git switch -c "$1" || git checkout "$1"
rm -rf "$1"
git add "$1"
git commit -m "rmvpatch: $1

This package can be built without patch.

Automated by https://github.com/kxxt/archriscv-scripts"

git push
pull_request
git co master
