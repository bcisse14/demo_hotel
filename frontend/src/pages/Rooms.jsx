import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchRooms } from '../lib/api';
import { Link } from 'react-router-dom';

export default function Rooms(){
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  useEffect(()=>{
    fetchRooms()
      .then((list)=> Array.isArray(list) ? list : [])
      .then(setRooms)
      .catch(()=> setError('Impossible de charger les chambres.'));
  },[]);
  return (
    <div className="container-px mx-auto py-10">
      <Helmet><title>Chambres — Maison Azur</title></Helmet>
      <h1 className="text-3xl font-serif mb-6">Chambres</h1>
  {error && <div className="text-red-700">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room, idx) => {
          const photo = Array.isArray(room.photos) && room.photos.length ? room.photos[0] : null;
          const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="sans-serif" font-size="20">Image indisponible</text></svg>';
          const src = photo && typeof photo === 'string' && !photo.startsWith('http') ? `/images/${photo}` : (photo || placeholder);
          const key = room.id ?? room.slug ?? `room-${idx}`;
          return (
          <div key={key} className="card overflow-hidden">
            <img src={src} alt={room.name || 'Chambre'} className="h-40 w-full object-cover" onError={(e)=>{e.currentTarget.src=placeholder}} />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg">{room.name || 'Chambre'}</h3>
                <span className="badge">{room.price ?? '?'}€/nuit</span>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 mt-1">{room.description}</p>
              <div className="mt-3 flex gap-2">
                {room.id ? (
                  <Link to={`/chambres/${room.id}`} className="btn-primary">Voir détails</Link>
                ) : (
                  <span className="btn-primary opacity-50 cursor-not-allowed">Voir détails</span>
                )}
                {room.id ? (
                  <Link to={`/reservation?room=${room.id}`} className="btn-secondary">Réserver</Link>
                ) : (
                  <span className="btn-secondary opacity-50 cursor-not-allowed">Réserver</span>
                )}
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
