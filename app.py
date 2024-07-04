from flask import Flask, render_template, request, jsonify, send_file
import json
import logging
from data_handler import add_putt, read_data, delete_entry, read_notes, write_notes
import os


app = Flask(__name__)
logging.basicConfig(level=logging.INFO)



@app.route('/')
def home():
    return render_template('home.html')

@app.route('/putt')
def putt():
    return render_template('putt.html', payload=json.dumps(read_data()), notes = json.dumps(read_notes()))

@app.route('/add_putt', methods=['POST'])
def putt_post():
    rec_data = request.json
    add_putt(rec_data)
    return json.dumps(read_data())

@app.route('/delete_putt', methods=['POST'])
def delete_entry_route():
    entry_id = request.json.get('id')
    delete_entry(entry_id)
    return json.dumps(read_data())

@app.route("/update_notes", methods=['POST'])
def update_notes():
    rec_data = request.json["notes"]
    app.logger.info(rec_data)
    write_notes(rec_data)
    return jsonify({"status": "success"})

@app.route('/download')
def download():
    return send_file('data.json', as_attachment=True)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        file = request.files['file']
        if file.filename == '':
            return "No file selected"

        save_path = './data.json'  # Specify the path where you want to save the file

        # Check if data.json exists, delete it if it does
        if os.path.exists(save_path):
            os.remove(save_path)

        # Save the uploaded file to specified path
        file.save(save_path)
        
        app.logger.info(f"File saved successfully to {save_path}")
        
        return jsonify({"message": "File uploaded successfully"})
    
    except Exception as e:
        app.logger.error(f"Error uploading file: {str(e)}")
        return jsonify({"error": "Failed to upload file"}), 500




    

    


 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
