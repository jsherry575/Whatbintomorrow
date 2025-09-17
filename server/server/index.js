import express from 'express';
import bodyParser from 'body-parser';
import { getOrFetchSchedule, computeNextBin } from './scheduleService.js';

const app = express();
app.use(bodyParser.json());

// Demo in-memory "database"
const addresses = {};

app.post('/v1/address', async (req, res) => {
  const { postcode } = req.body;
  if (!postcode) return res.status(400).json({ error: 'postcode required' });

  try {
    const { parsed, nextBin } = await getOrFetchSchedule({ postcode });
    const id = Date.now().toString();
    addresses[id] = { postcode, parsed };
    res.json({ addressId: id, nextBin, schedulePreview: parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

app.get('/v1/address/:id/next-bin', (req, res) => {
  const addr = addresses[req.params.id];
  if (!addr) return res.status(404).json({ error: 'not found' });

  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const bins = computeNextBin(addr.parsed, date);
  res.json({ date, bins });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
