const https = require('https');

// GANTI INI DENGAN API KEY KAMU YANG BENAR
const API_KEY = 'UoO1JoFkgaPwL8wAdYNuv7OdVMDlqk3uymvEehEuESV9DvU1pK'; 

const bankCode = 'bca';
const accountNo = '3910144366';

// Kita coba URL yang paling standar sesuai dokumentasi
const url = `https://use.api.co.id/validation/bank?bank_code=${bankCode}&account_number=${accountNo}`;

console.log("Mencoba request ke:", url);

const options = {
  method: 'GET',
  headers: {
    'x-api-co-id': API_KEY,
    'Accept': 'application/json' // Kita perjelas kita mau JSON
  }
};

const req = https.request(url, options, (res) => {
  let data = '';

  console.log(`Status Code: ${res.statusCode}`);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:', data);
  });
});

req.on('error', (e) => {
  console.error(`Masalah request: ${e.message}`);
});

req.end();