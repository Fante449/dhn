const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Produkte API (Cache wird bei jedem Request geleert)
app.get('/api/products', (req, res) => {
  const dataPath = path.join(__dirname, 'data.js');
  delete require.cache[require.resolve(dataPath)]; // Cache leeren
  try {
    const products = require(dataPath);
    res.json(products);
  } catch (err) {
    console.error('Fehler beim Laden der Produkte:', err);
    res.status(500).json({ error: 'Produkte konnten nicht geladen werden' });
  }
});

// Checkout Endpoint (Dummy)
app.post('/api/checkout', (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Ungültige Daten' });
  }
  res.json({ url: '/thank-you.html' });
});

// Gastro Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'gastro@example.com' && password === 'passwort') {
    res.json({ role: 'gastro' });
  } else {
    res.status(401).json({ error: 'Login fehlgeschlagen' });
  }
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
