// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// ----- 1. 50/30/20 Calculator -----
app.post('/api/calculate', (req, res) => {
  const { income } = req.body;
  if (!income || isNaN(income)) {
    return res.status(400).json({ error: 'Invalid income provided.' });
  }
  const incomeNum = parseFloat(income);
  const needsTotal = incomeNum * 0.50;
  const wantsTotal = incomeNum * 0.30;
  const savingsTotal = incomeNum * 0.20;
  const needsBreakdown = {
    housing: needsTotal * 0.40,
    utilities: needsTotal * 0.15,
    groceries: needsTotal * 0.20,
    transportation: needsTotal * 0.15,
    healthcareInsurance: needsTotal * 0.10,
  };
  const wantsBreakdown = {
    diningOut: wantsTotal * 0.40,
    entertainmentLeisure: wantsTotal * 0.40,
    shoppingMisc: wantsTotal * 0.20,
  };
  const savingsBreakdown = {
    emergencyFund: savingsTotal * 0.25,
    retirementCPF: savingsTotal * 0.25,
    investing: savingsTotal * 0.40,
    personalDevelopment: savingsTotal * 0.10,
  };
  return res.json({
    income: incomeNum,
    breakdown: { needs: needsTotal, wants: wantsTotal, savings: savingsTotal },
    details: {
      needs: { description: "Essential expenses tailored for Singapore, covering housing, utilities, groceries, transportation, and healthcare/insurance.", breakdown: needsBreakdown },
      wants: { description: "Discretionary spending including dining out, entertainment, leisure, and occasional shopping.", breakdown: wantsBreakdown },
      savings: { description: "Financial reserves for emergencies, CPF/retirement planning, investments, and personal development.", breakdown: savingsBreakdown },
    },
  });
});

// ----- 2. Emergency Fund Calculator -----
app.post('/api/emergency-fund', (req, res) => {
  const { monthlyExpenses, targetMonths, currentFund } = req.body;
  if (monthlyExpenses == null || targetMonths == null || currentFund == null || isNaN(monthlyExpenses) || isNaN(targetMonths) || isNaN(currentFund)) {
    return res.status(400).json({ error: 'Invalid input for emergency fund calculation.' });
  }
  const expenses = parseFloat(monthlyExpenses);
  const months = parseFloat(targetMonths);
  const current = parseFloat(currentFund);
  const ideal = expenses * months;
  const progress = Math.min((current / ideal) * 100, 100);
  return res.json({ ideal, progress });
});

// ----- 3. Debt Management & Payoff Strategies -----
app.post('/api/debt-management', (req, res) => {
  const { debts } = req.body;
  if (!debts || !Array.isArray(debts)) {
    return res.status(400).json({ error: 'Invalid input for debt management.' });
  }
  for (let debt of debts) {
    if (!debt.name || isNaN(debt.balance) || isNaN(debt.interest) || isNaN(debt.minPayment)) {
      return res.status(400).json({ error: 'Invalid debt entry.' });
    }
  }
  const snowball = [...debts].sort((a, b) => parseFloat(a.balance) - parseFloat(b.balance));
  const avalanche = [...debts].sort((a, b) => parseFloat(b.interest) - parseFloat(a.interest));
  return res.json({ snowball, avalanche });
});

// ----- 4. Income Diversification & Side Hustle Suggestions -----
app.post('/api/side-hustle', (req, res) => {
  const { skills, timeAvailability } = req.body;

  if (!skills || !timeAvailability) {
    return res.status(400).json({ error: 'Please provide skills and time availability.' });
  }

  const lowerSkills = skills.toLowerCase();

  const predefinedHustles = [
    { suggestion: "Freelance Writing", keywords: ["writing", "content", "copywriting", "editing"] },
    { suggestion: "Graphic Design", keywords: ["design", "graphic", "logo", "illustration"] },
    { suggestion: "Online Tutoring", keywords: ["teaching", "tutoring", "education", "math", "english", "science"] },
    { suggestion: "Virtual Assistant", keywords: ["admin", "assistant", "data entry", "organization"] },
    { suggestion: "E-commerce (Dropshipping)", keywords: ["e-commerce", "sales", "dropshipping", "shopify"] },
    { suggestion: "Ridesharing or Delivery", keywords: ["driving", "delivery", "uber", "lyft", "doordash"] },
    { suggestion: "Blogging/Vlogging", keywords: ["blog", "video", "vlog", "youtube", "content creation"] },
    { suggestion: "Social Media Management", keywords: ["social media", "marketing", "instagram", "facebook", "twitter", "linkedin"] },
    { suggestion: "Affiliate Marketing", keywords: ["marketing", "sales", "affiliate", "commissions"] },
    { suggestion: "Photography", keywords: ["photo", "photography", "editing", "lightroom", "photoshop"] },
    { suggestion: "Web Development", keywords: ["coding", "web development", "html", "css", "javascript", "frontend", "backend"] },
    { suggestion: "App Development", keywords: ["app", "mobile", "android", "ios", "flutter", "react native"] },
    { suggestion: "Voice Over Work", keywords: ["voice", "recording", "narration", "audiobooks", "commercial"] },
    { suggestion: "Handmade Crafts & Etsy Store", keywords: ["craft", "etsy", "handmade", "knitting", "woodworking", "jewelry"] },
    { suggestion: "Transcription Services", keywords: ["transcription", "typing", "audio", "text"] },
    { suggestion: "Translation Services", keywords: ["translation", "language", "bilingual", "multilingual"] },
    { suggestion: "Stock Photography", keywords: ["photography", "stock", "shutterstock", "istock", "adobe stock"] },
    { suggestion: "Print on Demand (T-shirts, Mugs)", keywords: ["design", "print", "t-shirts", "mugs", "merch"] },
    { suggestion: "Dropshipping", keywords: ["dropshipping", "e-commerce", "aliexpress", "shopify"] },
    { suggestion: "Online Coaching", keywords: ["coaching", "mentoring", "personal development", "consulting"] },
    { suggestion: "Fitness Coaching", keywords: ["fitness", "workout", "personal trainer", "nutrition"] },
    { suggestion: "Pet Sitting/Dog Walking", keywords: ["pets", "dogs", "cats", "walking", "sitting"] },
    { suggestion: "House Sitting", keywords: ["house", "caretaking", "security", "travel"] },
    { suggestion: "Event Planning", keywords: ["events", "weddings", "parties", "planning"] },
    { suggestion: "Online Surveys & Market Research", keywords: ["survey", "research", "user testing", "focus groups"] },
    { suggestion: "Game Streaming (Twitch, YouTube)", keywords: ["gaming", "streaming", "twitch", "youtube", "esports"] },
    { suggestion: "Domain Flipping", keywords: ["domains", "website", "flipping", "reselling"] },
    { suggestion: "Stock Market & Crypto Trading", keywords: ["stocks", "crypto", "trading", "investment"] },
    { suggestion: "NFT Art & Digital Art", keywords: ["art", "nft", "blockchain", "crypto"] },
    { suggestion: "Car Rental (Turo, Getaround)", keywords: ["car", "rental", "turo", "getaround"] },
    { suggestion: "Home Rental (Airbnb, Vrbo)", keywords: ["home", "rental", "airbnb", "vrbo"] },
    { suggestion: "Voiceover Acting", keywords: ["voice", "acting", "recording", "audio", "voiceover"] },
    { suggestion: "AI Prompt Engineering (ChatGPT, Midjourney)", keywords: ["ai", "prompt", "engineering", "chatgpt", "midjourney"] },
    { suggestion: "Virtual Event Hosting", keywords: ["event", "zoom", "hosting", "moderator"] },
    { suggestion: "Tech Support & IT Help", keywords: ["tech", "support", "it", "troubleshooting"] },
    { suggestion: "SEO Optimization Services", keywords: ["seo", "search engine", "optimization", "ranking"] },
    { suggestion: "Podcasting", keywords: ["podcast", "audio", "interviews", "recording"] },
    { suggestion: "Voice Acting for Audiobooks", keywords: ["voice", "acting", "audiobooks", "narration"] }
  ];

  const suggestions = predefinedHustles.filter(hustle => 
    hustle.keywords.some(keyword => lowerSkills.includes(keyword))
  );

  if (suggestions.length === 0) {
    return res.json({ suggestions: [
      "Consider exploring freelance platforms like Upwork, Fiverr, or TaskRabbit.",
      "Look into part-time remote work on sites like We Work Remotely or PeoplePerHour.",
      "Explore gig economy jobs such as Instacart, Amazon Flex, or Postmates."
    ] });
  }

  return res.json({ suggestions: suggestions.map(h => h.suggestion) });
});


// ----- Serve Static Assets for Production -----
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
