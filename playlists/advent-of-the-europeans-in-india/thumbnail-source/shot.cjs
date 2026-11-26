const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for (const [s,f] of [[1,'thumb-1280.png'],[3,'thumb-3840.png']]){const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:s});
await p.goto('file://'+process.cwd()+'/thumb.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);await p.screenshot({path:f});await p.close();}
await b.close();})();
