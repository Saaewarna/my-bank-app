import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let bank_code = searchParams.get('bank_code'); // Pakai let biar bisa diubah
  const account_number = searchParams.get('account_number');
  const name = searchParams.get('name');

  // API Key kamu
  const apiKey = process.env.API_CO_ID_KEY || 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK';

  if (!bank_code || !account_number) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  // --- LOGIKA PERBAIKAN (THE FIX) ---
  // Kalau kode bank belum ada awalan 'bank_', kita tambahkan manual.
  if (!bank_code.startsWith('bank_')) {
    bank_code = `bank_${bank_code}`;
  }

  // Siapkan URL dengan format yang SUDAH TERBUKTI BERHASIL
  const apiUrl = new URL('https://use.api.co.id/validation/bank');
  apiUrl.searchParams.append('bank_code', bank_code);       // Ini sekarang isinya 'bank_bca'
  apiUrl.searchParams.append('account_number', account_number);
  
  if (name) apiUrl.searchParams.append('account_name', name); // Jaga-jaga nama parameternya ini

  try {
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'x-api-co-id': apiKey,
        'Accept': 'application/json', // Penting
        // User-Agent kita hapus biar aman
      },
      cache: 'no-store'
    });

    const data = await res.json();

    // Kalau API masih error, kita intip errornya apa
    if (!res.ok) {
        console.log("API Error:", JSON.stringify(data));
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