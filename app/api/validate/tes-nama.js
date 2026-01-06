const https = require('https');

// API Key VALID kamu
const API_KEY = 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK';

function cek(label, params) {
    console.log(`\n🕵️ [TES: ${label}]`);
    console.log(`   URL: .../bank?${params}`);

    const options = {
        hostname: 'use.api.co.id',
        path: `/validation/bank?${params}`,
        method: 'GET',
        headers: {
            'x-api-co-id': API_KEY,
            'Accept': 'application/json'
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log(`   ✅ BERHASIL! (Nama Parameter Ketemu!)`);
                console.log(`   Response: ${data.substring(0, 100)}...`);
            } else {
                console.log(`   ❌ Gagal (${res.statusCode})`);
            }
        });
    });
    req.end();
}

// Data Test: BCA, Rekening Valid, Nama Asal (buat mancing)
const base = "bank_code=bca&account_number=3910144366";

// 1. Coba parameter 'account_name' (Sangat mungkin ini)
cek("Param: account_name", `${base}&account_name=TesUser`);

// 2. Coba parameter 'holder_name'
cek("Param: holder_name", `${base}&holder_name=TesUser`);

// 3. Coba tanpa nama tapi pakai 'bank_bca' (siapa tau prefix ngaruh)
cek("Prefix bank_bca", "bank_code=bank_bca&account_number=3910144366");