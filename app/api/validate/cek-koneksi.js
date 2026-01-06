const https = require('https');

// MASUKKAN API KEY TERBARU KAMU DISINI
const API_KEY = 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK'; 

// Fungsi Helper buat Request
function testRequest(label, path) {
    console.log(`\n--- [TES ${label}] ---`);
    console.log(`Target: https://use.api.co.id${path}`);
    
    const options = {
        hostname: 'use.api.co.id',
        path: path,
        method: 'GET',
        headers: {
            'x-api-co-id': API_KEY,
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            try {
                const json = JSON.parse(data);
                // Print hasil pendek aja biar gak nyepam
                const preview = JSON.stringify(json).substring(0, 150) + "...";
                console.log(`Response: ${preview}`);
                
                if(res.statusCode === 200) {
                    console.log("✅ KESIMPULAN: BERHASIL!");
                } else {
                    console.log("❌ KESIMPULAN: GAGAL (" + json.errors + ")");
                }
            } catch (e) {
                console.log("Response (Raw):", data);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Masalah Koneksi: ${e.message}`);
    });
    
    req.end();
}

// 1. TES KONEKSI & AUTH (Ambil daftar bank)
// Kalau ini gagal, berarti API Key salah atau Header ditolak.
testRequest("1. CEK LIST BANK", "/validation/bank/available");

// 2. TES VALIDASI (Format Dokumentasi)
// Kalau Tes 1 sukses tapi ini gagal, berarti nama parameternya salah.
testRequest("2. CEK REKENING (Format Docs)", "/validation/bank?bank_code=bca&account_number=3910144366");

// 3. TES VALIDASI (Format Alternatif)
// Siapa tau mereka update tapi docs belum ganti
testRequest("3. CEK REKENING (Alternatif)", "/validation/bank?bank=bca&account=3910144366");