import pickle
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Load data and fit scaler to get training parameters
heart_df = pd.read_csv("heart_cleveland_upload.csv")
heart_df = heart_df.rename(columns={'condition': 'target'})

x = heart_df.drop(columns='target')
y = heart_df.target

# Split using same parameters as random-forest.py
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.25, random_state=42)

scaler = StandardScaler()
scaler.fit(x_train)

# Load the trained model
with open('random-forest-model.pkl', 'rb') as f:
    model = pickle.load(f)

# Function to recursively serialize decision tree
def serialize_tree(tree, node_id=0):
    left = int(tree.children_left[node_id])
    right = int(tree.children_right[node_id])
    
    if left == -1 and right == -1:
        # Leaf node
        val = tree.value[node_id].tolist()
        # val is typically [[count_class_0, count_class_1]]
        return {
            "value": val[0]
        }
    else:
        # Split node
        return {
            "feature": int(tree.feature[node_id]),
            "threshold": float(tree.threshold[node_id]),
            "left": serialize_tree(tree, left),
            "right": serialize_tree(tree, right)
        }

# Serialize all trees
serialized_trees = []
for estimator in model.estimators_:
    serialized_trees.append(serialize_tree(estimator.tree_))

# Save mean and standard deviation for scaling
means = scaler.mean_.tolist()
stds = scaler.scale_.tolist()

model_data = {
    "means": means,
    "stds": stds,
    "trees": serialized_trees
}

# Verification function using the serialized trees
def predict_with_js_trees(x_scaled, model_data):
    predictions = []
    for sample in x_scaled:
        tree_preds = []
        for tree in model_data["trees"]:
            # Traverse tree
            curr = tree
            while "value" not in curr:
                feat = curr["feature"]
                thresh = curr["threshold"]
                if sample[feat] <= thresh:
                    curr = curr["left"]
                else:
                    curr = curr["right"]
            # curr is leaf, value has counts for [class_0, class_1]
            tree_preds.append(curr["value"])
        
        # Average probability across trees
        avg_probs = np.mean(tree_preds, axis=0)
        # Class with max probability
        predictions.append(int(np.argmax(avg_probs)))
    return predictions

# Verify on scaled test set
x_test_scaled = scaler.transform(x_test)
sklearn_preds = model.predict(x_test_scaled).tolist()
custom_preds = predict_with_js_trees(x_test_scaled, model_data)

mismatch = sum(1 for s, c in zip(sklearn_preds, custom_preds) if s != c)
print(f"Verification: {mismatch} mismatches out of {len(sklearn_preds)} samples.")

if mismatch == 0:
    print("SUCCESS: JSON trees model matches scikit-learn model perfectly!")
    
    # Save as JS file
    js_content = f"const modelData = {json.dumps(model_data, indent=2)};"
    with open('model_data.js', 'w') as f:
        f.write(js_content)
    print("Saved model_data.js successfully.")
else:
    print("WARNING: Predictions do not match!")
