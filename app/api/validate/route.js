import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bank_code = searchParams.get('bank_code');
  const account_number = searchParams.get('account_number');
  const name = searchParams.get('name');

  // Pastikan API Key ini sesuai dengan yang TERBARU di dashboard api.co.id
  // Cek lagi: Apakah key di .env.local kamu sudah sama dengan yang di dashboard?
  const apiKey = process.env.API_CO_ID_KEY || 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK';

  if (!bank_code || !account_number) {
    return NextResponse.json({ error: 'Data bank_code dan account_number wajib diisi' }, { status: 400 });
  }

  // URL Resmi (GET)
  const apiUrl = new URL('https://use.api.co.id/validation/bank');
  apiUrl.searchParams.append('bank_code', bank_code);
  apiUrl.searchParams.append('account_number', account_number);
  if (name) apiUrl.searchParams.append('account_name', name);

  console.log("Mengontak URL:", apiUrl.toString()); // Cek di Logs Vercel nanti

  try {
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'x-api-co-id': apiKey,
        'Accept': 'application/json', // WAJIB ADA untuk API modern
        // 'User-Agent': ... (Kita hapus ini biar dianggap browser biasa)
      },
      cache: 'no-store'
    });

    const data = await res.json();

    // Log error jika ada
    if (!res.ok) {
      console.log("❌ Error dari API.co.id:", res.status, JSON.stringify(data));
      return NextResponse.json(data, { status: res.status });
    }

    console.log("✅ Sukses:", data);
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: 'Gagal menghubungi server', details: error.message },
      { status: 500 }
    );
  }
}