import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load data
heart_df = pd.read_csv("heart_cleveland_upload.csv")
heart_df = heart_df.rename(columns={'condition':'target'})

x = heart_df.drop(columns='target')
y = heart_df.target

# Train-test split
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.25, random_state=42)

# Case 1: Scaled
scaler = StandardScaler()
x_train_scaled = scaler.fit_transform(x_train)
x_test_scaled = scaler.transform(x_test) # Note: the original script incorrectly did fit_transform on test set!

model_scaled = RandomForestClassifier(n_estimators=20, random_state=42)
model_scaled.fit(x_train_scaled, y_train)
y_pred_scaled = model_scaled.predict(x_test_scaled)
acc_scaled = accuracy_score(y_test, y_pred_scaled)

# Case 2: Unscaled (Raw Data)
model_raw = RandomForestClassifier(n_estimators=20, random_state=42)
model_raw.fit(x_train, y_train)
y_pred_raw = model_raw.predict(x_test)
acc_raw = accuracy_score(y_test, y_pred_raw)

print(f"Accuracy with Scaling: {acc_scaled*100:.2f}%")
print(f"Accuracy without Scaling: {acc_raw*100:.2f}%")
