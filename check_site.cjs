const https = require('https');

https.get('https://www.polycovers.mx/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (match) {
      console.log('Script URL:', match[1]);
      https.get('https://www.polycovers.mx' + match[1], (res2) => {
        let scriptData = '';
        res2.on('data', chunk => scriptData += chunk);
        res2.on('end', () => {
          const links = scriptData.match(/"[^"]*antes_[^"]*"/g);
          console.log('Matches:', links);
        });
      });
    } else {
      console.log('No script found');
    }
  });
});
