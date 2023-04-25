from pathlib import Path
from makeData import getPath
import json

_bin = getPath(Path(".\command"))
_bin["name"] = "bin"

with open("data.json", encoding="utf-8") as f:
    data = json.load(f)
    data["bin"] = _bin

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data,
              f,
              indent=4,
              sort_keys=True,
              ensure_ascii=False
              )

print(data)
