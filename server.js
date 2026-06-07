const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;

const signals = [];

app.post('/webhook', async (req, res) => {
  const { action, symbol, price, delta } = req.body;
  console.log(`[SENAL] ${action} ${symbol} @ ${price} | Delta: ${delta}`);
  signals.push({ action, symbol, price, delta, time: new Date().toISOString() });

  try {
    if (action === 'BUY') {
      console.log(`ORDEN COMPRA: ${symbol}`);
    } else if (action === 'SELL') {
      console.log(`ORDEN VENTA: ${symbol}`);
    }
    res.json({ status: 'ok', action, symbol, price });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/status', (req, res) => {
  res.json({ running: true, signals: signals.slice(-10) });
});

app.get('/', (req, res) => {
  res.json({ status: 'Bot activo', signals: signals.length });
});

app.listen(PORT, () => console.log(`Bot activo en puerto ${PORT}`));
