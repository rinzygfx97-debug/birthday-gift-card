const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=390,844',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get('http://localhost:9222/json', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      try {
        const list = JSON.parse(d);
        const target = list.find(t => t.url.includes('5173')) || list[0];
        console.log('Target Page:', target.webSocketDebuggerUrl);

        // Connect via built-in WebSocket
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
          console.log('WS Connected to Edge!');
          await send('Page.enable');
          await send('Runtime.enable');

          // Check title & body classes
          const eval1 = await send('Runtime.evaluate', { expression: 'document.title' });
          console.log('Page Title:', eval1.result.value);

          // Click Click Here button
          console.log('Triggering Click Here button...');
          await send('Runtime.evaluate', { expression: 'document.getElementById("giftButton").click();' });

          // Wait 3 seconds
          console.log('Waiting 3.5s for bloom phases...');
          await new Promise(r => setTimeout(r, 3500));

          let bodyClasses = await send('Runtime.evaluate', { expression: 'document.body.className' });
          console.log('Body classes at 3.5s:', bodyClasses.result.value);

          // Wait another 3.5s for full bloom
          console.log('Waiting another 3.5s for full bloom...');
          await new Promise(r => setTimeout(r, 3500));

          bodyClasses = await send('Runtime.evaluate', { expression: 'document.body.className' });
          console.log('Body classes at 7s:', bodyClasses.result.value);

          const bloomMsg = await send('Runtime.evaluate', { 
            expression: 'const el = document.getElementById("bloomCenterMessage"); ({ active: el.classList.contains("active"), opacity: getComputedStyle(el).opacity, text: el.innerText })' 
          });
          console.log('Bloom Message State:', bloomMsg.result.value);

          // Capture Screenshot of bloomed garden
          const snap1 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('screenshot_bloomed.png', Buffer.from(snap1.data, 'base64'));
          console.log('Saved screenshot_bloomed.png');

          // Scroll down to Moment 1 and check Cat 1
          console.log('Scrolling down to Moment 1 (Cat 1)...');
          await send('Runtime.evaluate', { expression: 'document.getElementById("moment1").scrollIntoView();' });
          await new Promise(r => setTimeout(r, 1500));

          const cat1State = await send('Runtime.evaluate', {
            expression: `const m = document.getElementById("moment1");
              const img = m.querySelector("img");
              const timed = m.querySelector(".timed-cat-reveal");
              ({
                inView: m.querySelector(".moment-inner").classList.contains("in-view"),
                catVisible: timed.classList.contains("cat-visible"),
                opacity: getComputedStyle(timed).opacity,
                imgNaturalWidth: img.naturalWidth,
                imgSrc: img.src
              })`
          });
          console.log('Cat 1 State:', cat1State.result.value);

          const snap2 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('screenshot_cat1.png', Buffer.from(snap2.data, 'base64'));
          console.log('Saved screenshot_cat1.png');

          // Scroll down to Moment 4 (Cat 4) and Finale
          console.log('Scrolling down to Moment 4 (Cat 4)...');
          await send('Runtime.evaluate', { expression: 'document.getElementById("moment4").scrollIntoView();' });
          await new Promise(r => setTimeout(r, 1500));

          const cat4State = await send('Runtime.evaluate', {
            expression: `const m = document.getElementById("moment4");
              const img = m.querySelector("img");
              const timed = m.querySelector(".timed-cat-reveal");
              ({
                inView: m.querySelector(".moment-inner").classList.contains("in-view"),
                catVisible: timed.classList.contains("cat-visible"),
                opacity: getComputedStyle(timed).opacity,
                imgNaturalWidth: img.naturalWidth,
                imgSrc: img.src
              })`
          });
          console.log('Cat 4 State:', cat4State.result.value);

          const snap3 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('screenshot_cat4.png', Buffer.from(snap3.data, 'base64'));
          console.log('Saved screenshot_cat4.png');

          ws.close();
          edge.kill();
          process.exit(0);
        });

      } catch (err) {
        console.error('Error:', err);
        edge.kill();
        process.exit(1);
      }
    });
  });
}

main();
