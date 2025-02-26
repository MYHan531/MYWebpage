// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Main tab state: 'finance' or 'diet'
  const [selectedTab, setSelectedTab] = useState('finance');

  // Finance tab states (unchanged)
  const [income, setIncome] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [tips, setTips] = useState([]);

  const RECOMMENDATIONS = [
    'Automate Savings: Schedule an automatic transfer to your savings or investment account each month.',
    'Track Expenses: Use a budgeting app (e.g., Seedly, YNAB) to keep tabs on your daily spending.',
    'Review Subscriptions: Cancel any unused subscriptions or memberships to free up extra cash.',
    'Pay High-Interest Debts First: Focus on credit cards or personal loans before other expenses.',
    'Leverage CPF & Government Schemes: Top up your CPF or explore local grants for housing and healthcare.',
    'Build an Emergency Fund: Aim for 3-6 months of expenses in a liquid savings account.',
    'Invest Regularly: Consider dollar-cost averaging into ETFs or REITs for long-term growth.',
    'Plan for Retirement Early: Explore SRS or CPF top-ups to enhance your retirement nest egg.'
  ];

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Color schemes
  const colorSchemes = [
    {
      background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      textColor: '#333'
    },
    {
      background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      textColor: '#333'
    },
    {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      textColor: '#333'
    },
    {
      background: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
      textColor: '#444'
    }
  ];

  const [currentScheme, setCurrentScheme] = useState(colorSchemes[0]);

  useEffect(() => {
    const randomScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    setCurrentScheme(randomScheme);
  }, [selectedTab]);

  // Finance calculation handler
  const handleCalculate = async () => {
    setError(null);
    setResult(null);
    setTips([]);

    if (!income || isNaN(income)) {
      setError('Please enter a valid number for income.');
      return;
    }

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ income })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'An error occurred.');
      } else {
        setResult(data);
        const shuffled = shuffleArray([...RECOMMENDATIONS]);
        setTips(shuffled.slice(0, 5));
      }
    } catch (err) {
      setError('Error connecting to the server.');
    }
  };

  // --- Diet/BMI Page State and Handlers ---
  // Sub-tab state for Diet/BMI (null = selection screen, "BMI" or "Diet")
  const [dietSubTab, setDietSubTab] = useState(null);

  // BMI calculator state
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  const handleBMICalc = () => {
    const weight = parseFloat(bmiWeight);
    const height = parseFloat(bmiHeight);
    if (!weight || !height) {
      alert("Please enter valid numbers for weight and height.");
      return;
    }
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    let classification = "";
    let color = "";
    let tip = "";

    if (bmi < 16) {
      classification = "Severely Underweight";
      color = "#e74c3c"; // red
      tip = "Consider consulting a healthcare provider and increasing your calorie intake.";
    } else if (bmi < 18.5) {
      classification = "Underweight";
      color = "#e67e22"; // orange
      tip = "Consider a balanced diet with more calorie-dense foods and consult a nutritionist.";
    } else if (bmi < 25) {
      classification = "Healthy";
      color = "#2ecc71"; // green
      tip = "Your BMI is healthy! Maintain your current lifestyle.";
    } else if (bmi < 30) {
      classification = "Overweight";
      color = "#e67e22"; // orange
      tip = "Consider regular exercise and a balanced diet to improve your health.";
    } else {
      classification = "Obese";
      color = "#e74c3c"; // red
      tip = "It's advisable to consult a healthcare provider for a structured weight management plan.";
    }
    setBmiResult({ value: bmi, classification, color, tip });
  };

  return (
    <div
      className="App"
      style={{
        background: currentScheme.background,
        color: currentScheme.textColor,
        minHeight: '100vh'
      }}
    >
      {/* Top navigation tabs */}
      <div className="tabs">
        <div
          className={`tab ${selectedTab === 'finance' ? 'active' : ''}`}
          onClick={() => { setSelectedTab('finance'); setDietSubTab(null); }}
        >
          Finance
        </div>
        <div
          className={`tab ${selectedTab === 'diet' ? 'active' : ''}`}
          onClick={() => { setSelectedTab('diet'); setDietSubTab(null); }}
        >
          Diet / BMI
        </div>
      </div>

      {/* Finance Automation Tab */}
      {selectedTab === 'finance' && (
        <div className="content-container">
          <h1>Finance Automation App</h1>
          <p>Enter your monthly income to see a detailed breakdown based on the 50/30/20 rule.</p>
          <input
            type="text"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your monthly income"
          />
          <button onClick={handleCalculate}>Calculate</button>
          {error && <p className="error">{error}</p>}
          {result && (
            <div className="result">
              <h2>Results</h2>
              <p>
                <strong>Total Income:</strong> ${result.income.toFixed(2)}
              </p>
              {/* Needs Section */}
              <div className="section">
                <h3>Needs (50%): ${result.breakdown.needs.toFixed(2)}</h3>
                <p>{result.details.needs.description}</p>
                <ul>
                  <li>
                    <strong>Housing (HDB Mortgage, Rental, Maintenance):</strong> $
                    {result.details.needs.breakdown.housing.toFixed(2)}
                  </li>
                  <li>
                    <strong>Utilities (Electricity, Water, Internet):</strong> $
                    {result.details.needs.breakdown.utilities.toFixed(2)}
                  </li>
                  <li>
                    <strong>Groceries (NTUC, Sheng Siong, etc.):</strong> $
                    {result.details.needs.breakdown.groceries.toFixed(2)}
                  </li>
                  <li>
                    <strong>Transportation (Bus, MRT, Taxis):</strong> $
                    {result.details.needs.breakdown.transportation.toFixed(2)}
                  </li>
                  <li>
                    <strong>Healthcare & Insurance (MediShield, Life Insurance):</strong> $
                    {result.details.needs.breakdown.healthcareInsurance.toFixed(2)}
                  </li>
                </ul>
              </div>
              {/* Wants Section */}
              <div className="section">
                <h3>Wants (30%): ${result.breakdown.wants.toFixed(2)}</h3>
                <p>{result.details.wants.description}</p>
                <ul>
                  <li>
                    <strong>Dining Out (Hawker Centres, Restaurants, Cafes):</strong> $
                    {result.details.wants.breakdown.diningOut.toFixed(2)}
                  </li>
                  <li>
                    <strong>Entertainment & Leisure (Movies, Karaoke):</strong> $
                    {result.details.wants.breakdown.entertainmentLeisure.toFixed(2)}
                  </li>
                  <li>
                    <strong>Shopping & Miscellaneous (Retail, Personal Care):</strong> $
                    {result.details.wants.breakdown.shoppingMisc.toFixed(2)}
                  </li>
                </ul>
              </div>
              {/* Savings Section */}
              <div className="section">
                <h3>Savings (20%): ${result.breakdown.savings.toFixed(2)}</h3>
                <p>{result.details.savings.description}</p>
                <ul>
                  <li>
                    <strong>Emergency Fund:</strong> $
                    {result.details.savings.breakdown.emergencyFund.toFixed(2)}
                  </li>
                  <li>
                    <strong>Retirement (CPF):</strong> $
                    {result.details.savings.breakdown.retirementCPF.toFixed(2)}
                  </li>
                  <li>
                    <strong>Investing (Stocks, REITs, etc.):</strong> $
                    {result.details.savings.breakdown.investing.toFixed(2)}
                  </li>
                  <li>
                    <strong>Personal Development (Courses, Workshops):</strong> $
                    {result.details.savings.breakdown.personalDevelopment.toFixed(2)}
                  </li>
                </ul>
              </div>
              {/* Dynamic Recommendations */}
              {tips.length > 0 && (
                <div className="recommendations">
                  <h3>Recommendations</h3>
                  <p>Here are some tips to help you manage your finances more effectively:</p>
                  <ul>
                    {tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Diet / BMI Tab */}
      {selectedTab === 'diet' && (
        <div className="content-container">
          {/* Diet/BMI Selection Screen */}
          {dietSubTab === null && (
            <div className="diet-selection">
              <h1>Diet / BMI Platform</h1>
              <p>Please select an option:</p>
              <div className="diet-buttons">
                <button onClick={() => setDietSubTab('BMI')}>BMI Calculator</button>
                <button onClick={() => setDietSubTab('Diet')}>Diet Planner (Coming Soon)</button>
              </div>
            </div>
          )}

          {/* BMI Calculator */}
          {dietSubTab === 'BMI' && (
            <div className="bmi-container">
              <h2>BMI Calculator</h2>
              <input
                type="text"
                value={bmiWeight}
                onChange={(e) => setBmiWeight(e.target.value)}
                placeholder="Weight (kg)"
              />
              <input
                type="text"
                value={bmiHeight}
                onChange={(e) => setBmiHeight(e.target.value)}
                placeholder="Height (cm)"
              />
              <button onClick={handleBMICalc}>Calculate BMI</button>
              {bmiResult && (
                <div
                  className="bmi-result"
                  style={{
                    backgroundColor: bmiResult.color,
                    padding: "10px",
                    borderRadius: "8px",
                    marginTop: "10px",
                    color: "#fff"
                  }}
                >
                  <p>Your BMI is {bmiResult.value.toFixed(1)}</p>
                  <p>
                    <strong>{bmiResult.classification}</strong>
                  </p>
                  <p>{bmiResult.tip}</p>
                </div>
              )}
              <button
                onClick={() => {
                  setDietSubTab(null);
                  setBmiResult(null);
                  setBmiWeight('');
                  setBmiHeight('');
                }}
              >
                Back
              </button>
            </div>
          )}

          {/* Diet Planner Placeholder */}
          {dietSubTab === 'Diet' && (
            <div className="diet-container">
              <h2>Diet Planner</h2>
              <p>This feature is coming soon. Stay tuned for healthy eating tips and meal planning tools!</p>
              <button onClick={() => setDietSubTab(null)}>Back</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
