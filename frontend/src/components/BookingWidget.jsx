import { useEffect, useState } from 'react';

export default function BookingWidget({ onSearch }) {
  const today = new Date().toISOString().slice(0,10);
  const [arrival, setArrival] = useState(today);
  const [departure, setDeparture] = useState(new Date(Date.now() + 24*60*60*1000).toISOString().slice(0,10));
  const [guests, setGuests] = useState(2);

  // Ensure departure is always at least 1 day after arrival
  useEffect(()=>{
    const a = new Date(arrival);
    const d = new Date(departure);
    if (isNaN(a.getTime())) return;
    const minDep = new Date(a.getTime() + 24*60*60*1000);
    if (isNaN(d.getTime()) || d <= a) {
      setDeparture(minDep.toISOString().slice(0,10));
    }
  },[arrival, departure]);

  return (
  <div className="card backdrop-blur p-4 md:p-6" style={{boxShadow:'0 10px 28px rgba(11,18,32,.16)', borderColor:'rgba(199,164,77,.45)'}}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="label">Arrivée</label>
          <input type="date" value={arrival} min={today} onChange={e=>setArrival(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Départ</label>
          <input type="date" value={departure} min={new Date(new Date(arrival).getTime() + 24*60*60*1000).toISOString().slice(0,10)} onChange={e=>setDeparture(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Personnes</label>
          <input type="number" min={1} value={guests} onChange={e=>setGuests(parseInt(e.target.value||'1',10))} className="input" />
        </div>
        <button className="btn-primary" onClick={()=>onSearch({arrival, departure, guests})}>Vérifier</button>
      </div>
    </div>
  );
}
