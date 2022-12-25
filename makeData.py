from pathlib import Path
import json
import sys

def getPath(path):
    json = {
        'name': path.name,
        'data': []
    }
    for i in Path.iterdir(path):
        if Path.is_dir(i):
            json['data'].append(getPath(i))
        else:
            with open(i, 'r', encoding='UTF-8') as f:
                json['data'].append({
                    'name': i.name,
                    'data': f.read()
                })
    return json

path = Path(Path.cwd() if len(sys.argv)==1 else sys.argv[1])
json = json.dumps(getPath(path), indent=4)
if "-save" in sys.argv:
    with open(sys.argv[sys.argv.index("-save")+1], 'w') as f:
        f.write(json)
else:
    print(json)
