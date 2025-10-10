import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

export default function Contact(){
  const [sent, setSent] = useState(false);
  return (
    <div className="container-px mx-auto py-10">
      <Helmet><title>Contact — Maison Azur</title></Helmet>
      <h1 className="text-3xl font-serif mb-4">Contact</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <form onSubmit={e=>{e.preventDefault(); setSent(true);}} className="card p-4">
          <div>
            <label className="block text-xs font-medium text-slate-600">Nom</label>
            <input required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-600">Email</label>
            <input required type="email" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-600">Message</label>
            <textarea required className="w-full border rounded px-3 py-2" rows={5}></textarea>
          </div>
          <button className="btn-primary mt-4">Envoyer</button>
          {sent && <p className="text-green-700 mt-2">Message envoyé (simulation)</p>}
        </form>
        <div>
          <iframe title="map" className="w-full h-80 rounded" loading="lazy" src="https://maps.google.com/maps?q=Nice%20France&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
          <div className="mt-3 text-sm text-slate-700">Adresse: 123 Promenade des Anglais, Nice • Tel: +33 1 23 45 67 89</div>
        </div>
      </div>
    </div>
  );
}
