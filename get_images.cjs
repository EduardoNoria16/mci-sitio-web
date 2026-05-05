const https = require('https');
const urls = [
'https://imgbox.com/11CzweNC',
'https://imgbox.com/yafusRh6',
'https://imgbox.com/Tx87QuK5',
'https://imgbox.com/MCULxQ13',
'https://imgbox.com/UQ9GWU5Z',
'https://imgbox.com/JnAlD4Yi',
'https://imgbox.com/0elveuO1',
'https://imgbox.com/wNqg3dc8',
'https://imgbox.com/vdT1ol4l',
'https://imgbox.com/lVkyVmQ5',
'https://imgbox.com/FkoFNa4f',
'https://imgbox.com/FGx7wPRA',
'https://imgbox.com/JbvQhLny',
'https://imgbox.com/MNhTRWgC'
];

urls.forEach(url => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/<img[^>]+id="img"[^>]+src="([^"]+)"/);
      if(match) console.log(url + ' -> ' + match[1]);
      else console.log(url + ' -> Not found');
    });
  });
});
