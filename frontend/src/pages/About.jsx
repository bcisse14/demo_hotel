import { Helmet } from 'react-helmet-async';

export default function About(){
  return (
    <div className="container-px mx-auto py-10">
      <Helmet><title>À propos — Maison Azur</title></Helmet>
      <h1 className="text-3xl font-serif mb-4">À propos</h1>
  <p className="max-w-2xl" style={{color:'var(--color-subtle)'}}>Situé sur la Côte d’Azur, notre établissement propose des chambres élégantes avec vue mer, à deux pas de la plage. Parking, WiFi haute vitesse et climatisation.</p>
      <div className="mt-6">
        <iframe title="map" className="w-full h-64 rounded" loading="lazy" src="https://maps.google.com/maps?q=Nice%20France&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
      </div>
    </div>
  );
}
