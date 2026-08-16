const https = require('https');

https.get('https://rinzygfx97-debug.github.io/birthday-gift-card/', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Length:', d.length);
    console.log('Includes 400 700 canvas:', d.includes('viewBox="0 0 400 700"'));
    console.log('Version query:', d.includes('v=20260816_v5'));
  });
});
