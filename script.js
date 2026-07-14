document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictor-form');
    const resultsCard = document.getElementById('results-card');
    const resultValue = document.getElementById('result-value');
    const resultText = document.getElementById('result-text');
    const resultDescription = document.getElementById('result-description');
    const gaugeFill = document.getElementById('gauge-fill');
    const findingsList = document.getElementById('findings-list');
    const diagnosticBox = document.getElementById('diagnostic-box');
    const resetBtn = document.getElementById('reset-btn');

    // SVG Circumference calculation
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    gaugeFill.style.strokeDasharray = circumference;
    gaugeFill.style.strokeDashoffset = circumference;

    // Handle Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve and parse values
        const inputs = {
            age: parseInt(document.getElementById('age').value),
            sex: parseInt(document.getElementById('sex').value),
            cp: parseInt(document.getElementById('cp').value),
            trestbps: parseInt(document.getElementById('trestbps').value),
            chol: parseInt(document.getElementById('chol').value),
            fbs: parseInt(document.getElementById('fbs').value),
            restecg: parseInt(document.getElementById('restecg').value),
            thalach: parseInt(document.getElementById('thalach').value),
            exang: parseInt(document.getElementById('exang').value),
            oldpeak: parseFloat(document.getElementById('oldpeak').value),
            slope: parseInt(document.getElementById('slope').value),
            ca: parseInt(document.getElementById('ca').value),
            thal: parseInt(document.getElementById('thal').value)
        };

        // Form Validation Check
        for (const [key, value] of Object.entries(inputs)) {
            if (isNaN(value)) {
                alert(`Please enter a valid value for ${key.toUpperCase()}.`);
                return;
            }
        }

        // 1. Prepare raw input array in the exact feature order:
        // age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
        const rawFeatures = [
            inputs.age, inputs.sex, inputs.cp, inputs.trestbps, inputs.chol,
            inputs.fbs, inputs.restecg, inputs.thalach, inputs.exang,
            inputs.oldpeak, inputs.slope, inputs.ca, inputs.thal
        ];

        // 2. Feature Scaling
        // scaled_val = (raw_val - mean) / std
        const scaledFeatures = rawFeatures.map((val, idx) => {
            const mean = modelData.means[idx];
            const std = modelData.stds[idx];
            return (val - mean) / std;
        });

        // 3. Random Forest Inference (traversing the 20 decision trees)
        const treeProbabilities = []; // Store P(Class 1) for each tree

        for (const tree of modelData.trees) {
            let currentNode = tree;
            
            // Loop until we reach a leaf node
            while (!currentNode.hasOwnProperty('value')) {
                const featIdx = currentNode.feature;
                const threshold = currentNode.threshold;
                const featureValue = scaledFeatures[featIdx];

                if (featureValue <= threshold) {
                    currentNode = currentNode.left;
                } else {
                    currentNode = currentNode.right;
                }
            }

            // At Leaf node: value is [count_class_0, count_class_1]
            const counts = currentNode.value;
            const sum = counts[0] + counts[1];
            const p1 = sum > 0 ? counts[1] / sum : 0; // Probability of class 1
            treeProbabilities.push(p1);
        }

        // 4. Compute average P(Class 1) across all estimators
        const averageP1 = treeProbabilities.reduce((a, b) => a + b, 0) / treeProbabilities.length;
        const riskPercentage = Math.round(averageP1 * 100);

        // 5. Update UI Gauge and Results
        displayResults(riskPercentage, inputs);
    });

    // Display Results Dashboard
    function displayResults(riskPercent, inputs) {
        // Unhide the results card
        resultsCard.style.display = 'block';

        // Animate gauge progress ring
        setTimeout(() => {
            const offset = circumference - (riskPercent / 100) * circumference;
            gaugeFill.style.strokeDashoffset = offset;
        }, 50);

        // Animate risk counter
        let startVal = 0;
        const duration = 1200; // ms
        const stepTime = 15; // ms
        const steps = duration / stepTime;
        const increment = riskPercent / steps;
        
        const counterInterval = setInterval(() => {
            startVal += increment;
            if (startVal >= riskPercent) {
                resultValue.textContent = `${riskPercent}%`;
                clearInterval(counterInterval);
            } else {
                resultValue.textContent = `${Math.round(startVal)}%`;
            }
        }, stepTime);

        // Determine Risk Category, color theme and recommendations
        let riskColor, riskClass, riskTextTitle, riskTextDesc;
        if (riskPercent < 30) {
            riskColor = 'var(--accent-green)';
            riskClass = 'low-risk';
            riskTextTitle = 'Low Risk Status';
            riskTextDesc = 'Based on the clinical parameters provided, the model predicts a low risk of cardiovascular disease. Maintain your healthy lifestyle!';
        } else if (riskPercent >= 30 && riskPercent <= 70) {
            riskColor = 'var(--accent-gold)';
            riskClass = 'moderate-risk';
            riskTextTitle = 'Moderate Risk Status';
            riskTextDesc = 'The model predicts a moderate risk. You should monitor your cardiovascular health indicators closely and consult a healthcare practitioner.';
        } else {
            riskColor = 'var(--accent-red)';
            riskClass = 'high-risk';
            riskTextTitle = 'High Risk Status';
            riskTextDesc = 'The model predicts a high risk of heart disease. We strongly recommend scheduling a thorough cardiovascular consultation with a physician.';
        }

        // Apply visual updates
        gaugeFill.style.stroke = riskColor;
        gaugeFill.style.filter = `drop-shadow(0 0 6px ${riskColor})`;
        resultValue.style.color = riskColor;
        
        diagnosticBox.className = `diagnostic-box ${riskClass}`;
        diagnosticBox.querySelector('h3').textContent = riskTextTitle;
        diagnosticBox.querySelector('p').textContent = riskTextDesc;

        // 6. Generate Clinical Findings List
        findingsList.innerHTML = '';
        const findings = [];

        // Check Serum Cholesterol (mg/dl)
        if (inputs.chol > 240) {
            findings.push({
                type: 'warning',
                text: `Elevated Serum Cholesterol level (${inputs.chol} mg/dl). Recommended levels are below 200 mg/dl.`
            });
        } else if (inputs.chol < 200) {
            findings.push({
                type: 'info',
                text: `Desirable Serum Cholesterol level (${inputs.chol} mg/dl).`
            });
        }

        // Check Resting Blood Pressure (mmHg)
        if (inputs.trestbps > 140) {
            findings.push({
                type: 'warning',
                text: `Elevated Resting Blood Pressure (${inputs.trestbps} mmHg). High blood pressure increases workload on the heart.`
            });
        } else if (inputs.trestbps < 120) {
            findings.push({
                type: 'info',
                text: `Optimal Resting Blood Pressure (${inputs.trestbps} mmHg).`
            });
        }

        // Check Max Heart Rate (bpm)
        if (inputs.thalach < 100) {
            findings.push({
                type: 'warning',
                text: `Low Maximum Heart Rate achieved during exercise (${inputs.thalach} bpm). Lower rates can limit aerobic capacity.`
            });
        }

        // Check ST Depression (oldpeak)
        if (inputs.oldpeak > 1.5) {
            findings.push({
                type: 'warning',
                text: `Significant ST Depression (${inputs.oldpeak} mm) induced by exercise, indicating potential myocardial ischemia.`
            });
        }

        // Check Major Vessels
        if (inputs.ca > 0) {
            findings.push({
                type: 'warning',
                text: `Number of major blood vessels colored by fluoroscopy is ${inputs.ca}, indicating possible arterial blockages.`
            });
        }

        // Render clinical findings
        if (findings.length === 0) {
            const li = document.createElement('li');
            li.className = 'findings-item info';
            li.innerHTML = '<span class="bullet"></span><span>All vitals check out within general normal ranges.</span>';
            findingsList.appendChild(li);
        } else {
            findings.forEach(f => {
                const li = document.createElement('li');
                li.className = `findings-item ${f.type}`;
                li.innerHTML = `<span class="bullet"></span><span>${f.text}</span>`;
                findingsList.appendChild(li);
            });
        }

        // Scroll to results card smoothly
        setTimeout(() => {
            resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // Handle Reset Button
    resetBtn.addEventListener('click', () => {
        form.reset();
        
        // Retract gauge fill
        gaugeFill.style.strokeDashoffset = circumference;
        
        // Hide results card smoothly
        resultsCard.style.animation = 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => {
            resultsCard.style.display = 'none';
            resultsCard.style.animation = 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }, 300);

        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Handle Export/Print Button
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            const dateStr = new Date().toLocaleString();
            resultsCard.setAttribute('data-print-date', dateStr);
            window.print();
        });
    }
});
