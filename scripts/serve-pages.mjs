import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {dirname,extname,join,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {serverPort} from './server-port.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../out');
const base=process.env.NEXT_PUBLIC_BASE_PATH??'/Routewise';
const port=serverPort(process.env.PORT);
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'};
createServer(async(req,res)=>{
  try {
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname===base){res.writeHead(302,{location:`${base}/`});res.end();return;}
    if(!pathname.startsWith(`${base}/`)){res.writeHead(404);res.end();return;}
    const path=resolve(root,pathname.slice(base.length+1));
    if(path!==root&&!path.startsWith(root+sep)){res.writeHead(404);res.end();return;}
    const file=(await stat(path)).isDirectory()?join(path,'index.html'):path;
    const content=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]??'application/octet-stream'});res.end(content);
  } catch {res.writeHead(404);res.end();}
}).listen(port,'127.0.0.1',()=>console.log(`Static Pages test server on port ${port}`));
