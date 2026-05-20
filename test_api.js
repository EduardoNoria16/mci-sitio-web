import http from 'http';

const data = JSON.stringify({ userMsg: 'Hola' });

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/gemini/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
