import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bank_code = searchParams.get('bank_code');
  const account_number = searchParams.get('account_number');
  const name = searchParams.get('name');

  // API Key kamu
  const apiKey = process.env.API_CO_ID_KEY || 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK';
  
  if (!bank_code || !account_number) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  // --- PERUBAHAN UTAMA DI SINI ---
  // Kita ubah target ke POST supaya lebih stabil sesuai dokumentasi
  const apiUrl = 'https://use.api.co.id/validation/bank';

  try {
    const res = await fetch(apiUrl, {
      method: 'POST', // Ganti jadi POST
      headers: {
        'x-api-co-id': apiKey,
        'Content-Type': 'application/json', // Wajib ada kalau POST
        'User-Agent': 'PostmanRuntime/7.26.8'
      },
      // Data dikirim sebagai JSON Body, bukan parameter URL
      body: JSON.stringify({
        bank_code: bank_code,
        account_number: account_number,
        account_name: name || undefined // Kirim hanya jika ada
      }),
      cache: 'no-store'
    });

    const data = await res.json();
    
    if (!res.ok) {
        console.log("Error API External:", JSON.stringify(data));
        return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: 'Gagal menghubungi server', details: error.message },
      { status: 500 }
    );
  }
}