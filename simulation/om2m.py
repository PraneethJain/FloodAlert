import requests
import json
from rich import print
from time import sleep

ip = "192.168.63.201"
name = "Demo"

headers = {
    'X-M2M-Origin': 'admin:admin',
    'Content-type': 'application/json'}
while True:
    sleep(2)
    res1 = [eval(x['con']) for x in eval(requests.get(
        f"http://{ip}:5089/~/in-cse/in-name/{name}/Datas/Values?rcn=4", headers=headers).text)["m2m:cnt"]["m2m:cin"]]

    res2 = [x['con']for x in eval(requests.get(
        f"http://{ip}:5089/~/in-cse/in-name/{name}/Datas2/Values?rcn=4", headers=headers).text)["m2m:cnt"]["m2m:cin"]]

    res3 = [eval(x['con']) for x in eval(requests.get(
        f"http://{ip}:5089/~/in-cse/in-name/{name}/Datas3/Values?rcn=4", headers=headers).text)["m2m:cnt"]["m2m:cin"]]

    to_write = {"Demo": {"datas": res1, "datas2": res2, "datas3": res3}}
    print(to_write)

    with open("./demo.json", "w") as f:
        json.dump(to_write, f)
