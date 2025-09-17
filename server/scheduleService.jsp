import fetch from 'node-fetch';
import ical from 'node-ical';

export async function getOrFetchSchedule({ postcode }) {
  // Placeholder: demo schedule
  const today = new Date();
  const parsed = {};
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const date = d.toISOString().slice(0, 10);
    if (i % 2 === 0) parsed[date] = ['recycling'];
    else parsed[date] = ['general'];
  }
  return { parsed, nextBin: computeNextBin(parsed) };
}

export function computeNextBin(parsedMap, date) {
  const d = new Date(date || new Date());
  d.setDate(d.getDate() + 1);
  const key = d.toISOString().slice(0, 10);
  return parsedMap[key] || [];
}
