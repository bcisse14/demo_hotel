import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchRoom } from '../lib/api';

export default function RoomDetails(){
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  useEffect(()=>{
    if(!id){ setError('Chambre introuvable'); return; }
    fetchRoom(id).then(setRoom).catch(()=> setError('Chambre introuvable'));
  },[id]);
  if(error) return <div className="container-px mx-auto py-10 text-red-700">{error}</div>;
  if(!room) return <div className="container-px mx-auto py-10">Chargement…</div>;
  return (
    <div className="container-px mx-auto py-10">
      <Helmet><title>{room.name} — Maison Azur</title></Helmet>
      <h1 className="text-3xl font-serif mb-4">{room.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Array.isArray(room.photos)? room.photos : []).map((p,idx)=> {
          const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="sans-serif" font-size="20">Image indisponible</text></svg>';
          const src = (typeof p === 'string' && p.startsWith('http')) ? p : (typeof p === 'string' ? `/images/${p}` : placeholder);
          return <img key={`room-photo-${idx}`} src={src} alt="" className="w-full h-60 object-cover rounded" onError={(e)=>{e.currentTarget.src=placeholder}} />
        })}
      </div>
      <p className="mt-4 text-slate-700">{room.description}</p>
      <div className="mt-4 flex gap-2 flex-wrap">
        {(room.equipments||[]).map((e, i)=> <span key={i} className="badge">{e}</span>)}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <span className="text-xl font-semibold">{room.price}€ / nuit</span>
        <Link to={`/reservation?room=${room.id}`} className="btn-primary">Réserver</Link>
      </div>
    </div>
  );
}
