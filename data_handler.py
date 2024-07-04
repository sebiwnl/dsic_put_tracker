import json
import os
import uuid

DATA_FILE = 'data.json'


def read_data(user=None):
    
    if not os.path.exists(DATA_FILE):
        return {"putts": [], "notes": ""}
    with open(DATA_FILE, 'r') as file:
        return json.load(file)


def write_data(data):
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)

def delete_entry(entry_id):
    data = read_data()
    data['putts'] = [entry for entry in data['putts'] if entry['id'] != entry_id]
    write_data(data)
    return


def add_putt(putt_data):
    data = read_data()
    putt_data['id'] = str(uuid.uuid4())
    data['putts'].append(putt_data)
    write_data(data)
    return

def write_putts(data):
    data = read_data()
    data['putts'] = data
    write_data(data)

def read_notes():
    if not os.path.exists(DATA_FILE):
        return {"notes": ""}
    with open(DATA_FILE, 'r') as file:
        return json.load(file)

def write_notes(notes):
    data = read_data()
    data['notes'] = notes
    write_data(data)
