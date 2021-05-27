#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

# to update go to https://github.com/MetaMask/metamask-extension/releases and hardcode different URL
METAMASK_URL="https://github.com/MetaMask/metamask-extension/releases/download/v8.1.3/metamask-chrome-8.1.3.zip"

OUT_DIR="../bundle"

if [ ! -d $OUT_DIR ]; then
    mkdir -p $OUT_DIR
fi

wget -qO- $METAMASK_URL | bsdtar -xvf- -C $OUT_DIR
