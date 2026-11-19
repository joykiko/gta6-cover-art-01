import {spawn,execFileSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import {setTimeout as sleep} from 'node:timers/promises';
const chrome='/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome';
const server=spawn(process.execPath,['serve.ts','--port','8091'],{stdio:'ignore'});
let browser;
try {
 await mkdir('screenshots',{recursive:true});
 for(let i=0;i<50;i++){try{const r=await fetch('http://127.0.0.1:8091/');if(r.ok)break;}catch{}await sleep(100);}
 browser=spawn(chrome,['--headless=new','--remote-debugging-port=9222','--remote-allow-origins=*','--no-sandbox','--disable-gpu','--password-store=basic','--use-mock-keychain','--user-data-dir=/tmp/vice-coast-chrome'],{stdio:'ignore'});
 let version;
 for(let i=0;i<80;i++){try{version=await (await fetch('http://127.0.0.1:9222/json/version')).json();break;}catch{}await sleep(100);}
 if(!version)throw new Error('Chromium debugging endpoint did not start');
 const target=await (await fetch('http://127.0.0.1:9222/json/new?http://127.0.0.1:8091/',{method:'PUT'})).json();
 const socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
 let serial=0;const pending=new Map(),requests=new Set(),errors=[];
 socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(JSON.stringify(m.params.args));if(m.method==='Network.requestWillBeSent')requests.add(m.params.request.url);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}};
 const cdp=(method,params={})=>new Promise(resolve=>{const id=++serial;pending.set(id,resolve);socket.send(JSON.stringify({id,method,params}));});
 await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Network.enable');
 async function evaluate(expression){const response=await cdp('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(response.error||response.result?.exceptionDetails)throw new Error(JSON.stringify(response));return response.result?.result?.value;}
 const shots=[
  {file:'1-cover.jpg',w:1280,h:720,url:'?shot=cover&layout=3&grade=1&photo=boulevard&caption=MIDNIGHT%20BOULEVARD&sub=vice%20coast%20nights&size=1920x1080'},
  {file:'2-editor.jpg',w:1280,h:720,url:'?shot=editor&layout=4&grade=2&caption=GOLDEN%20HEIST'},
  {file:'3-cover-portrait.jpg',w:1024,h:1280,url:'?shot=cover&layout=1&grade=0&photo=boulevard&caption=GOLDEN%20HEIST&sub=vice%20coast%20gold&size=1080x1350'},
  {file:'4-cover-story.jpg',w:720,h:1280,url:'?shot=cover&layout=5&grade=4&photo=pier&caption=NEON%20TIDE&sub=vice%20coast%20nights&size=1080x1920'},
 ];
 for(const shot of shots){
  await cdp('Emulation.setDeviceMetricsOverride',{width:shot.w,height:shot.h,deviceScaleFactor:1,mobile:false});
  await cdp('Page.navigate',{url:`http://127.0.0.1:8091/${shot.url}`});
  let ready=false;for(let i=0;i<120;i++){try{ready=await evaluate('window.__shotReady === true');if(ready)break;}catch{}await sleep(100);}
  if(!ready)throw new Error(`Shot scene did not become ready: ${shot.file}`);
  await sleep(150);
  const image=await cdp('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});const png=`/tmp/vice-coast-${shot.file}.png`;await writeFile(png,Buffer.from(image.result.data,'base64'));execFileSync('python3',['-c',"from PIL import Image; import sys; Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2],format='JPEG',quality=80)",png,`screenshots/${shot.file}`]);
 }
 const verification=await evaluate(`(async()=>{
 const {drawCover,drawBadge,drawLettering}=await import('./src/cover.js');
 const {initialState,sizes}=await import('./src/state.js');
 const photos=await Promise.all(['boulevard','pier'].map(async name=>{const img=new Image();img.src='./samples/'+name+'.jpg';await img.decode();return img;}));
 const c=document.createElement('canvas');c.width=1080;c.height=1350;const ctx=c.getContext('2d');
 const lettering=[];
 for(const [w,h,caption,sub] of [[1080,1350,'GOLDEN HEIST','vice coast gold'],[1080,1920,'NEON TIDE','vice coast nights']]){
 c.width=w;c.height=h;const state={...initialState(),caption,sub};let ribbon=0,badge=0,subtitle=0;
 const fill=ctx.fillText.bind(ctx),rect=ctx.fillRect.bind(ctx);
 ctx.fillText=function(text,x,y,...args){if(text===sub)subtitle=this.measureText(text).width;if(text==='VICE COAST • EST. 2026')badge=this.measureText(text).width;return fill(text,x,y,...args);};
 ctx.fillRect=function(x,y,width,height){if(y===-h*.022)ribbon=width;return rect(x,y,width,height);};
 drawLettering(ctx,w,h,state);drawBadge(ctx,w,h);ctx.fillText=fill;ctx.fillRect=rect;
 if(subtitle>w*.85||badge+w*.024>ribbon+.001)throw Error('Lettering overflow');
 lettering.push({w,h,caption,sub,subtitleWidth:subtitle,subtitleLimit:w*.85,badgeTextWidth:badge,ribbonWidth:ribbon,padding:w*.024});
 }
 const layouts=[];c.width=1080;c.height=1080;
 for(let layout=0;layout<6;layout++){drawCover(c,photos,{...initialState(),layout});const blob=await new Promise(r=>c.toBlob(r,'image/png'));if(!blob?.size)throw Error('Empty layout');layouts.push({layout,bytes:blob.size});}
 const exports=[];for(const size of sizes){const result=await window.studio.exportPNG(size,false);if(result.width+'x'+result.height!==size||!result.bytes)throw Error('Invalid export');exports.push(result);}
 const preview=document.getElementById('cover');return {lettering,layouts,exports,preview:{width:preview.width,height:preview.height,painted:preview.getContext('2d').getImageData(0,0,1,1).data[3]===255}};
 })()`);
 console.log(JSON.stringify(verification,null,2));
 if(errors.length)throw new Error('Browser errors: '+errors.join('\n'));console.log('Browser console/runtime errors: '+errors.length);
 const nonLocal=[...requests].filter(url=>!url.startsWith('http://127.0.0.1:8091/')&&!url.startsWith('data:'));
 console.log(`CDP request count: ${requests.size}; non-local requests: ${nonLocal.length}`);if(nonLocal.length)throw new Error(nonLocal.join('\n'));
 socket.close();
} finally {if(browser)browser.kill('SIGTERM');server.kill('SIGTERM');}
