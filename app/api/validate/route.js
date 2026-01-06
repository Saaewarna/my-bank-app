import { NextResponse } from 'next/server';

export async function GET(request) {
  // Ambil parameter dari URL frontend
  const { searchParams } = new URL(request.url);
  const bank_code = searchParams.get('bank_code');
  const account_number = searchParams.get('account_number');
  const name = searchParams.get('name'); // Nama untuk dicocokkan (opsional/wajib tergantung API)

  // Validasi input dasar
  if (!bank_code || !account_number) {
    return NextResponse.json(
      { error: 'Bank code dan nomor rekening wajib diisi' },
      { status: 400 }
    );
  }

  // Siapkan URL ke api.co.id
  const apiUrl = new URL('https://use.api.co.id/validation/bank');
  apiUrl.searchParams.append('bank_code', bank_code);
  apiUrl.searchParams.append('account_number', account_number);
  // Tambahkan name jika user menginputnya (untuk fitur fuzzy match API)
  if (name) apiUrl.searchParams.append('name', name);

  try {
    // Panggil API External (api.co.id)
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'x-api-co-id': process.env.API_CO_ID_KEY, // Ambil key dari .env
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    // Kembalikan respon apa adanya dari api.co.id ke frontend
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menghubungi server validasi', details: error.message },
      { status: 500 }
    );
  }
}