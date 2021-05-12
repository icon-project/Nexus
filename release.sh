#!/usr/bin/env bash

#
# https://gist.github.com/jonsuh/3c89c004888dfc7352be
# ----------------------------------
# Colors
# ----------------------------------
NO_COLOR='\033[0m'
B_GREEN='\033[1;32m'
B_RED='\033[1;31m'

function info() {
  printf "${B_GREEN}${@:1}${NO_COLOR}\n"
}

function error() {
  printf "${B_RED}${@:1}${NO_COLOR}\n"
  exit 1
}

# Make sure current branch is master
CUR_BRANCH=$(git branch --show-current)
if [[ "$CUR_BRANCH" != "master" ]]; then
  error 'Please navigate to the "master" branch.'
else
  git pull --rebase
fi

export GL_API_URL=https://git.baikal.io/api/v4

# terminate if GL_TOKEN does not exist
if [ -z "$GL_TOKEN" ]; then
  error "please set GL_TOKEN or check README for more detail."
fi

RCMD="lerna version"

info "Exec release command: $RCMD"
$RCMD
