Clean up server and redeploy testnet

lscpu

top -o %MEM

df -H

docker container ls -s.

docker image ls

docker system df -v

sudo du -sh /var/lib/docker

https://forums.docker.com/t/docker-no-space-left-on-device/69205/3

https://jhooq.com/docker-error-no-space-left/

## Clean up

docker stop btp_moonbeam btp_icon gochain moonbeam redis postgres-admin-btp postgres-btp polkadot-ui
docker container ls

sudo -i find /var/lib/docker/ -type f -name "*.log" -exec ls -lh {} \;
sudo -i find /var/lib/docker/ -type f -name "*.log" -delete

# Delete orphaned volumes

docker volume ls -qf dangling=true
docker volume rm $(docker volume ls -qf dangling=true)

docker start btp_moonbeam btp_icon gochain moonbeam redis postgres-admin-btp postgres-btp polkadot-ui

docker system prune --all --volumes

sudo apt-get autoclean
sudo apt-get autoremove
