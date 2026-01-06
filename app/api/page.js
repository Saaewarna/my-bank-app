'use client';

import { useState } from 'react';

export default function BankValidation() {
  const [formData, setFormData] = useState({
    bank_code: '',
    account_number: '',
    name: '' // Opsional, untuk verifikasi kecocokan nama
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Buat query string
      const query = new URLSearchParams(formData).toString();
      
      // Panggil Backend Internal kita
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

        <div>
          <label>Nama Pemilik (Opsional - untuk validasi)</label>
          <input
            type="text"
            placeholder="Budi Santoso"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
          <small style={{ color: '#666' }}>Isi jika ingin mencocokkan nama (fuzzy match).</small>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '12px', 
            background: loading ? '#ccc' : '#0070f3', 
            color: 'white', 
            border: 'none', 
            cursor: loading ? 'not-allowed' : 'pointer',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        >
          {loading ? 'Sedang Mengecek...' : 'Validasi Sekarang'}
        </button>
      </form>

      {/* Hasil Result */}
      {result && (
        <div style={{ marginTop: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3>Hasil Validasi:</h3>
          {result.error ? (
            <p style={{ color: 'red' }}>Error: {result.error}</p>
          ) : (
            <div>
              <p><strong>Status:</strong> {result.is_valid ? '✅ Valid' : '❌ Tidak Valid'}</p>
              <p><strong>Nama di Bank:</strong> {result.name || '-'}</p>
              <p><strong>Skor Kecocokan:</strong> {result.score ? result.score + '/10' : '-'}</p>
              <p><strong>Pesan:</strong> {result.message}</p>
            </div>
          )}
          
          <details style={{ marginTop: '10px', cursor: 'pointer' }}>
            <summary>Lihat Raw JSON</summary>
            <pre style={{ fontSize: '12px', overflowX: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}