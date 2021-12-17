#!/bin/bash
# chmod +x reward_reader.sh

cd $DASHBOARD_HOME/btp-dashboard/packages/block-indexer/scripts
node reward_reader.js > reward_reader.log
