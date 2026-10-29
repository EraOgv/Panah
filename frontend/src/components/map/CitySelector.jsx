import { CITIES } from '../../utils/constants';

function CitySelector({ selectedCity, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {CITIES.map((c) => {
        const isSelected = selectedCity.value === c.value;
        return (
          <button
            key={c.value}
            onClick={() => onSelect(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'bg-blue-700 text-white shadow-md scale-105'
                : 'bg-white text-gray-600 border border-gray-200 shadow-sm hover:border-blue-300 hover:text-blue-700 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            📍 {c.label}
          </button>
        );
      })}
    </div>
  );
}

export default CitySelector;