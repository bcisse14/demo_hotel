import axios from 'axios';

// Prefer explicit Vercel/Vite env, otherwise same-origin in browser; if on vercel.app, fallback to Koyeb backend; finally dev fallback
const inferredOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
const onVercel = (typeof window !== 'undefined' && window.location && /\.vercel\.app$/.test(window.location.hostname));
const fallbackKoyeb = 'https://defensive-mehetabel-karlsefni-aa7acc6f.koyeb.app';
const computedDefault = onVercel ? fallbackKoyeb : inferredOrigin;
const rawEnvUrl = (import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).trim() : '');
const looksLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\\d+)?/i.test(rawEnvUrl);
// In production builds, ignore a localhost VITE_API_URL to prevent leaking dev config
const safeEnvUrl = (import.meta.env.PROD && looksLocal) ? '' : rawEnvUrl;
const baseURL = safeEnvUrl || computedDefault || 'http://127.0.0.1:8000';
export const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json' } });

export async function fetchRooms(params = {}) {
  const res = await api.get('/api/rooms', { params });
  const d = res.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d['hydra:member'])) return d['hydra:member'];
  if (Array.isArray(d.member)) return d.member;
  // Fallback to try common alternative keys
  if (Array.isArray(d.items)) return d.items;
  return [];
}

export async function fetchRoom(id) {
  const res = await api.get(`/api/rooms/${id}`);
  return res.data;
}

export async function createReservation(payload) {
  const res = await api.post('/api/reservations', payload);
  return res.data;
}

export async function simulatePayment({ reservation_id, amount }) {
  // Override headers for non-API Platform endpoint
  const res = await api.post('/payments/intent', { reservation_id, amount }, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });
  return res.data;
}
