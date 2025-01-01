from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS if accessing from other domains

# Load the trained model
model = joblib.load("random_forest_model.pkl")

@app.route('/')
def home():
    return "Welcome to the Random Forest Model API!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.json
        # Convert input to numpy array
        input_data = np.array(data["features"]).reshape(1, -1)
        # Make prediction
        prediction = model.predict(input_data)
        # Return prediction as JSON
        return jsonify({"prediction": int(prediction[0])})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
