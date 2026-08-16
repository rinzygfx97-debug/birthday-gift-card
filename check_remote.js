const https = require('https');

https.get('https://rinzygfx97-debug.github.io/birthday-gift-card/?nocache=' + Date.now(), {
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Includes fix_scroll_v2:', d.includes('fix_scroll_v2'));
    console.log('Includes clickable scroll hint:', d.includes('storyScrollHint'));
    console.log('Includes 400 700 canvas:', d.includes('viewBox="0 0 400 700"'));
  });
});
