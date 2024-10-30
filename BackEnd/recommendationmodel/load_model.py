import pandas as pd
import numpy as np
import pickle
import json
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient

class RecommendationModel:
    def __init__(self, properties_df):
        self.properties_df = properties_df
        self.encoder = OneHotEncoder(handle_unknown='ignore')
        self._prepare_data()

    def _prepare_data(self):
        # Fit the encoder on the relevant columns
        self.encoder.fit(self.properties_df[['category', 'location']])

        # Create combined features DataFrame for the properties
        combined_categories = self.encoder.transform(self.properties_df[['category', 'location']]).toarray()
        numerical_features = self.properties_df[['rentPrice', 'bedrooms', 'bathrooms', 'propertySize']].values
        self.combined_df = np.concatenate([numerical_features, combined_categories], axis=1)

    def recommend_properties(self, user_preferences, top_n=5):
        # Default values based on the properties DataFrame
        defaults = {
            'rentPrice': self.properties_df['rentPrice'].mean(),
            'bedrooms': self.properties_df['bedrooms'].median() if self.properties_df['bedrooms'].notnull().any() else 0,
            'bathrooms': self.properties_df['bathrooms'].median() if self.properties_df['bathrooms'].notnull().any() else 0,
            'propertySize': self.properties_df['propertySize'].mean(),
            'category': self.properties_df['category'].mode()[0],
            'location': self.properties_df['location'].mode()[0]
        }

        # Fill missing preferences with defaults
        for key, value in defaults.items():
            user_preferences.setdefault(key, value)

        # Adjusting the bedrooms input
        if user_preferences['bedrooms'] == "10_or_more":
            user_preferences['bedrooms'] = 10  # Set to a numerical value
        else:
            user_preferences['bedrooms'] = int(user_preferences['bedrooms']) if user_preferences['bedrooms'].isdigit() else 0
        
        # Adjusting the bathrooms input
        if user_preferences['bathrooms'] == "6_or_more":
            user_preferences['bathrooms'] = 6  # Set to a numerical value
        else:
            user_preferences['bathrooms'] = int(user_preferences['bathrooms']) if user_preferences['bathrooms'].isdigit() else 0

        # Create a DataFrame for user preferences with the same columns as combined_df
        user_data = {
            'rentPrice': user_preferences.get('minRentPrice', 0) + 
                         (user_preferences.get('maxRentPrice', 0) - user_preferences.get('minRentPrice', 0)) / 2,
            'bedrooms': user_preferences['bedrooms'],
            'bathrooms': user_preferences['bathrooms'],
            'propertySize': user_preferences.get('minPropertySize', 0) + 
                            (user_preferences.get('maxPropertySize', 0) - user_preferences.get('minPropertySize', 0)) / 2,
            'category': user_preferences.get('category', defaults['category']),
            'location': user_preferences.get('location', defaults['location'])
        }

        user_preferences_df = pd.DataFrame([user_data])
        
        # One-hot encode categorical features in user preferences
        user_categorical = self.encoder.transform(user_preferences_df[['category', 'location']]).toarray()

        # Combine numerical features with encoded categorical features
        user_numerical = user_preferences_df[['rentPrice', 'bedrooms', 'bathrooms', 'propertySize']].values
        user_combined_features = np.concatenate([user_numerical, user_categorical], axis=1)

        # Compute cosine similarity between user preferences and all properties
        user_similarity = cosine_similarity(user_combined_features, self.combined_df)
        
        # Get top N similar properties
        similar_indices = user_similarity.argsort()[0][-top_n:][::-1]
        recommended_properties = self.properties_df.iloc[similar_indices]

        # Return only the property IDs
        return recommended_properties['_id'].tolist()  # Ensure '_id' matches your data structure

def load_model(model_path):
    with open(model_path, 'rb') as model_file:
        model = pickle.load(model_file)
    return model

def load_properties_from_db(mongo_uri, db_name, collection_name):
    client = MongoClient(mongo_uri)
    db = client[db_name]
    collection = db[collection_name]
    
    properties = list(collection.find())
    return pd.DataFrame(properties)

if __name__ == "__main__":
    # Load properties data from MongoDB
    mongo_uri = 'mongodb+srv://elsa:elsa@cluster0.4pnu7wx.mongodb.net/'  # Replace with your MongoDB connection string
    db_name = 'test'  # Replace with your database name
    collection_name = 'properties'  # Replace with your collection name

    properties_df = load_properties_from_db(mongo_uri, db_name, collection_name)

    # Load the saved model
    model_path = 'recommendation_model.pkl'
    model = load_model(model_path)

    # Update the properties DataFrame in the model
    model.properties_df = properties_df

    # Example user preferences for making a recommendation
    user_input_preferences = {
        "propertyType": "Residential",
        "category": "House, Flat, Lower Portion, Upper Portion, Room, Farm House, Guest House, Annexe, Basement",
        "minRentPrice": 1500,
        "maxRentPrice": 7000,
        "bedrooms": "10_or_more",  # This will be converted to 10
        "bathrooms": "6_or_more",  # This will be converted to 6
        "minPropertySize": 2,
        "maxPropertySize": 5,
        "location": "H4HQ+7PH, Korang Town, Islamabad, Rawalpindi, Punjab, Pakistan",
        "longitude": 73.139385,
        "latitude": 33.5782,
        "distance": 5
    }

    # Get recommendations
    recommended_property_ids = model.recommend_properties(user_input_preferences, top_n=5)
    print("Recommended Property IDs:", recommended_property_ids)
