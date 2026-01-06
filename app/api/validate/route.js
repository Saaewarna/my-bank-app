import { NextResponse } from 'next/server';

// PENTING: Memastikan rute ini selalu dinamis (tidak dicache)
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bank_code = searchParams.get('bank_code');
  const account_number = searchParams.get('account_number');
  const name = searchParams.get('name');

  // 1. CEK API KEY (Lihat di Logs nanti)
  const apiKey = '8sqrhsP2Vok5s6C77Qz6vaiovJevQTdeUcZUXzletZEH1gwa6O';
  console.log("--- DEBUG START ---");
  console.log("Status API Key:", apiKey ? "ADA (Terisi)" : "KOSONG (Gawat!)");
  console.log("Mencoba validasi:", bank_code, account_number);

  if (!bank_code || !account_number) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  // Siapkan URL
  const apiUrl = new URL('https://use.api.co.id/validation/bank');
  apiUrl.searchParams.append('bank_code', bank_code);
  apiUrl.searchParams.append('account_number', account_number);
  if (name) apiUrl.searchParams.append('name', name);

  console.log("URL External:", apiUrl.toString());

  try {
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'x-api-co-id': apiKey || '', // Pastikan string
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Jangan cache request ini
    });

    const data = await res.json();
    console.log("Respon dari api.co.id:", res.status, JSON.stringify(data));

    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error("Error Fetching:", error);
    return NextResponse.json(
      { error: 'Gagal menghubungi server', details: error.message },
      { status: 500 }
    );
  }
}