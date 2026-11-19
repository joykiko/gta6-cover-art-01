import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./app/',import.meta.url));
const position=process.argv.indexOf('--port');
const port=position<0?8080:Number(process.argv[position+1]);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.json':'application/json'};
createServer((req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(!file.startsWith(resolve(root)+sep)){res.writeHead(403).end();return;}const body=readFileSync(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);}catch{res.writeHead(404).end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Vice Coast listening on ${port}`));
