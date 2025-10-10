import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { createReservation, simulatePayment, fetchRoom, fetchRooms } from '../lib/api';

export default function Reservation(){
  const [params] = useSearchParams();
  const [roomId] = useState(params.get('room'));
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', startDate: '', endDate: '', guests: 2 });
  const [status, setStatus] = useState('idle');

  useEffect(()=>{ if(roomId) fetchRoom(roomId).then(setRoom).catch(()=>{}); },[roomId]);
  useEffect(()=>{ if(!roomId) fetchRooms().then((list)=> Array.isArray(list)? setRooms(list) : setRooms([])); },[roomId]);

  async function submit(e){
    e.preventDefault();
    setStatus('saving');
    try{
      // Fallback: if no roomId from URL, use selected dropdown value
      const chosenRoomId = roomId || (form.roomSelectId || '').trim();
      if(!chosenRoomId) throw new Error('Aucune chambre sélectionnée');
      const res = await createReservation({
        room: `/api/rooms/${chosenRoomId}`,
        name: form.name,
        email: form.email,
        startDate: form.startDate,
        endDate: form.endDate,
        guests: Number(form.guests)
      });
      setStatus('paying');
      await simulatePayment({ reservation_id: res.id, amount: Math.round((room?.price||100) * 0.2) });
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <div className="container-px mx-auto py-10">
      <Helmet><title>Réserver — Maison Azur</title></Helmet>
      <h1 className="text-3xl font-serif mb-6">Réservation</h1>
      {(room || rooms.length>0) && (
  <div className="mb-4 card p-4">
          <div className="flex items-center gap-3">
            {room ? (
              <img src={(Array.isArray(room.photos) && room.photos[0]) || ''} onError={(e)=>{e.currentTarget.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'120\'><rect width=\'100%\' height=\'100%\' fill=\'%23e5e7eb\'/></svg>'}} alt="" className="w-24 h-16 object-cover rounded" />
            ) : null}
            <div>
              <div className="font-serif">{room ? room.name : 'Sélectionner une chambre'}</div>
              <div className="text-sm" style={{color:'var(--color-subtle)'}}>{room ? `${room.price}€ / nuit` : ''}</div>
            </div>
          </div>
          {!room && rooms.length>0 && (
            <div className="mt-3">
              <label className="label">Choisir une chambre</label>
              <select value={form.roomSelectId||''} onChange={(e)=> setForm({...form, roomSelectId:e.target.value})} className="input">
                <option value="">-- Sélectionner --</option>
                {rooms.map(r=> <option key={r.id} value={r.id}>{r.name} — {r.price}€</option>)}
              </select>
            </div>
          )}
        </div>
      )}
      <form onSubmit={submit} className="card p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Nom</label>
          <input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="input" />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="input" />
        </div>
        <div>
          <label className="label">Arrivée</label>
          <input type="date" required value={form.startDate} onChange={e=>setForm({...form, startDate:e.target.value})} className="input" />
        </div>
        <div>
          <label className="label">Départ</label>
          <input type="date" required value={form.endDate} onChange={e=>setForm({...form, endDate:e.target.value})} className="input" />
        </div>
        <div>
          <label className="label">Personnes</label>
          <input type="number" min={1} required value={form.guests} onChange={e=>setForm({...form, guests:parseInt(e.target.value||'1',10)})} className="input" />
        </div>
        <div className="md:col-span-2 flex gap-3 items-center">
          <button disabled={status==='saving'||status==='paying'} className="btn-primary" type="submit">{status==='paying'?'Paiement…':status==='saving'?'Envoi…':'Confirmer & payer 20%'}</button>
          {status==='done' && <span className="text-green-700">Réservation confirmée ✓</span>}
          {status==='error' && <span className="text-red-700">Erreur lors de la réservation</span>}
        </div>
      </form>
    </div>
  );
}
