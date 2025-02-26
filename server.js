// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to calculate the 50/30/20 rule with further breakdown
// Updated API endpoint to calculate the 50/30/20 rule with a detailed, Singapore-tailored breakdown
app.post('/api/calculate', (req, res) => {
  const { income } = req.body;
  if (!income || isNaN(income)) {
    return res.status(400).json({ error: 'Invalid income provided.' });
  }
  const incomeNum = parseFloat(income);

  // Main allocations
  const needsTotal = incomeNum * 0.50;
  const wantsTotal = incomeNum * 0.30;
  const savingsTotal = incomeNum * 0.20;

  // Detailed breakdown for Needs (Singapore standards)
  const needsBreakdown = {
    housing: needsTotal * 0.40,          // 40% for HDB mortgage/rental & maintenance
    utilities: needsTotal * 0.15,          // 15% for electricity, water, internet, etc.
    groceries: needsTotal * 0.20,          // 20% for daily food & market expenses
    transportation: needsTotal * 0.15,     // 15% for MRT, bus fares, taxis
    healthcareInsurance: needsTotal * 0.10 // 10% for healthcare, insurance, and related costs
  };

  // Detailed breakdown for Wants
  const wantsBreakdown = {
    diningOut: wantsTotal * 0.40,          // 40% for hawker centres, restaurants, cafes
    entertainmentLeisure: wantsTotal * 0.40, // 40% for movies, events, and leisure activities
    shoppingMisc: wantsTotal * 0.20          // 20% for retail, personal care, and other non-essential items
  };

  // Detailed breakdown for Savings
  const savingsBreakdown = {
    emergencyFund: savingsTotal * 0.25,       // 25% reserved for emergencies
    retirementCPF: savingsTotal * 0.25,       // 25% for CPF top-ups/retirement planning
    investing: savingsTotal * 0.40,           // 40% allocated for investments (stocks, REITs, etc.)
    personalDevelopment: savingsTotal * 0.10  // 10% for further education or skill upgrades
  };

  return res.json({
    income: incomeNum,
    breakdown: {
      needs: needsTotal,
      wants: wantsTotal,
      savings: savingsTotal
    },
    details: {
      needs: {
        description: "Essential expenses tailored for Singapore, covering housing (HDB/mortgage), utilities, groceries, transportation, and healthcare/insurance.",
        breakdown: needsBreakdown
      },
      wants: {
        description: "Discretionary spending including dining out at hawker centres/restaurants, entertainment, leisure, and occasional shopping.",
        breakdown: wantsBreakdown
      },
      savings: {
        description: "Financial reserves allocated for emergencies, CPF/retirement planning, investments, and personal development.",
        breakdown: savingsBreakdown
      }
    }
  });
});


// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
