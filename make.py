from pathlib import Path
from makeData import getPath
import json

data = getPath(Path("./data"))
jsonStr = json.dumps(
    data,
    indent=4,
    sort_keys=True,
    ensure_ascii=False
)

with open("data.json", "w", encoding="utf-8") as f:
    f.write(jsonStr)

print(jsonStr)
