import axios from 'axios';

// In production, always use Koyeb. In local dev (localhost/127.0.0.1), use local Symfony.
const isBrowser = typeof window !== 'undefined' && !!window.location;
const isLocalHost = isBrowser && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
// Allow overriding the API base URL at build time (Vercel) via VITE_API_BASE_URL
// Vite injecte import.meta.env.* côté client
const envBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : undefined;
const baseURL = isLocalHost
  ? 'http://127.0.0.1:8000'
  : (envBase || 'https://defensive-mehetabel-karlsefni-aa7acc6f.koyeb.app');
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
