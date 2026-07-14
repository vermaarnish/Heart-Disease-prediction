# ❤️ Heart Disease Prediction

A machine learning web application that predicts the presence of heart disease from clinical parameters. The project covers the full pipeline — data preprocessing, model training/comparison, and deployment through a Flask web app — using the UCI Cleveland Heart Disease dataset.

🚀 **Live Interactive Demo:** [https://vermaarnish.github.io/Heart-Disease-prediction/](https://vermaarnish.github.io/Heart-Disease-prediction/)

**Live demo model accuracy:** ~88.75% (Random Forest)

---

## 📌 Overview

Heart disease remains one of the leading causes of death worldwide. Early, non-invasive risk detection from routine clinical measurements can help flag high-risk patients sooner.

This project:

- Trains and compares multiple supervised ML classifiers on the UCI Cleveland Heart Disease dataset
- Selects **Random Forest** as the final production model
- Serves predictions through a simple Flask web interface where a user enters clinical values and gets an instant result

---

## 🧠 Machine Learning Pipeline

| Stage | Details |
|---|---|
| **Data** | UCI Cleveland Heart Disease dataset (`heart_cleveland_upload.csv`, 297 records, 13 features) |
| **Preprocessing** | Feature/target split, `StandardScaler` normalization, train/test split (75/25) |
| **Models compared** | Logistic Regression, SVM, KNN, Decision Tree, Random Forest, Naive Bayes, LDA/QDA, AdaBoost, Gradient Boosting, XGBoost, Neural Network |
| **Final model** | Random Forest Classifier (`n_estimators=20`) |
| **Evaluation** | Accuracy, precision, recall, F1-score, confusion matrix |
| **Deployment** | Flask web app, model serialized with `pickle` |

Each algorithm has its own training script under `Code/Models/`, so results are easy to reproduce and compare side by side.

---

## 🏥 Input Features

| Feature | Description |
|---|---|
| `age` | Age in years |
| `sex` | Sex (1 = male, 0 = female) |
| `cp` | Chest pain type |
| `trestbps` | Resting blood pressure (mm Hg) |
| `chol` | Serum cholesterol (mg/dl) |
| `fbs` | Fasting blood sugar > 120 mg/dl (1 = true, 0 = false) |
| `restecg` | Resting electrocardiographic results |
| `thalach` | Maximum heart rate achieved |
| `exang` | Exercise-induced angina (1 = yes, 0 = no) |
| `oldpeak` | ST depression induced by exercise relative to rest |
| `slope` | Slope of the peak exercise ST segment |
| `ca` | Number of major vessels colored by fluoroscopy (0–3) |
| `thal` | Thalassemia status |

**Target (`condition`):**
- `0` → No heart disease
- `1` → Heart disease present

---

## 📂 Project Structure

```
Heart-Disease-prediction/
├── Code/
│   ├── app.py                     # Flask application entry point
│   ├── random-forest.py           # Trains the final Random Forest model
│   ├── random-forest-model.pkl    # Serialized trained model
│   ├── heart_cleveland_upload.csv # Dataset
│   ├── requirements.txt           # Python dependencies
│   ├── Models/                    # Training scripts for all compared algorithms
│   │   ├── logistic-regression.py
│   │   ├── svm.py
│   │   ├── knn.py
│   │   ├── decision-tree.py
│   │   ├── random-forest.py
│   │   ├── naive-bayes.py
│   │   ├── lda.py / qda.py
│   │   ├── ada-boost.py
│   │   ├── gradient-boost.py
│   │   ├── xg-boost.py
│   │   ├── neural-network.py
│   │   └── Pkl/                   # Saved models per algorithm
│   ├── templates/                 # HTML templates (main.html, result.html)
│   └── static/                    # CSS (style.css)
├── Heart Disease-final.pptx       # Project presentation
├── Report 23-24.pdf               # Detailed project report
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.8+
- pip

### Installation

```bash
# Clone the repository
git clone https://github.com/vermaarnish/Heart-Disease-prediction.git
cd Heart-Disease-prediction/Code

# (Recommended) create a virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Run the web app

```bash
python app.py
```

The app will start on `http://127.0.0.1:5000/`. Open it in your browser, fill in the clinical parameters, and submit to get a prediction.

### Retrain the model (optional)

```bash
python random-forest.py
```

This regenerates `random-forest-model.pkl` from `heart_cleveland_upload.csv`. Scripts for the other algorithms are available in `Code/Models/` for comparison.

---

## 🛠️ Tech Stack

- **Language:** Python
- **ML/Data:** scikit-learn, pandas, NumPy
- **Web Framework:** Flask
- **Frontend:** HTML, CSS
- **Model Serialization:** Pickle

---

## 📚 References

- UCI Heart Disease Dataset (Cleveland subset)
- Breiman, L. (2001). *Random Forests*. Machine Learning, 45(1), 5–32.
- [Scikit-learn Documentation](https://scikit-learn.org/stable/documentation.html)

---

## 📄 Additional Resources

- `Report 23-24.pdf` — full project report
- `Heart Disease-final.pptx` — project presentation slides

---

## ⚠️ Disclaimer

This tool is built for educational and demonstrative purposes only. It is **not** a substitute for professional medical diagnosis or advice. Always consult a qualified healthcare provider for medical concerns.


