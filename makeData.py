from pathlib import Path

import argparse
import json
import sys


def getPath(path):
    json = {}
    for i in Path.iterdir(path):
        if Path.is_dir(i):
            json[i.name] = getPath(i)
        else:
            with open(i, 'r', encoding='UTF-8') as f:
                json[i.name] = f.read()
    return json
if __name__ == "__main__":
    parser = argparse.ArgumentParser(formatter_class = argparse.RawDescriptionHelpFormatter,
                                 description = '把文件夹转换为Json.\nConvert a real folder to json.',
                                 epilog = 'By Tabmax'
                                 )
    parser.add_argument('path',
                    metavar = 'Folder-path',
                    type = str,
                    help='The path of folder what you want to convert'
                    )
    parser.add_argument('--save',
                    dest = 'savePath',
                    help='The save path of the json file'
                    )

    args = parser.parse_args()


    path = Path(args.path)
    json = json.dumps(getPath(path), indent=4)


    if args.savePath != None:
        with open(args.savePath, 'w') as f:
            f.write(json)
    else:
        print(json)
