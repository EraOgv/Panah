import { useState } from 'react';
import { CITIES } from '../utils/constants';
import CitySelector from '../components/map/CitySelector';
import CityMap from '../components/map/CityMap';

function HomePage() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">PANAH</h1>
        <p className="text-gray-600 text-lg">Your travel shield — safe journeys start here.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Explore scam hotspots and safe zones
        </h2>
        <CitySelector selectedCity={selectedCity} onSelect={setSelectedCity} />
        <CityMap city={selectedCity} />
        <div className="flex gap-4 mt-3 text-sm text-gray-600">
          <span>🔴 Scam Hotspot</span>
          <span>🔵 Safe Zone</span>
        </div>
      </div>
    </div>
  );
}

export default HomePage;