export const layouts = ['Full-Bleed Hero','Hero + 3 Panels','4-Panel Grid','5-Panel Mosaic','9-Panel Grid','Tilted Snapshot Collage'];
export const grades = ['Vice Sunset','Neon Night','Golden Hour','Teal Noir','Bubblegum Pop','Mono Heat'];
export const sizes = ['1080x1080','1080x1350','1920x1080','1080x1920'];
export function initialState() { return {layout:3,grade:1,caption:'MIDNIGHT BOULEVARD',sub:'vice coast nights',size:sizes[2],grain:true,halftone:true,vignette:true,gradient:true,selected:0,panels:Array.from({length:9},(_,i)=>({photo:i%2,x:0,y:0,zoom:1+(i%3)*.12,fit:false,flip:false}))}; }
export function createHistory(start) {
 let entries=[structuredClone(start)],index=0;
 return {save(s){const copy=structuredClone(s);if(JSON.stringify(copy)===JSON.stringify(entries[index]))return;entries=entries.slice(0,index+1);entries.push(copy);if(entries.length>80)entries.shift();index=entries.length-1;},undo(){if(index>0)return structuredClone(entries[--index]);},redo(){if(index<entries.length-1)return structuredClone(entries[++index]);},get canUndo(){return index>0;},get canRedo(){return index<entries.length-1;}};
}
