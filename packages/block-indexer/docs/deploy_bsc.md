- No goloop branch v0.9.7 (command doesn't work with tag).
- Are they different, OpenJDK 11 vs. JDK11? Our current testnet requires JDK11
- Is NodeJS 14.x LTS fine? Requiring the latest NodeJS version might affect our web apps and other JS tools.
- I see this guide creates its own ICON network, can it be configured to integrate to our existing local ICON network?
- It needs to be included in the guide (https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-915049744)
- It needs to be included in the guide (https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-915100350)
- These verifications should be included in the guide (https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916697472)
- Is it fixed? (https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916713424)


===
before make btp
go mod download github.com/ethereum/go-ethereum

Build Binance Smart Chain docker
Secret here is "Perlia0"

once everything starts, the icon-bsc node will take some time to provision, once all the containers are up, you can get the keystores from the devnet/work folder.
bsc.ks.json - for Binancesmartchain

btp-icon container might take sometime, it usually takes around 15 minutes, but certainly not an hour or so.
To check if the btp-icon container is started, you can check the logs to see if "provision is now complete" is present.

"please try to manually stop and start the "btp-icon" container from the docker dashboard. and see if it tries to connect to goloop then.

// to fix some icon docker issues https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916589551
Yes, I resolved this problem by remove folder work and run docker-compose up -d again, so now I'm stuck with the token guide

verify JSON files https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916687302
Could you also please verify if other folders "bmc"& "bmv" under /contracts/solidity has build folder?
also if you can confirm if "Funding BSH" logs present at the end of the provision

generate missing files https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916700815

- clean up
You can use these commands to clean

docker-compose down
rm -rf work/*
docker rmi -f icon-bsc_btp-icon

And please keep an eye on the btp-icon logs, cause untill "Provision is now complete" there should be no errors
