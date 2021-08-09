Get contract ABI:

```bash
docker exec -it btp_moonbeam bash
cd ../contracts/solidity/bsh/build/contracts
cat BSHPeriphery.json | jq -r .abi

# then save output to BSHPeriphery.abi.json
```
