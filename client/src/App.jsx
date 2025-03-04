// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Main tab state: 'finance' or 'diet'
  const [selectedTab, setSelectedTab] = useState('finance');

  // Finance sub-tab state: 'automation', 'emergency', 'debt', 'sidehustle'
  const [financeSubTab, setFinanceSubTab] = useState('automation');

  // ----- Finance Automation (50/30/20) States -----
  const [income, setIncome] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [tips, setTips] = useState([]);

  const RECOMMENDATIONS = [
    'Automate Savings: Schedule an automatic transfer to your savings or investment account each month.',
    'Track Expenses: Use a budgeting app (e.g., Seedly, YNAB) to keep tabs on your daily spending.',
    'Review Subscriptions: Cancel any unused subscriptions or memberships to free up extra cash. (e.g, Netflix, Disney+, ChatGPT Plus, etc.)',
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

  // ----- Dynamic Color Schemes -----
  const colorSchemes = [
    { background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', textColor: '#000' }, // Warm Sunset
    { background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', textColor: '#000' }, // Soft Blue Sky
    { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', textColor: '#000' }, // Vibrant Coral Pink
    { background: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', textColor: '#000' }, // Pastel Peach Glow

    // ✨ PROFESSIONAL THEMES
    { background: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)', textColor: '#000' }, // Deep Teal Blue
    { background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', textColor: '#000' }, // Dark Grey Elegance
    { background: 'linear-gradient(135deg, #485563 0%, #29323c 100%)', textColor: '#000' }, // Professional Grey-Blue
    { background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', textColor: '#000' }, // Executive Navy
    { background: 'linear-gradient(135deg, #b8c6db 0%, #f5f7fa 100%)', textColor: '#000' }, // Soft Corporate
    { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', textColor: '#000' }, // Modern Violet-Blue
    { background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', textColor: '#000' }, // Business Blue Spectrum
    { background: 'linear-gradient(135deg, #485563 0%, #29323c 100%)', textColor: '#000' }, // Charcoal Sophistication

    // 🏆 FINANCE-INSPIRED COLORS
    { background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', textColor: '#000' }, // Wealth Green
    { background: 'linear-gradient(135deg, #b92b27 0%, #1565c0 100%)', textColor: '#000' }, // Financial Security Mix
    { background: 'linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)', textColor: '#000' }, // Golden Prosperity
    { background: 'linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%)', textColor: '#000' }, // Energetic Growth

    // 🌊 CALMING & ENGAGING
    { background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', textColor: '#000' }, // Calm Oceanic Blue
    { background: 'linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)', textColor: '#000' }, // Cool Aqua Glow
    { background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)', textColor: '#000' }, // Gentle Pink Fade
    { background: 'linear-gradient(135deg, #f4d03f 0%, #16a085 100%)', textColor: '#000' }, // Calm Mint-Gold Balance

    // 🔥 BOLD & ATTENTION-GRABBING
    { background: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)', textColor: '#000' }, // Passionate Red-Pink
    { background: 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)', textColor: '#000' }, // Intense Orange Energy
    { background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', textColor: '#000' }  // Bold Deep Blue
  ];


  const [currentScheme, setCurrentScheme] = useState(colorSchemes[0]);
  useEffect(() => {
    const randomScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    setCurrentScheme(randomScheme);
  }, [selectedTab, financeSubTab]);

  // ----- 50/30/20 Automation Handler -----
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

  // ----- Emergency Fund Calculator -----
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [targetMonths, setTargetMonths] = useState('3');
  const [currentFund, setCurrentFund] = useState('');
  const [emergencyResult, setEmergencyResult] = useState(null);

  const handleEmergencyFundCalc = async () => {
    if (!monthlyExpenses || isNaN(monthlyExpenses) || !targetMonths || isNaN(targetMonths) || !currentFund || isNaN(currentFund)) {
      alert("Please enter valid numbers for monthly expenses, target months, and current fund.");
      return;
    }
    try {
      const response = await fetch('/api/emergency-fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyExpenses,
          targetMonths,
          currentFund
        })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Error calculating emergency fund.");
      } else {
        setEmergencyResult(data);
      }
    } catch (err) {
      alert("Error connecting to the server.");
    }
  };

  // ----- Debt Management -----
  const [debts, setDebts] = useState([]);
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtBalance, setNewDebtBalance] = useState('');
  const [newDebtInterest, setNewDebtInterest] = useState('');
  const [newDebtMinPayment, setNewDebtMinPayment] = useState('');
  const [debtResults, setDebtResults] = useState(null);

  const addDebt = () => {
    const balance = parseFloat(newDebtBalance);
    const interest = parseFloat(newDebtInterest);
    const minPayment = parseFloat(newDebtMinPayment);
    if (!newDebtName || isNaN(balance) || isNaN(interest) || isNaN(minPayment)) {
      alert("Please enter valid debt information.");
      return;
    }
    const newDebt = {
      id: Date.now(),
      name: newDebtName,
      balance,
      interest,
      minPayment
    };
    setDebts([...debts, newDebt]);
    setNewDebtName('');
    setNewDebtBalance('');
    setNewDebtInterest('');
    setNewDebtMinPayment('');
  };

  const handleDebtManagement = async () => {
    if (debts.length === 0) {
      alert("Please add at least one debt.");
      return;
    }
    try {
      const response = await fetch('/api/debt-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debts })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Error calculating debt strategies.");
      } else {
        setDebtResults(data);
      }
    } catch (err) {
      alert("Error connecting to the server.");
    }
  };

  // ----- Income Diversification & Side Hustle Suggestions -----
  const [skills, setSkills] = useState('');
  const [timeAvailability, setTimeAvailability] = useState('');
  const [sideHustleSuggestions, setSideHustleSuggestions] = useState([]);

  const handleSideHustle = async () => {
    if (!skills || !timeAvailability) {
      alert("Please enter your skills and time availability.");
      return;
    }
    try {
      const response = await fetch('/api/side-hustle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, timeAvailability })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Error fetching side hustle suggestions.");
      } else {
        setSideHustleSuggestions(data.suggestions);
      }
    } catch (err) {
      alert("Error connecting to the server.");
    }
  };

  // ----- Diet / BMI (Existing) -----
  const [dietSubTab, setDietSubTab] = useState(null);
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
      color = "#e74c3c";
      tip = "Consider consulting a healthcare provider and increasing your calorie intake.";
    } else if (bmi < 18.5) {
      classification = "Underweight";
      color = "#e67e22";
      tip = "Consider a balanced diet with more calorie-dense foods and consult a nutritionist.";
    } else if (bmi < 25) {
      classification = "Healthy";
      color = "#2ecc71";
      tip = "Your BMI is healthy! Maintain your current lifestyle.";
    } else if (bmi < 30) {
      classification = "Overweight";
      color = "#e67e22";
      tip = "Consider regular exercise and a balanced diet to improve your health.";
    } else {
      classification = "Obese";
      color = "#e74c3c";
      tip = "It's advisable to consult a healthcare provider for a structured weight management plan.";
    }
    setBmiResult({ value: bmi, classification, color, tip });
  };

  return (
    <div
      className="App"
      style={{ background: currentScheme.background, color: currentScheme.textColor, minHeight: '100vh' }}
    >
      {/* Top-Level Navigation Tabs */}
      <div className="tabs">
        <div className={`tab ${selectedTab === 'finance' ? 'active' : ''}`} onClick={() => { setSelectedTab('finance'); setDietSubTab(null); setFinanceSubTab('automation'); }}>
          Finance
        </div>
        <div className={`tab ${selectedTab === 'diet' ? 'active' : ''}`} onClick={() => { setSelectedTab('diet'); setDietSubTab(null); }}>
          Diet / BMI
        </div>
      </div>

      {/* ===== Finance Tab with Sub-Tabs ===== */}
      {selectedTab === 'finance' && (
        <div className="content-container">
          {/* Finance Sub-Tab Navigation */}
          <div className="finance-tabs">
            <div className={`finance-tab ${financeSubTab === 'automation' ? 'active' : ''}`} onClick={() => setFinanceSubTab('automation')}>
              Overview
            </div>
            <div className={`finance-tab ${financeSubTab === 'emergency' ? 'active' : ''}`} onClick={() => setFinanceSubTab('emergency')}>
              Emergency Fund
            </div>
            <div className={`finance-tab ${financeSubTab === 'debt' ? 'active' : ''}`} onClick={() => setFinanceSubTab('debt')}>
              Debt Management
            </div>
            <div className={`finance-tab ${financeSubTab === 'sidehustle' ? 'active' : ''}`} onClick={() => setFinanceSubTab('sidehustle')}>
              Side Hustle
            </div>
          </div>

          {/* ----- Sub-Tab: Overview (50/30/20 Automation) ----- */}
          {financeSubTab === 'automation' && (
            <>
              <h1>Finance Automation App</h1>
              <p>Enter your monthly income to see a detailed breakdown based on the 50/30/20 rule.</p>
              <input type="text" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="Enter your monthly income" />
              <button onClick={handleCalculate}>Calculate</button>
              {error && <p className="error">{error}</p>}
              {result && (
                <div className="result">
                  <h2>Results</h2>
                  <p><strong>Total Income:</strong> ${result.income.toFixed(2)}</p>
                  <div className="section">
                    <h3>Needs (50%): ${result.breakdown.needs.toFixed(2)}</h3>
                    <p>{result.details.needs.description}</p>
                    <ul>
                      <li><strong>Housing (HDB Mortgage, Rental, Maintenance):</strong> ${result.details.needs.breakdown.housing.toFixed(2)}</li>
                      <li><strong>Utilities (Electricity, Water, Internet):</strong> ${result.details.needs.breakdown.utilities.toFixed(2)}</li>
                      <li><strong>Groceries (NTUC, Sheng Siong, etc.):</strong> ${result.details.needs.breakdown.groceries.toFixed(2)}</li>
                      <li><strong>Transportation (Bus, MRT, Taxis):</strong> ${result.details.needs.breakdown.transportation.toFixed(2)}</li>
                      <li><strong>Healthcare & Insurance (MediShield, Life Insurance):</strong> ${result.details.needs.breakdown.healthcareInsurance.toFixed(2)}</li>
                    </ul>
                  </div>
                  <div className="section">
                    <h3>Wants (30%): ${result.breakdown.wants.toFixed(2)}</h3>
                    <p>{result.details.wants.description}</p>
                    <ul>
                      <li><strong>Dining Out (Hawker Centres, Restaurants, Cafes):</strong> ${result.details.wants.breakdown.diningOut.toFixed(2)}</li>
                      <li><strong>Entertainment & Leisure (Movies, Karaoke):</strong> ${result.details.wants.breakdown.entertainmentLeisure.toFixed(2)}</li>
                      <li><strong>Shopping & Miscellaneous (Retail, Personal Care):</strong> ${result.details.wants.breakdown.shoppingMisc.toFixed(2)}</li>
                    </ul>
                  </div>
                  <div className="section">
                    <h3>Savings (20%): ${result.breakdown.savings.toFixed(2)}</h3>
                    <p>{result.details.savings.description}</p>
                    <ul>
                      <li><strong>Emergency Fund:</strong> ${result.details.savings.breakdown.emergencyFund.toFixed(2)}</li>
                      <li><strong>Retirement (CPF):</strong> ${result.details.savings.breakdown.retirementCPF.toFixed(2)}</li>
                      <li><strong>Investing (Stocks, REITs, etc.):</strong> ${result.details.savings.breakdown.investing.toFixed(2)}</li>
                      <li><strong>Personal Development (Courses, Workshops):</strong> ${result.details.savings.breakdown.personalDevelopment.toFixed(2)}</li>
                    </ul>
                  </div>
                  {tips.length > 0 && (
                    <div className="recommendations">
                      <h3>Recommendations</h3>
                      <p>Here are some tips to help you manage your finances more effectively:</p>
                      <ul>
                        {tips.map((tip, index) => (<li key={index}>{tip}</li>))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ----- Sub-Tab: Emergency Fund ----- */}
          {financeSubTab === 'emergency' && (
            <div className="section">
              <h2>Emergency Fund Calculator</h2>
              <p>Calculate your ideal emergency fund based on your monthly expenses and desired coverage.</p>
              <input type="text" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} placeholder="Monthly Expenses (e.g., 2000)" />
              <select value={targetMonths} onChange={(e) => setTargetMonths(e.target.value)}>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
              </select>
              <input type="text" value={currentFund} onChange={(e) => setCurrentFund(e.target.value)} placeholder="Current Emergency Fund Savings" />
              <button onClick={handleEmergencyFundCalc}>Calculate Emergency Fund</button>
              {emergencyResult && (
                <div className="emergency-result">
                  <p>Ideal Emergency Fund: ${emergencyResult.ideal.toFixed(2)}</p>
                  <p>Progress: {emergencyResult.progress.toFixed(0)}%</p>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${emergencyResult.progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----- Sub-Tab: Debt Management ----- */}
          {financeSubTab === 'debt' && (
            <div className="section">
              <h2>Debt Management & Payoff Strategies</h2>
              <p>Enter your debts to view payoff strategies.</p>
              <input type="text" value={newDebtName} onChange={(e) => setNewDebtName(e.target.value)} placeholder="Debt Name (e.g., Credit Card)" />
              <input type="text" value={newDebtBalance} onChange={(e) => setNewDebtBalance(e.target.value)} placeholder="Balance" />
              <input type="text" value={newDebtInterest} onChange={(e) => setNewDebtInterest(e.target.value)} placeholder="Interest Rate (%)" />
              <input type="text" value={newDebtMinPayment} onChange={(e) => setNewDebtMinPayment(e.target.value)} placeholder="Minimum Payment" />
              <button onClick={addDebt}>Add Debt</button>
              <button onClick={handleDebtManagement}>Calculate Debt Strategies</button>
              {debtResults && (
                <div className="debt-results">
                  <h4>Debt Snowball (Lowest Balance First)</h4>
                  <ul>
                    {debtResults.snowball.map(debt => (
                      <li key={debt.id}>
                        {debt.name}: ${parseFloat(debt.balance).toFixed(2)} at {debt.interest}% interest, min payment ${parseFloat(debt.minPayment).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <h4>Debt Avalanche (Highest Interest First)</h4>
                  <ul>
                    {debtResults.avalanche.map(debt => (
                      <li key={debt.id}>
                        {debt.name}: ${parseFloat(debt.balance).toFixed(2)} at {debt.interest}% interest, min payment ${parseFloat(debt.minPayment).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ----- Sub-Tab: Side Hustle ----- */}
          {financeSubTab === 'sidehustle' && (
            <div className="section">
              <h2>Income Diversification & Side Hustle Suggestions</h2>
              <p>Enter your skills and available time (hours per week) to receive personalized side hustle suggestions.</p>
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Your Skills (e.g., writing, design)" />
              <input type="text" value={timeAvailability} onChange={(e) => setTimeAvailability(e.target.value)} placeholder="Time Available per Week (hours)" />
              <button onClick={handleSideHustle}>Get Side Hustle Suggestions</button>
              {sideHustleSuggestions.length > 0 && (
                <div className="side-hustle-results">
                  <ul>
                    {sideHustleSuggestions.map((suggestion, index) => (<li key={index}>{suggestion}</li>))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== Diet / BMI Tab ===== */}
      {selectedTab === 'diet' && (
        <div className="content-container">
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

          {dietSubTab === 'BMI' && (
            <div className="bmi-container">
              <h2>BMI Calculator</h2>
              <input type="text" value={bmiWeight} onChange={(e) => setBmiWeight(e.target.value)} placeholder="Weight (kg)" />
              <input type="text" value={bmiHeight} onChange={(e) => setBmiHeight(e.target.value)} placeholder="Height (cm)" />
              <button onClick={handleBMICalc}>Calculate BMI</button>
              {bmiResult && (
                <div className="bmi-result" style={{ backgroundColor: bmiResult.color, padding: "10px", borderRadius: "8px", marginTop: "10px", color: "#fff" }}>
                  <p>Your BMI is {bmiResult.value.toFixed(1)}</p>
                  <p><strong>{bmiResult.classification}</strong></p>
                  <p>{bmiResult.tip}</p>
                </div>
              )}
              <button onClick={() => { setDietSubTab(null); setBmiResult(null); setBmiWeight(''); setBmiHeight(''); }}>
                Back
              </button>
            </div>
          )}

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
