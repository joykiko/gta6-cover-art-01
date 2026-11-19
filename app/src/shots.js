export function setupShot(state) {
 const q=new URLSearchParams(location.search);if(!q.has('shot'))return;
 if(q.get('shot')==='cover')document.body.classList.add('shot-cover');
 for(const key of ['layout','grade'])if(q.has(key))state[key]=Math.max(0,Math.min(5,Number(q.get(key))||0));
 for(const key of ['caption','sub'])if(q.has(key))state[key]=q.get(key);
 if(/^\d+x\d+$/.test(q.get('size')||''))state.size=q.get('size');
 if(q.has('photo'))state.panels.forEach((p,i)=>p.photo=q.get('photo')==='pier'?1:i%2);
}
export function markShotReady(){requestAnimationFrame(()=>requestAnimationFrame(()=>{window.__shotReady=true;}));}
