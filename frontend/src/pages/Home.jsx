import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchRooms } from '../lib/api';
import BookingWidget from '../components/BookingWidget';
import { Link } from 'react-router-dom';

export default function Home(){
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [criteria, setCriteria] = useState(null);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);
  useEffect(()=>{
    fetchRooms()
      .then((list)=> Array.isArray(list) ? list : [])
      .then((list)=>{ setRooms(list); setFiltered([]); })
  .catch(()=> setError('Impossible de charger les chambres.'));
  },[]);

  function onSearch({ arrival, departure, guests }){
    // Basic validation
    if (!arrival || !departure) {
      setError('Veuillez sélectionner des dates.');
      return;
    }
    const start = new Date(arrival);
    const end = new Date(departure);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      setError('Dates invalides (le départ doit être après l’arrivée).');
      return;
    }
    setError(null);
    setCriteria({ arrival, departure, guests });
    setHasSearched(true);
    // Simple availability mock: filter by capacity
    const res = rooms.filter(r => (r.capacity ?? 2) >= (guests || 1));
    setFiltered(res);
    // Scroll to results
    setTimeout(()=>{ resultsRef.current?.scrollIntoView({behavior:'smooth', block:'start'}); }, 0);
  }

  return (
    <div>
      <Helmet>
        <title>Maison Azur — Réservez maintenant</title>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Hotel',
          name: 'Maison Azur',
          address: { '@type': 'PostalAddress', addressLocality: 'Nice', addressCountry: 'FR' },
          url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
          telephone: '+33 1 23 45 67 89'
        })}</script>
      </Helmet>
  <section className="relative h-[60vh] md:h-[70vh] flex items-center" style={{backgroundImage:'linear-gradient(0deg, rgba(11,18,32,0.55), rgba(11,18,32,0.55)), url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop)', backgroundSize:'cover', backgroundPosition:'center'}}>
        <div className="container-px mx-auto">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-serif text-[color:var(--color-primary)] drop-shadow" style={{textShadow:'0 2px 8px rgba(0,0,0,.25)'}}>Séjournez face à la mer</h1>
            <p className="mt-3" style={{color:'rgba(255,255,255,.92)'}}>Réservez en direct, sans commission. Meilleur prix garanti.</p>
          </div>
          <div className="mt-6 max-w-3xl">
            <BookingWidget onSearch={onSearch} />
          </div>
        </div>
      </section>

      <section ref={resultsRef} className="container-px mx-auto py-10">
        <h2 className="text-2xl font-serif mb-4">Nos chambres</h2>
        {error && <div className="text-red-700 mb-3">{error}</div>}
        {hasSearched && (
          <div className="mb-4" style={{color:'var(--color-muted)'}}>
            {filtered.length > 0
              ? `${filtered.length} résultat${filtered.length>1?'s':''} pour ${criteria?.arrival} → ${criteria?.departure}, ${criteria?.guests||1} personne${(criteria?.guests||1)>1?'s':''}`
              : `Aucune chambre disponible pour ${criteria?.arrival} → ${criteria?.departure} (${criteria?.guests||1} personne${(criteria?.guests||1)>1?'s':''})`}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(hasSearched ? (filtered || []) : (rooms || [])).map((room, idx) => {
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
      </section>
    </div>
  );
}
