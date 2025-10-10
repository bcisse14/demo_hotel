import axios from 'axios';

// Prefer explicit Vercel/Vite env, otherwise same-origin in browser, finally dev fallback
const inferredOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
const baseURL = (import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL) : inferredOrigin) || 'http://127.0.0.1:8000';
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
