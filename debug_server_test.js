const http = require('http');

function makeRequest(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (body) {
            options.headers['Content-Length'] = Buffer.byteLength(body);
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: data
                });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(body);
        }
        req.end();
    });
}

async function run() {
    console.log("--- Testing Backend Connectivity ---");

    // 1. Test GET Users
    try {
        console.log("1. GET /api/admin/users");
        const res = await makeRequest('/api/admin/users');
        console.log(`   Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
            const users = JSON.parse(res.body);
            console.log(`   Success! Found ${users.length} users.`);
            console.log(`   Sample: ${users[0]?.email}`);
        } else {
            console.log(`   Failed: ${res.body}`);
        }
    } catch (e) {
        console.error("   Request Failed:", e.message);
    }

    // 2. Test POST Ban User (Invalid UID)
    try {
        console.log("\n2. POST /api/admin/ban-user (Invalid UID)");
        const payload = JSON.stringify({ uid: "TEST_INVALID_UID", disabled: true });
        const res = await makeRequest('/api/admin/ban-user', 'POST', payload);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Body: ${res.body}`);
    } catch (e) {
        console.error("   Request Failed:", e.message);
    }
}

run();
