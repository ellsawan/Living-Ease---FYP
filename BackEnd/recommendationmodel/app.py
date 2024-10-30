from flask import Flask, request, jsonify
from flask_cors import CORS  # Importing CORS to allow cross-origin requests
import pickle
import pandas as pd
import numpy as np
from load_model import RecommendationModel  # Import your RecommendationModel class

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the pickled model
with open('recommendation_model.pkl', 'rb') as file:
    model = pickle.load(file)

@app.route('/')
def home():
    return "Welcome to the Property Recommendation API!"

@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        # Get user preferences from the request body
        user_input_preferences = request.json

        # Use your loaded model to get recommendations
        recommended_property_ids = model.recommend_properties(user_input_preferences)

        # Return the recommended property IDs in JSON format
        return jsonify({'recommendedPropertyIds': recommended_property_ids}), 200
    except Exception as e:
        # Return error message in JSON format if an exception occurs
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=8080)  # Set debug to False in production
