import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Wajib biar nggak di-cache Vercel

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bank_code = searchParams.get('bank_code');
  const account_number = searchParams.get('account_number');
  const name = searchParams.get('name');

  // --- CONFIG API KEY ---
  // Kita utamakan key dari .env, tapi kalau kosong pakai backup (opsional)
  const apiKey = process.env.API_CO_ID_KEY || 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK';
  
  if (!bank_code || !account_number) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  // Siapkan URL (Pastikan pakai HTTPS)
  const apiUrl = new URL('https://use.api.co.id/validation/bank');
  apiUrl.searchParams.append('bank_code', bank_code);
  apiUrl.searchParams.append('account_number', account_number);
  
  // Masukkan nama kalau user ngisi (Fitur validasi nama)
  if (name) apiUrl.searchParams.append('account_name', name); 

  try {
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'x-api-co-id': apiKey,
        // ❌ JANGAN PAKAI 'Content-Type': 'application/json' DI SINI! (Ini biang keroknya)
        'User-Agent': 'PostmanRuntime/7.26.8' // Opsional: Biar dianggap browser/client valid
      },
      cache: 'no-store'
    });

    const data = await res.json();
    
    // Cek error dari API External
    if (!res.ok) {
        console.log("Error dari API:", JSON.stringify(data));
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