from flask import Flask,jsonify,request
import util
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="*")

@app.route('/')
def home():
    return 'Hello!'

@app.route('/get_location')
def get_location():
    responce = jsonify( {
        'location' : util.get_location()
        })
    responce.headers.add('Access-Control-Allow-Origin','*')
    return responce

@app.route('/predict' , methods = ['post'])
def predict_home_price():
    data = request.json
    sqft = float(data['sqft'])
    bhk = int(data['bhk'])
    bath = int(data['bath'])
    locat = data['location']
    
    response = jsonify({
        'estimated': util.predict(sqft,bhk,bath,locat)
    })
    
    response.headers.add('Access-Control-Allow-Origin','*')
    
    return response
 
