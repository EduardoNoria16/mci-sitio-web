const https = require('https');
https.get('https://imgbox.com/3D2Zh5mJ', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const match = data.match(/https:\/\/[a-z0-9]+\.imgbox\.com\/[a-z0-9]+\/[a-z0-9]+\/[a-zA-Z0-9]+_[o|t]\.(jpg|jpeg|png|gif)/gi);
    console.log(match);
  });
});
