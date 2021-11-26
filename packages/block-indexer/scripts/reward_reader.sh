#!/bin/bash

# chmod +x reward_reader.sh

cd /home/ubuntu/deploy/btp-dashboard/packages/block-indexer/scripts
node reward_reader.js > reward_reader.log
