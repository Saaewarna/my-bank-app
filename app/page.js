'use client';

import { useState } from 'react';

export default function BankValidation() {
  const [formData, setFormData] = useState({
    bank_code: '',
    account_number: '',
    name: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const query = new URLSearchParams(formData).toString();
      const res = await fetch(`/api/validate?${query}`);
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Terjadi kesalahan sistem' });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Cek Rekening Bank</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Kode Bank (cth: bca, mandiri, bri)</label>
          <input
            type="text"
            required
            placeholder="bca"
            value={formData.bank_code}
            onChange={(e) => setFormData({...formData, bank_code: e.target.value})}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Nomor Rekening</label>
          <input
            type="text"
            required
            placeholder="1234567890"
            value={formData.account_number}
            onChange={(e) => setFormData({...formData, account_number: e.target.value})}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '12px', 
            background: loading ? '#ccc' : '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Sedang Mengecek...' : 'Validasi Sekarang'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Hasil:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}