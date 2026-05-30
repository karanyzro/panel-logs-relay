const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const API_KEY = process.env.API_KEY;

const COLORS = {
  BL: 0xFF0000,
  KICK: 0xFF6600,
  UNBLACKLIST: 0x00FF00,
  RESET_ROLE: 0xFFFF00,
  RESET_SAVE: 0xFF00FF,
  FIN_SESSION: 0x0000FF,
  DEFAULT: 0x888888
};

app.post('/log', async (req, res) => {
  if (req.headers['x-api-key'] !== API_KEY)
    return res.status(401).json({ error: 'Non autorise' });

  const { action, staff, target, details } = req.body;
  const color = COLORS[action] || COLORS.DEFAULT;

  const embed = {
    title: 'ACTION : ' + action,
    color: color,
    fields: [
      { name: 'Staff',   value: staff   || 'Inconnu', inline: true },
      { name: 'Cible',   value: target  || 'Inconnu', inline: true },
      { name: 'Details', value: details || '-',       inline: false }
    ],
    footer: { text: 'Panel Logs - ' + new Date().toLocaleString('fr-FR') },
    timestamp: new Date().toISOString()
  };

  try {
    await axios.post(WEBHOOK_URL, { embeds: [embed] });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Serveur lance sur le port ' + PORT);
});
