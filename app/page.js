'use client';

import { useState } from 'react';

export default function BankValidation() {
  const [formData, setFormData] = useState({
    bank_code: '',
    account_number: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Masukkan API Key langsung di sini (Khusus Client Side)
  const API_KEY = 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // 1. Logika Prefix Bank (Wajib ada bank_)
    let code = formData.bank_code.trim();
    if (!code.startsWith('bank_')) {
      code = `bank_${code}`;
    }
    
    const accNumber = formData.account_number.trim();

    // 2. Tembak Langsung ke Server API (Bypass Vercel Backend)
    const url = `https://use.api.co.id/validation/bank?bank_code=${code}&account_number=${accNumber}`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-co-id': API_KEY,
          'Accept': 'application/json'
        }
      });

      const data = await res.json();
      setResult(data);

    } catch (error) {
      console.error("Error:", error);
      // Kalau kena CORS (Cross-Origin), berarti API ini emang ga bolehin browser akses langsung
      setResult({ error: 'Gagal koneksi (Cek Console Browser)' });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Cek Rekening (Direct)</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Kode Bank (cth: bca, mandiri)</label>
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
            placeholder="Nomor rekening"
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
            background: loading ? '#ccc' : '#28a745', 
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
          <h3>Hasil Validasi:</h3>
          {/* Tampilkan JSON mentah biar jelas */}
          <pre style={{ overflowX: 'auto' }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}