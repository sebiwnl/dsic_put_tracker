from flask import Flask, render_template, request, jsonify
import json
import logging
from data_handler import add_putt, read_data


app = Flask(__name__)
logging.basicConfig(level=logging.INFO)



@app.route('/')
def home():
    return render_template('home.html')

@app.route('/putt')
def putt():
    return render_template('putt.html', payload=json.dumps(read_data()))

@app.route('/add_putt', methods=['POST'])
def putt_post():
    rec_data = request.json
    logging.info(f'Received data: {rec_data}')
    add_putt(rec_data)
    logging.info('Data added successfully')
    return jsonify({'message': 'Data received successfully'})



    

    


 

if __name__ == '__main__':
    app.run(debug=True)