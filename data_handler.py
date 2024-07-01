import json
import os

DATA_FILE = 'data.json'


def read_data(user=None):
    
    if not os.path.exists(DATA_FILE):
        return {"putts": []}
    with open(DATA_FILE, 'r') as file:
        return json.load(file)


def write_data(data):
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)


def add_putt(putt_data):
    data = read_data()
    data['putts'].append(putt_data)
    write_data(data)
    return
