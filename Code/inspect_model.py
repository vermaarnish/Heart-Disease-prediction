import pickle
import numpy as np

try:
    with open('random-forest-model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("Model type:", type(model))
    print("Model parameters:", model.get_params())
    print("Number of estimators (trees):", len(model.estimators_))
    print("Number of features:", model.n_features_in_)
    if hasattr(model, 'feature_names_in_'):
        print("Feature names:", model.feature_names_in_)
except Exception as e:
    print("Error loading model:", e)
