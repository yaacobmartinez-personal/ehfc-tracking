import { Barangay } from '../types/map';

interface BarangayInfoProps {
  barangay: Barangay | null;
  onClose: () => void;
}

export default function BarangayInfo({ barangay, onClose }: BarangayInfoProps) {
  if (!barangay) return null;

  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{barangay.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-gray-600 mb-2">{barangay.description}</p>
      {barangay.area && (
        <p className="text-sm text-gray-500 mb-1">
          <span className="font-medium">Area:</span> {barangay.area}
        </p>
      )}
      {barangay.population && (
        <p className="text-sm text-gray-500">
          <span className="font-medium">Population:</span> {barangay.population.toLocaleString()}
        </p>
      )}
    </div>
  );
}
