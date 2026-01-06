import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 1. AMBIL & BERSIHKAN INPUT (TRIM SPASI)
    let bank_code = (searchParams.get('bank_code') || '').trim();
    const account_number = (searchParams.get('account_number') || '').trim();
    const name = (searchParams.get('name') || '').trim();

    // 2. AMBIL & BERSIHKAN API KEY
    // Gunakan fallback ke key UoO1... kalau ENV kosong
    let apiKey = process.env.API_CO_ID_KEY || 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK';
    apiKey = apiKey.trim(); // Wajib trim biar ga ada enter/spasi

    if (!bank_code || !account_number) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // 3. LOGIKA PREFIX (Pastikan tidak dobel)
    // Kalau user ngetik "bank_bca", jangan jadi "bank_bank_bca"
    if (!bank_code.startsWith('bank_')) {
      bank_code = `bank_${bank_code}`;
    }

    // 4. BUAT URL SECARA MANUAL (String Concatenation)
    // Kita tiru persis cara kerja script 'tes-nama.js' yang sukses
    const baseUrl = 'https://use.api.co.id/validation/bank';
    const finalUrl = `${baseUrl}?bank_code=${bank_code}&account_number=${account_number}`;
    
    // Log untuk debug di Vercel
    console.log(`🚀 Requesting: ${finalUrl}`);
    console.log(`🔑 Using Key: ${apiKey.substring(0, 5)}...`);

    // 5. EKSEKUSI FETCH
    const res = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'x-api-co-id': apiKey,
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
        console.log("❌ API Error Body:", JSON.stringify(data));
        return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}