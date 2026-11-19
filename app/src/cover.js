const palettes=[['#21143d','#f05a88','#ffca82'],['#090e38','#ab3f9b','#5df7e7'],['#231d36','#d57b42','#ffe6a1'],['#041c29','#287b80','#b4e6c7'],['#38285a','#f472bf','#a7eff8'],['#140d21','#8c4459','#fff0c7']];
export function panelGeometry(layout) {
 if(layout===0)return [[0,0,1,1]];
 if(layout===1)return [[0,0,.66,1],[.66,0,.34,.34],[.66,.34,.34,.33],[.66,.67,.34,.33]];
 if(layout===2)return [[0,0,.5,.5],[.5,0,.5,.5],[0,.5,.5,.5],[.5,.5,.5,.5]];
 if(layout===3)return [[0,0,.27,.53],[.27,0,.46,.72],[.73,0,.27,.43],[0,.53,.27,.47],[.73,.43,.27,.57]];
 if(layout===4)return Array.from({length:9},(_,i)=>[(i%3)/3,Math.floor(i/3)/3,1/3,1/3]);
 return [[.02,.03,.58,.62,-.065],[.53,.03,.43,.43,.09],[.07,.55,.48,.43,.055],[.54,.48,.43,.48,-.08]];
}
export function applyGrade(ctx,w,h,grade,index) {
 const p=palettes[grade],g=ctx.createLinearGradient(0,0,w*.7,h);g.addColorStop(0,p[2]);g.addColorStop(.52,p[1]);g.addColorStop(1,p[0]);ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=.78;ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.16;ctx.fillStyle=p[index%3];ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
}
export function drawPanel(ctx,photo,panel,rect,state,index,w,h) {
 const [rx,ry,rw,rh,angle=0]=rect,x=rx*w,y=ry*h,pw=rw*w,ph=rh*h,gap=Math.min(w,h)*.009;
 ctx.save();ctx.translate(x+pw/2,y+ph/2);ctx.rotate(angle);ctx.shadowColor='#050714';ctx.shadowBlur=angle?20:0;ctx.fillStyle='#080b1a';ctx.fillRect(-pw/2,-ph/2,pw,ph);ctx.shadowBlur=0;ctx.fillStyle='#fff2da';ctx.fillRect(-pw/2+gap/2,-ph/2+gap/2,pw-gap,ph-gap);ctx.beginPath();ctx.rect(-pw/2+gap,-ph/2+gap,pw-gap*2,ph-gap*2);ctx.clip();ctx.translate(-pw/2,-ph/2);
 ctx.fillStyle=palettes[state.grade][0];ctx.fillRect(0,0,pw,ph);
 if(photo){const scale=(panel.fit?Math.min:Math.max)(pw/photo.naturalWidth,ph/photo.naturalHeight)*panel.zoom;const iw=photo.naturalWidth*scale,ih=photo.naturalHeight*scale;ctx.save();ctx.translate(pw/2+panel.x*pw,ph/2+panel.y*ph);ctx.scale(panel.flip?-1:1,1);ctx.filter=state.grade===5?'grayscale(1) contrast(1.4)':'saturate(1.25) contrast(1.16)';ctx.drawImage(photo,-iw/2,-ih/2,iw,ih);ctx.restore();}
 applyGrade(ctx,pw,ph,state.grade,index);
 const shade=ctx.createLinearGradient(0,0,0,ph);shade.addColorStop(0,'#070b2122');shade.addColorStop(.55,'#070b2100');shade.addColorStop(1,'#070b2177');ctx.fillStyle=shade;ctx.fillRect(0,0,pw,ph);
 ctx.fillStyle='#fff0ce';ctx.font=`700 ${Math.min(w,h)*.014}px sans-serif`;ctx.fillText(['01 / THE COAST','02 / AFTER HOURS','03 / NO LIMITS','04 / PALM DISTRICT','05 / STAY GOLD'][index%5],gap*3,ph-gap*3);ctx.restore();
}
export function drawBadge(ctx,w,h) {
 const text='VICE COAST • EST. 2026',padding=w*.012;
 ctx.save();ctx.translate(w*.045,h*.057);ctx.rotate(-.025);ctx.font=`900 ${Math.min(w*.019,h*.024)}px "Noto Sans", sans-serif`;const ribbonWidth=ctx.measureText(text).width+padding*2;ctx.fillStyle='#ffe79a';ctx.fillRect(0,-h*.022,ribbonWidth,h*.041);ctx.fillStyle='#111323';ctx.fillText(text,padding,h*.007);ctx.restore();
 ctx.fillStyle='#fff4db';ctx.textAlign='right';ctx.font=`700 ${Math.min(w,h)*.018}px sans-serif`;ctx.fillText('VOL. 01  /  SOUTH SIDE',w*.954,h*.06);ctx.textAlign='left';
}
export function drawLettering(ctx,w,h,state) {
 const portrait=h>w,base=portrait?h*.72:h*.63;
 const fade=ctx.createLinearGradient(0,base-h*.1,0,h);fade.addColorStop(0,'#080b1800');fade.addColorStop(.45,'#080b18dd');fade.addColorStop(1,'#080b18');ctx.fillStyle=fade;ctx.fillRect(0,base-h*.1,w,h);
 if(state.halftone){ctx.fillStyle='#f6a7ca27';const step=Math.max(7,w/115);for(let y=base;y<h;y+=step)for(let x=0;x<w;x+=step){ctx.beginPath();ctx.arc(x,y,1.2,0,Math.PI*2);ctx.fill();}}
 const words=state.caption.trim().toUpperCase().split(/\s+/);let lines=words.length>1?[words.slice(0,Math.ceil(words.length/2)).join(' '),words.slice(Math.ceil(words.length/2)).join(' ')]:[words[0]||'VICE COAST'];
 const areaH=h-base;let fs=Math.min(w*.16,areaH*.39);ctx.font=`900 ${fs}px "Noto Sans Display", "DejaVu Sans", sans-serif`;
 const max=Math.max(...lines.map(l=>ctx.measureText(l).width));const sx=Math.min(.79,w*.88/max);ctx.save();ctx.translate(w*.055,base+areaH*.31);ctx.transform(sx,0,-.045,1,0,0);ctx.lineJoin='round';ctx.strokeStyle='#080b18';ctx.lineWidth=fs*.075;ctx.shadowColor='#000';ctx.shadowOffsetY=fs*.035;
 lines.forEach((line,i)=>{const y=i*fs*.87;ctx.strokeText(line,0,y);const g=ctx.createLinearGradient(0,y-fs,0,y);g.addColorStop(0,'#fffde8');g.addColorStop(.53,'#fff8df');g.addColorStop(1,'#ff8eac');ctx.fillStyle=state.gradient?g:'#fff8eb';ctx.fillText(line,0,y);});ctx.restore();
 ctx.save();ctx.translate(w*.93,h*.93);ctx.rotate(-.065);ctx.textAlign='right';let subtitleSize=Math.min(w*.065,h*.047);const subtitleWidth=w*.85;const subtitleFont=()=>`italic 700 ${subtitleSize}px "Noto Serif", "DejaVu Serif", serif`;ctx.font=subtitleFont();while(ctx.measureText(state.sub).width>subtitleWidth){subtitleSize*=.98;ctx.font=subtitleFont();}ctx.shadowColor='#ff4caa';ctx.shadowBlur=12;ctx.strokeStyle='#351b48';ctx.lineWidth=3;ctx.strokeText(state.sub,0,0);ctx.fillStyle='#ffa6d4';ctx.fillText(state.sub,0,0);ctx.restore();
 ctx.fillStyle='#ffe8b8';ctx.font=`600 ${Math.min(w,h)*.012}px sans-serif`;ctx.fillText('A POSTCARD FROM THE WILD SIDE',w*.056,h*.974);
}
export function drawCover(canvas,photos,state) {
 const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.fillStyle='#0b1023';ctx.fillRect(0,0,w,h);
 panelGeometry(state.layout).forEach((r,i)=>drawPanel(ctx,photos[state.panels[i].photo%photos.length],state.panels[i],r,state,i,w,h));
 if(state.vignette){const v=ctx.createRadialGradient(w/2,h*.4,w*.1,w/2,h*.5,Math.max(w,h)*.7);v.addColorStop(0,'#0000');v.addColorStop(1,'#05051b99');ctx.fillStyle=v;ctx.fillRect(0,0,w,h);}
 if(state.grain){ctx.fillStyle='#fff5df';ctx.globalAlpha=.08;let seed=81;for(let i=0;i<6000;i++){seed=(seed*16807)%2147483647;const x=seed%w;seed=(seed*16807)%2147483647;ctx.fillRect(x,seed%h,1.5,1.5);}ctx.globalAlpha=1;}
 drawLettering(ctx,w,h,state);drawBadge(ctx,w,h);ctx.strokeStyle='#fff0d8';ctx.lineWidth=Math.min(w,h)*.008;ctx.strokeRect(ctx.lineWidth/2,ctx.lineWidth/2,w-ctx.lineWidth,h-ctx.lineWidth);
}
