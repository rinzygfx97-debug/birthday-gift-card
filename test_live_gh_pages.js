const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9224',
    '--window-size=390,844',
    'https://rinzygfx97-debug.github.io/birthday-gift-card/?v=' + Date.now()
  ]);

  await new Promise(r => setTimeout(r, 2500));

  http.get('http://localhost:9224/json', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      try {
        const list = JSON.parse(d);
        const target = list.find(t => t.url.includes('github.io')) || list[0];
        const ws = new WebSocket(target.webSocketDebuggerUrl);

        let id = 1;
        function send(method, params = {}) {
          return new Promise(resolve => {
            const currentId = id++;
            const listener = (event) => {
              const parsed = JSON.parse(event.data);
              if (parsed.id === currentId) {
                ws.removeEventListener('message', listener);
                resolve(parsed.result);
              }
            };
            ws.addEventListener('message', listener);
            ws.send(JSON.stringify({ id: currentId, method, params }));
          });
        }

        ws.addEventListener('open', async () => {
          console.log('WS connected to live GitHub Pages instance in Edge!');
          await send('Page.enable');
          await send('Runtime.enable');

          // Capture Initial Opening Screen on GitHub Pages
          const snap0 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('live_gh_pages_01_card.png', Buffer.from(snap0.data, 'base64'));
          console.log('Saved live_gh_pages_01_card.png');

          // Click the button
          await send('Runtime.evaluate', { expression: 'document.getElementById("giftButton").click();' });
          console.log('Clicked button, waiting 5.5s for bloom...');
          await new Promise(r => setTimeout(r, 5500));

          const snap1 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('live_gh_pages_02_bloomed.png', Buffer.from(snap1.data, 'base64'));
          console.log('Saved live_gh_pages_02_bloomed.png');

          // Scroll down to Moment 1 (Cat 1)
          await send('Runtime.evaluate', { expression: 'document.getElementById("moment1").scrollIntoView();' });
          await new Promise(r => setTimeout(r, 1500));

          const snap2 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('live_gh_pages_03_cat1.png', Buffer.from(snap2.data, 'base64'));
          console.log('Saved live_gh_pages_03_cat1.png');

          // Scroll down to Moment 4 (Cat 4)
          await send('Runtime.evaluate', { expression: 'document.getElementById("moment4").scrollIntoView();' });
          await new Promise(r => setTimeout(r, 1500));

          const snap3 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('live_gh_pages_04_cat4.png', Buffer.from(snap3.data, 'base64'));
          console.log('Saved live_gh_pages_04_cat4.png');

          ws.close();
          edge.kill();
          process.exit(0);
        });
      } catch (e) {
        console.error('Error:', e);
        edge.kill();
        process.exit(1);
      }
    });
  });
}

main();
