import { ErrorMessage, Formik, Form, Field } from "formik"
import React, { useState, useEffect } from "react";
import "./EstimatePriceForm.css"; 
// import {baesic} from './API/api'
import axios from "axios";

const submitFormToAPI = async (formData) => {
    try {
      const retapi = await axios.post('https://house-price-prediction-o2uh.onrender.com/predict',formData)
      return retapi.data.estimated
    } catch (error) {
      console.log(error)
      return null
    }
};

function validation(value){
  let error = {
  }
  
  if (!value.sqft) {
    error.sqft = 'Area is required'; 
  }if (value.sqft <= 0) {
    error.sqft = 'Area must be a positive number'; 
  }

  if(!value.location)
    error.location = 'Location is required'

  return error
}

export default function Price(){
    const [locations, setLocations] = useState([]);
    const [apiResult, setApiResult] = useState(""); 

    useEffect(() => {
        const fetchLocations = async () => {
        try {
            
            const locationData = await axios.get('https://house-price-prediction-o2uh.onrender.com/get_location');
            
            setLocations(locationData.data.location);
        } catch (error) {
            console.error("Error loading locations", error);
        }
    };

    fetchLocations();
  }, []);

  return (
    <div className="form-container">
      <h2>Estimate Price</h2>
      <Formik
        initialValues={{
          sqft: "other",
          bhk: 2,
          bath: 2,
          location: ""
        }}
        validate={validation}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          // Call the API and store the result in apiResult
          const response = await submitFormToAPI(values);
          setApiResult(response);  // Store API response
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>

            {/* Area Input */}
            <div className="form-group">
              <label htmlFor="area">Area (Square Feet)</label>
              <Field
                type="number"
                id="area"
                name="sqft"
                placeholder="Enter area"
              />
              <ErrorMessage 
              name="sqft" 
              component="div"
              className="alert alert-warning"/>
            </div>

            {/* BHK Selection */}
            <div className="form-group">
              <label>BHK</label>
              <div className="button-group">
                {[1, 2, 3, 4, 5].map((number) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => setFieldValue("bhk", number)}
                    className={values.bhk === number ? "selected" : ""}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            {/* Bath Selection */}
            <div className="form-group">
              <label>Bath</label>
              <div className="button-group">
                {[1, 2, 3, 4, 5].map((number) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => setFieldValue("bath", number)}
                    className={values.bath === number ? "selected" : ""}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Dropdown */}
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <Field as="select" name="location" id="location">
                <option value="">Select Location</option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </Field>
              <ErrorMessage 
              name="location" 
              component="div"
              className="alert alert-warning"/>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Submitting..." : "Estimate Price"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Output Area (Yellow Box) */}
      <div className="output-box">
        {apiResult && <p>Estimated Price: {apiResult}</p>}
      </div>
    </div>
  );
}
