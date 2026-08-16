const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    '--window-size=390,844',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get('http://localhost:9223/json', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      try {
        const list = JSON.parse(d);
        const target = list.find(t => t.url.includes('5173')) || list[0];
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
          console.log('--- STARTING FULL USER EXPERIENCE AUDIT ---');
          await send('Page.enable');
          await send('Runtime.enable');

          // 1. Initial Opening Screen
          const snap0 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('audit_01_opening.png', Buffer.from(snap0.data, 'base64'));
          console.log('1. Captured audit_01_opening.png');

          // 2. Click "Click Here"
          await send('Runtime.evaluate', { expression: 'document.getElementById("giftButton").click();' });
          console.log('2. Clicked giftButton, waiting 7s for full bloom...');
          await new Promise(r => setTimeout(r, 7000));

          // Capture Bloomed Garden
          const snap1 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('audit_02_bloomed.png', Buffer.from(snap1.data, 'base64'));
          console.log('3. Captured audit_02_bloomed.png');

          // 3. Scroll to Heartfelt Message
          await send('Runtime.evaluate', { expression: 'document.getElementById("sectionHeartfelt").scrollIntoView({ behavior: "instant" });' });
          await new Promise(r => setTimeout(r, 1200));
          const snap2 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('audit_03_heartfelt.png', Buffer.from(snap2.data, 'base64'));
          console.log('4. Captured audit_03_heartfelt.png');

          // 4. Scroll to Cat 1
          await send('Runtime.evaluate', { expression: 'document.getElementById("moment1").scrollIntoView({ behavior: "instant" });' });
          await new Promise(r => setTimeout(r, 1200));
          const snap3 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('audit_04_cat1.png', Buffer.from(snap3.data, 'base64'));
          console.log('5. Captured audit_04_cat1.png');

          // 5. Scroll to Cat 2
          await send('Runtime.evaluate', { expression: 'document.getElementById("moment2").scrollIntoView({ behavior: "instant" });' });
          await new Promise(r => setTimeout(r, 1200));
          const snap4 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('audit_05_cat2.png', Buffer.from(snap4.data, 'base64'));
          console.log('6. Captured audit_05_cat2.png');

          // 6. Scroll to Cat 3
          await send('Runtime.evaluate', { expression: 'document.getElementById("moment3").scrollIntoView({ behavior: "instant" });' });
          await new Promise(r => setTimeout(r, 1200));
          const snap5 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('audit_06_cat3.png', Buffer.from(snap5.data, 'base64'));
          console.log('7. Captured audit_06_cat3.png');

          // 7. Scroll to Cat 4 (Cat Pat) & Finale
          await send('Runtime.evaluate', { expression: 'document.getElementById("moment4").scrollIntoView({ behavior: "instant" });' });
          await new Promise(r => setTimeout(r, 1200));
          const snap6 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('audit_07_cat4.png', Buffer.from(snap6.data, 'base64'));
          console.log('8. Captured audit_07_cat4.png');

          // 8. Scroll to Finale
          await send('Runtime.evaluate', { expression: 'document.getElementById("sectionFinale").scrollIntoView({ behavior: "instant" });' });
          await new Promise(r => setTimeout(r, 1200));
          const snap7 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('audit_08_finale.png', Buffer.from(snap7.data, 'base64'));
          console.log('9. Captured audit_08_finale.png');

          console.log('--- AUDIT COMPLETE: ALL 8 STAGES CAPTURED SUCCESSFULLY ---');
          ws.close();
          edge.kill();
          process.exit(0);
        });
      } catch (e) {
        console.error('Audit Error:', e);
        edge.kill();
        process.exit(1);
      }
    });
  });
}

main();
