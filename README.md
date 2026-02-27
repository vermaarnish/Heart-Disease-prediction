# Heart-Disease-prediction
❤️ Heart Disease Prediction using Machine Learning  A supervised Machine Learning system designed to predict the presence and stage of heart disease using clinical parameters. This project integrates data preprocessing, feature engineering, model optimization, and web-based deployment using Flask.


📌 Project Overview

Heart disease is one of the leading causes of death globally. Early detection using non-invasive clinical features can significantly improve patient outcomes.

This project:

Utilizes multiple UCI heart disease datasets (Cleveland, Hungary, Switzerland, VA)

Applies supervised learning techniques

Implements Random Forest for final prediction

Deploys the model through a Flask web interface

Final model achieved ~85% maximum accuracy across multiple validation splits.

🧠 Machine Learning Pipeline

The system follows a structured ML workflow:

Data Collection
Integrated multiple heart disease datasets.
Data Preprocessing
Missing value imputation (median)
Feature selection
Normalization (MinMaxScaler)
Removal of redundant attributes
Exploratory Data Analysis
Correlation matrix analysis
Feature importance analysis
Handling Class Imbalance
Oversampling / Undersampling techniques
Model Training
Logistic Regression
SVM
Decision Tree
Random Forest (Final Model)
Model Evaluation
Accuracy
Precision
Recall
F1 Score
Binary accuracy
Deployment

🏥 Input Features Used
Age
Gender
Chest Pain Type (cp)
Resting Blood Pressur
Cholesterol
Fasting Blood Sugar
Rest ECG
Maximum Heart Rate Achieved
Exercise Induced Angina
Target Output:
0 → No Heart Disease
1–4 → Stage of Heart Disease

📚 References
UCI Heart Disease Dataset
Random Forest Algorithm (Breiman, 2001)
Scikit-learn Documentation

