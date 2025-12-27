const http = require('http');

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'GET'
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        });
        req.on('error', reject);
        req.end();
    });
}

async function run() {
    console.log("Testing /api/admin/businesses...");
    try {
        const res = await makeRequest('/api/admin/businesses');
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Body: ${res.body}`);
    } catch (e) {
        console.error("Connection Failed:", e.message);
    }
}

run();
