const https = require('https');

// API Key kamu yang sudah terbukti valid
const API_KEY = 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK';

function kirimRequest(label, queryParams) {
    console.log(`\n🔵 [TES: ${label}]`);
    console.log(`   Params: ${queryParams}`);

    const options = {
        hostname: 'use.api.co.id',
        path: `/validation/bank?${queryParams}`,
        method: 'GET',
        headers: {
            'x-api-co-id': API_KEY,
            'Accept': 'application/json', // Wajib biar dia tau kita mau JSON
            'User-Agent': 'Mozilla/5.0'   // Pura-pura jadi Chrome
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log(`   ✅ SUKSES! (Status: 200)`);
                console.log(`   Isi: ${data.substring(0, 100)}...`);
            } else {
                console.log(`   ❌ GAGAL (Status: ${res.statusCode}) -> ${data}`);
            }
        });
    });

    req.on('error', (e) => { console.error(`   Error Koneksi: ${e.message}`); });
    req.end();
}

// --- MULAI TES VARIASI ---

// 1. Sesuai Dokumentasi (bank_code + account_number)
kirimRequest("Format Docs", "bank_code=bca&account_number=3910144366");

// 2. Format Docs dengan 'bank_' (kadang harus lengkap)
kirimRequest("Format Docs + Prefix", "bank_code=bank_bca&account_number=3910144366");

// 3. Format Alternatif 1 (bank + account)
kirimRequest("Alternatif Pendek", "bank=bca&account=3910144366");

// 4. Format Alternatif 2 (code + number)
kirimRequest("Alternatif Umum", "code=bca&number=3910144366");

// 5. Cek apakah WAJIB ada nama (validasi strict)
kirimRequest("Docs + Nama", "bank_code=bca&account_number=3910144366&name=Budi");