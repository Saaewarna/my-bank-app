import { NextResponse } from 'next/server';
import https from 'https'; // Kita pakai library native Node.js (Jurus Nuklir)

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // 1. Bersihkan Input
  let bank_code = (searchParams.get('bank_code') || '').trim();
  const account_number = (searchParams.get('account_number') || '').trim();
  let apiKey = process.env.API_CO_ID_KEY || 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK';
  apiKey = apiKey.trim();

  // 2. Validasi Input
  if (!bank_code || !account_number) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  // 3. Tambahkan prefix bank_ jika belum ada
  if (!bank_code.startsWith('bank_')) {
    bank_code = `bank_${bank_code}`;
  }

  // 4. JURUS NUKLIR: Request pakai 'https' module (bukan fetch)
  // Kita bungkus dalam Promise supaya bisa ditunggu (await)
  const dataAPI = await new Promise((resolve, reject) => {
    const options = {
      hostname: 'use.api.co.id',
      path: `/validation/bank?bank_code=${bank_code}&account_number=${account_number}`,
      method: 'GET',
      headers: {
        'x-api-co-id': apiKey,
        'Accept': 'application/json'
        // Kita biarkan User-Agent default Node.js (karena di tes manual sukses)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        try {
          // Coba parsing JSON
          const json = JSON.parse(responseBody);
          // Tambahkan status code asli dari server sana ke object hasil
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          // Kalau bukan JSON (misal error server html)
          resolve({ status: 500, data: { error: 'Gagal parse JSON', raw: responseBody } });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ status: 500, data: { error: 'Koneksi Gagal', details: e.message } });
    });

    req.end(); // Kirim request
  });

  // 5. Kembalikan hasil ke Frontend
  if (dataAPI.status !== 200) {
    console.log("❌ API Error:", JSON.stringify(dataAPI.data));
    return NextResponse.json(dataAPI.data, { status: dataAPI.status });
  }

  return NextResponse.json(dataAPI.data, { status: 200 });
}