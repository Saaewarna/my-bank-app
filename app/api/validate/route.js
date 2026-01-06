import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // ⚠️ KITA ABAIKAN INPUT USER DULU. KITA TES KONEKSI MURNI.
  // Ini data yang TERBUKTI SUKSES di script 'tes-nama.js' kamu.
  const hardcodedBank = 'bank_bca';
  const hardcodedRek = '3910144366';
  const hardcodedKey = 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK';

  console.log("🚀 MEMULAI HARDCODED TEST VERCEL...");

  // URL yang kita susun manual (tanpa object URLSearchParams biar persis script lokal)
  const targetUrl = `https://use.api.co.id/validation/bank?bank_code=${hardcodedBank}&account_number=${hardcodedRek}`;
  
  console.log(`🎯 Nembak ke: ${targetUrl}`);

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'x-api-co-id': hardcodedKey,
        'Accept': 'application/json',
        // Kita coba tambahkan User-Agent Chrome biar dikira browser beneran
        // Siapa tau Vercel diblokir kalau gak punya User-Agent
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      cache: 'no-store'
    });

    const data = await res.json();
    console.log(`📡 Status dari API: ${res.status}`);
    console.log(`📦 Body dari API: ${JSON.stringify(data)}`);

    return NextResponse.json({
      test_status: res.ok ? 'BERHASIL' : 'GAGAL',
      api_status: res.status,
      api_response: data
    }, { status: 200 }); // Kita selalu return 200 ke frontend biar bisa baca log-nya

  } catch (error) {
    console.error("🔥 Error Fetch:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}