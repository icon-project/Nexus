Clean up server and redeploy testnet

df -H

Filesystem      Size  Used Avail Use% Mounted on
udev             17G     0   17G   0% /dev
tmpfs           3.3G  1.3M  3.3G   1% /run
/dev/nvme0n1p1   52G   42G   11G  81% /
tmpfs            17G     0   17G   0% /dev/shm
tmpfs           5.3M     0  5.3M   0% /run/lock
tmpfs            17G     0   17G   0% /sys/fs/cgroup
/dev/loop0       27M   27M     0 100% /snap/amazon-ssm-agent/4046
/dev/loop1       35M   35M     0 100% /snap/amazon-ssm-agent/3552
/dev/loop2       59M   59M     0 100% /snap/core18/2074
/dev/loop3       34M   34M     0 100% /snap/snapd/12704
/dev/loop4       34M   34M     0 100% /snap/snapd/12398
tmpfs           3.3G     0  3.3G   0% /run/user/1000
overlay          52G   42G   11G  81% /var/lib/docker/overlay2/442bfff84da10ffa8625ccbc4c7654d7fb96eb3d1ec7f7bdf35bc769ee2e3652/merged
overlay          52G   42G   11G  81% /var/lib/docker/overlay2/8305e31c6a7407dd6f4615c268ebc194b7bfd1736dce9d1b3ee78c3fb8c35d1b/merged
overlay          52G   42G   11G  81% /var/lib/docker/overlay2/9fdec6e99e198c152440460dd8a13d0be083dab5b6c9720d04be6b1b80ffd0cc/merged
overlay          52G   42G   11G  81% /var/lib/docker/overlay2/1f63b359df049f3c2b1eb995151fd20eed44fcecac4ea470ec4e1b253544db9e/merged
/dev/loop6       59M   59M     0 100% /snap/core18/2128
overlay          52G   42G   11G  81% /var/lib/docker/overlay2/586087d14169050390953b330852ea80f4d0f3e4c6faac3e1b359e93f34f4603/merged

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
