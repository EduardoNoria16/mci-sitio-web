const https = require('https');

https.get('https://postimg.cc/m1Zggty0', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const match = data.match(/<meta property="og:image" content="([^"]+)"/);
    if (match && match[1]) {
      console.log("FOUND_URL:", match[1]);
    } else {
      console.log("URL_NOT_FOUND");
    }
  });
}).on('error', (err) => {
  console.log("ERROR:", err.message);
});
