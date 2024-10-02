"use client"
import { useState } from 'react';

export default function Demo() {
  // State for inputs
  const [polAmpas, setPolAmpas] = useState('');
  const [polBlotong, setPolBlotong] = useState('');
  const [polTetes, setPolTetes] = useState('');
  const [rendemenKebun, setRendemenKebun] = useState('');
  const [rendemenGerbang, setRendemenGerbang] = useState('');
  const [rendemenNPP, setRendemenNPP] = useState('');
  const [rendemenGula, setRendemenGula] = useState('');
  const [kehilanganRendemen, setKehilanganRendemen] = useState(null);

  // Handle form submission and calculation
  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate Kehilangan Rendemen (%)
    const kehilangan = (parseFloat(rendemenKebun) - parseFloat(rendemenGerbang) - parseFloat(rendemenNPP) - parseFloat(rendemenGula)) || 0;

    setKehilanganRendemen(kehilangan);
  };

  return (
    <div className="text-white min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-ijoWasis p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Form Input Kehilangan Produksi (E2)</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pol ampas */}
          <div>
            <label className="block font-bold mb-1" htmlFor="polAmpas">
              Pol ampas (%) (Stasiun Gilingan)
            </label>
            <input
              id="polAmpas"
              type="number"
              step="0.01"
              value={polAmpas}
              onChange={(e) => setPolAmpas(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          {/* Pol blotong */}
          <div>
            <label className="block font-bold mb-1" htmlFor="polBlotong">
              Pol blotong (%) (Stasiun Pemurnian)
            </label>
            <input
              id="polBlotong"
              type="number"
              step="0.01"
              value={polBlotong}
              onChange={(e) => setPolBlotong(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          {/* Pol tetes */}
          <div>
            <label className="block font-bold mb-1" htmlFor="polTetes">
              Pol tetes (%) (Stasiun Putar)
            </label>
            <input
              id="polTetes"
              type="number"
              step="0.01"
              value={polTetes}
              onChange={(e) => setPolTetes(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          {/* Kehilangan rendemen (%) */}
          <div>
            <label className="block font-bold mb-1" htmlFor="polTetes">
            Kehilangan rendemen  (%)
            </label>
          </div>

          {/* Rendemen Kebun */}
          <div>
            <label className="block font-medium mb-1" htmlFor="rendemenKebun">
              Rendemen Kebun
            </label>
            <input
              id="rendemenKebun"
              type="number"
              step="0.01"
              value={rendemenKebun}
              onChange={(e) => setRendemenKebun(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          {/* Rendemen Gerbang */}
          <div>
            <label className="block font-medium mb-1" htmlFor="rendemenGerbang">
              Rendemen Gerbang
            </label>
            <input
              id="rendemenGerbang"
              type="number"
              step="0.01"
              value={rendemenGerbang}
              onChange={(e) => setRendemenGerbang(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          {/* Rendemen NPP */}
          <div>
            <label className="block font-medium mb-1" htmlFor="rendemenNPP">
              Rendemen NPP
            </label>
            <input
              id="rendemenNPP"
              type="number"
              step="0.01"
              value={rendemenNPP}
              onChange={(e) => setRendemenNPP(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          {/* Rendemen Gula */}
          <div>
            <label className="block font-medium mb-1" htmlFor="rendemenGula">
              Rendemen Gula
            </label>
            <input
              id="rendemenGula"
              type="number"
              step="0.01"
              value={rendemenGula}
              onChange={(e) => setRendemenGula(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="bg-ijoTebu text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700">
              Input Kehilangan Produksi (E2)
            </button>
          </div>
        </form>

        {/* Display Kehilangan Rendemen */}
        {kehilanganRendemen !== null && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold">Kehilangan Rendemen: {kehilanganRendemen.toFixed(2)}%</h2>
          </div>
        )}
      </div>
    </div>
  );
}
