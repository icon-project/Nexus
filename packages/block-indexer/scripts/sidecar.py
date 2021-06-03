import requests
import json

# curl http://127.0.0.1:8080/blocks/91

url = 'http://127.0.0.1:8080/blocks/91'
response = requests.get(url)

if response.ok:
  block_info = json.loads(response.text)
  print(block_info)
