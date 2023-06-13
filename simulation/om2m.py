import requests
import json
from rich import print
from time import sleep

headers = {
    'X-M2M-Origin': 'admin:admin',
    'Content-type': 'application/json'}
while True:
  sleep(2)
  res1 = [eval(x['con']) for x in eval(requests.get(
      "http://172.20.10.13:5089/~/in-cse/in-name/Flood3/Datas/Values?rcn=4", headers=headers).text)["m2m:cnt"]["m2m:cin"]]

  res2 = [x['con']for x in eval(requests.get(
      "http://172.20.10.13:5089/~/in-cse/in-name/Flood3/Datas2/Values?rcn=4", headers=headers).text)["m2m:cnt"]["m2m:cin"]]

  res3 = [eval(x['con']) for x in eval(requests.get(
      "http://172.20.10.13:5089/~/in-cse/in-name/Flood3/Datas3/Values?rcn=4", headers=headers).text)["m2m:cnt"]["m2m:cin"]]

  to_write = {"Demo": {"datas": res1, "datas2": res2, "datas3": res3}}


  with open("./demo.json", "w") as f:
      json.dump(to_write, f)