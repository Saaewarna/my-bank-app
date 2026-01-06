const https = require('https');

const API_KEY = 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK'; 

function request(label, method, path, body = null) {
    console.log(`\n--- [TES ${label}] ---`);
    
    const options = {
        hostname: 'use.api.co.id',
        path: path,
        method: method,
        headers: {
            'x-api-co-id': API_KEY,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0' // Pura-pura jadi browser
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Response: ${data.substring(0, 200)}...`); 
        });
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
}

// TES A: Pakai "bank_bca" (bukan bca doang)
request("A. GET (Kode Bank Lengkap)", "GET", "/validation/bank?bank_code=bank_bca&account_number=3910144366");

// TES B: Tambah parameter 'name' (Siapa tau wajib)
request("B. GET (Tambah Nama)", "GET", "/validation/bank?bank_code=bca&account_number=3910144366&name=Budi");

// TES C: Metode POST (Sesuai dugaan awal)
request("C. POST Method", "POST", "/validation/bank", {
    bank_code: "bca",
    account_number: "3910144366",
    name: "Test"
});