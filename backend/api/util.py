import json
import pickle
import numpy as np
from pathlib import Path

def predict(sqft,bath,bhk,location):
    retrieve_location()
    try:
        loc_idx = _whole_data.index(location.lower())
    except:
        loc_idx = -1
    Y = np.array([])
    Y = np.zeros(len(_whole_data))
    Y[0]=sqft
    Y[1]=bath
    Y[2]=bhk
    if loc_idx >= 0:
        Y[loc_idx] = 1
    pred = _model.predict([Y])[0] * 100000
    
    formatted = str(pred)
    idx = formatted.index(".")+3
    
    print(idx)
    
    return formatted[:idx]
    


def get_location():
    retrieve_location()
    return _location_data

def retrieve_location():
    global _whole_data
    global _location_data
    global _model
    
    # Get the directory of the current file
    current_dir = Path(__file__).parent

    # Construct the full path
    model_path = current_dir / 'artifact' / 'Columns.json'
    House_path = current_dir / 'artifact' / 'House_Price_Prediction'
    
    with open(model_path) as f:
        _whole_data=json.load(f)['data_columns']
        _location_data = _whole_data[3:]

    with open (House_path,'rb') as f:
        _model = pickle.load(f)

if __name__ == ('__main__'):
    None