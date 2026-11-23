/* Dateimusik (MP3 aus audio/): Menue, Kampagne, Schlacht */
/* ===== Dateimusik (v0.16): Menue, Kampagne und (optional) Schlacht aus eingebetteten MP3 =====
   Die Stuecke liegen als Base64 in den <script id="mus_NAME"> Bloecken. Neues Lied: Block ergaenzen und in MTR eintragen.
   Welches Stueck wo laeuft, waehlt der Spieler im Hauptmenue unter Musik (gespeichert in OPT.mus). MUSIC ist nur die Standardzuordnung.
   Ohne Haken spielt wie bisher die Synth-Musik. Bewusst einfache Audio-Elemente (kein createMediaElementSource):
   das gibt beim Oeffnen per file:// sonst Stille. */
const MTR=[
 {id:'menu_fantasy',t:'Fantasy-Grundmusik',by:'migfus20',d:287},
 {id:'menu_kriegsherr',t:'Der Hornruf',by:'Claude (synthetisch)',d:86},
 {id:'humans_1_knights',t:'Ritterburg',by:'Gertraut Hecher',d:39},
 {id:'humans_2_minstrels',t:'Gaukler und Spielleute',by:'Gertraut Hecher',d:40},
 {id:'humans_3_military',t:'Kurzes Militärstück',by:'Sonically Sound',d:21},
 {id:'humans_4_choral',t:'Laute und Choral',by:'Claude (synthetisch)',d:93},
 {id:'elves_1_harp',t:'Harfen-Arpeggio',by:'Gertraut Hecher',d:43},
 {id:'elves_2_elven',t:'Elfenstimme, romantisch',by:'ElvenVoice',d:43},
 {id:'elves_3_ambient',t:'Ambient',by:'giangallegos',d:53},
 {id:'elves_4_lichtung',t:'Waldlichtung',by:'Claude (synthetisch)',d:71},
 {id:'orcs_1_march',t:'Mittelalterlicher Marsch',by:'g-14',d:78},
 {id:'orcs_2_various',t:'Mittelalter-Mix',by:'zhr',d:76},
 {id:'orcs_3_kriegsgesang',t:'Kriegsgesang',by:'Claude (synthetisch)',d:115},
 {id:'dwarves_1_norse',t:'Realm of the Norse',by:'the_ramdom_cheese',d:131},
 {id:'dwarves_2_saltarello',t:'Saltarello',by:'Gertraut Hecher',d:50},
 {id:'dwarves_3_halle',t:'Halle unter dem Berg',by:'Claude (synthetisch)',d:101},
 {id:'undead_1_ancient',t:'Ancient',by:'setuniman',d:33},
 {id:'undead_2_augustin',t:'Ach du lieber Augustin (Moll)',by:'hamsel',d:25},
 {id:'undead_3_harpsi',t:'Cembalo-Melodie',by:'fallight',d:12},
 {id:'undead_4_glocke',t:'Totenglocke',by:'Claude (synthetisch)',d:106},
 {id:'undead_5_gruft',t:'Gruft der Mönche',by:'Mix aus Freesound-Stücken',d:75},
 {id:'undead_6_hain',t:'Der verfluchte Hain',by:'Mix aus Freesound-Stücken',d:75},
 {id:'orcs_4_horde',t:'Donner der Horde',by:'Mix aus Freesound-Stücken',d:75},
 {id:'dwarves_4_tiefe',t:'Gesang der Tiefe',by:'Mix aus Freesound-Stücken',d:75},
 {id:'battle_viking',t:'Wikinger-Schlachtlied',by:'Mark Murray',d:90}];
const MUSIC={
 menu:['menu_fantasy','menu_kriegsherr','humans_4_choral','elves_4_lichtung','orcs_3_kriegsgesang','dwarves_3_halle','undead_4_glocke','orcs_4_horde','dwarves_1_norse','undead_5_gruft'],
 humans:['humans_1_knights','humans_2_minstrels','humans_3_military','humans_4_choral','menu_kriegsherr'],
 elves:['elves_1_harp','elves_2_elven','elves_3_ambient','elves_4_lichtung'],
 orcs:['orcs_1_march','orcs_2_various','orcs_3_kriegsgesang','orcs_4_horde'],
 dwarves:['dwarves_1_norse','dwarves_2_saltarello','dwarves_3_halle','dwarves_4_tiefe'],
 undead:['undead_1_ancient','undead_2_augustin','undead_3_harpsi','undead_4_glocke','undead_5_gruft','undead_6_hain']};
/* v0.19: Haupttheme je Fraktion. Es spielt als erstes Stueck, wenn man die Kampagnenkarte neu betritt (nicht nach einer Schlacht). Danach Shuffle. */
const MAIN={humans:'menu_kriegsherr',elves:'elves_4_lichtung',orcs:'orcs_4_horde',dwarves:'dwarves_1_norse',undead:'undead_5_gruft'};
var FM={cfg:{x:0,quick:.35,out:.2,inn:.4,gain:1.4},els:[null,null],g:[0,0],fade:[null,null],cur:-1,key:null,mode:null,fk:null,list:null,idx:0,on:false,hidden:false,mem:{},urls:{},bad:{},tm:null,sel:null,hold:false,dirty:false,pvSynth:false,pv:{e:null,id:null}};
function fmDefSel(){const s={menu:MUSIC.menu.slice(),camp:{},battle:{}};for(const k of['humans','elves','orcs','dwarves','undead']){s.camp[k]=(MUSIC[k]||[]).slice();s.battle[k]=['battle_viking']}return s}
function fmSel(){ // Auswahl aus den Optionen, sonst Standard
 if(FM.sel)return FM.sel;
 const s=fmDefSel(),ids=MTR.map(x=>x.id),ok=a=>Array.isArray(a)?a.filter(x=>ids.includes(x)):null;
 try{const o=OPT.mus;if(o&&typeof o==='object'){
  const m=ok(o.menu);if(m)s.menu=m;
  for(const k in s.camp){const c=o.camp&&ok(o.camp[k]);if(c)s.camp[k]=c;const b=o.battle&&ok(o.battle[k]);if(b)s.battle[k]=b}}}catch(e){}
 FM.sel=s;
 try{if(OPT.mus&&(OPT.musv||0)<17){const nw={menu:['menu_kriegsherr','humans_4_choral','elves_4_lichtung','orcs_3_kriegsgesang','dwarves_3_halle','undead_4_glocke'],humans:['humans_4_choral'],elves:['elves_4_lichtung'],orcs:['orcs_3_kriegsgesang'],dwarves:['dwarves_3_halle'],undead:['undead_4_glocke']};
  nw.menu.forEach(i=>{if(!s.menu.includes(i))s.menu.push(i)});for(const k in s.camp)nw[k].forEach(i=>{if(!s.camp[k].includes(i))s.camp[k].push(i)});OPT.musv=17;OPT.mus=s;saveOpt()}}catch(e){}
 try{if(OPT.mus&&(OPT.musv||0)<19){const nw={menu:['orcs_4_horde','dwarves_1_norse','undead_5_gruft'],humans:['menu_kriegsherr'],elves:[],orcs:['orcs_4_horde'],dwarves:['dwarves_4_tiefe'],undead:['undead_5_gruft','undead_6_hain']};
  nw.menu.forEach(i=>{if(!s.menu.includes(i))s.menu.push(i)});for(const k in s.camp)nw[k].forEach(i=>{if(!s.camp[k].includes(i))s.camp[k].push(i)});OPT.musv=19;OPT.mus=s;saveOpt()}}catch(e){}
 try{if(OPT.mus&&(OPT.musv||0)<22){for(const k in s.battle)if(!s.battle[k].includes('battle_viking'))s.battle[k].push('battle_viking');OPT.musv=22;OPT.mus=s;saveOpt()}}catch(e){}
 return s}
function fmSaveSel(){try{OPT.mus=FM.sel;saveOpt()}catch(e){}}
function fmHas(id){return MTR.some(x=>x.id===id)}
function fmUrl(id){ // Lieder liegen als MP3-Dateien im Ordner audio/
 if(!fmHas(id))return null;
 return FM.urls[id]||(FM.urls[id]='audio/'+id+'.mp3')
}
function fmEl(i){
 if(!FM.els[i]){const e=new Audio();e.preload='auto';
  e.addEventListener('ended',()=>{if(FM.cur===i&&FM.on)fmNext(0)});
  e.addEventListener('error',()=>{if(FM.cur===i&&FM.on)fmFail()});
  FM.els[i]=e}
 return FM.els[i]}
function fmLevel(){return Math.min(1,AU.opt.music*FM.cfg.gain)*fmDk()*(FM.mode==='battle'?BATTLE_GAIN:1)}
function fmApply(i){const e=FM.els[i];if(e){const v=Math.max(0,Math.min(1,FM.g[i]*fmLevel()));if(Math.abs(e.volume-v)>.002)e.volume=v}} // nur schreiben, wenn sich der Wert aendert
function fmFade(i,to,sec,pause){
 const e=FM.els[i];if(!e)return;
 if(sec<=.02){FM.g[i]=to;FM.fade[i]=null;fmApply(i);if(to===0&&pause)e.pause();return}
 FM.fade[i]={t:performance.now(),d:sec*1000,from:FM.g[i],to,pause}}
function fmTick(){
 const now=performance.now();
 if(VK.on)vkLevel();
 for(let i=0;i<2;i++){
  const f=FM.fade[i];
  if(f){const x=(now-f.t)/f.d;
   if(x>=0&&f.seek!=null&&!f.sk){f.sk=1;try{if(FM.els[i])FM.els[i].currentTime=f.seek}catch(_){}}
   if(x<0)FM.g[i]=f.from;
   else if(x>=1){FM.g[i]=f.to;FM.fade[i]=null;if(f.to===0&&f.pause&&FM.els[i])FM.els[i].pause()}
   else FM.g[i]=f.to>f.from?f.from+(f.to-f.from)*Math.sin(x*Math.PI/2):f.to+(f.from-f.to)*Math.cos(x*Math.PI/2)}
  fmApply(i)}
 if(FM.on&&FM.cur>=0&&!FM.hidden&&!FM.hold){
  const e=FM.els[FM.cur],d=e.duration;
  if(FM.cfg.x>0&&isFinite(d)&&d>0&&e.currentTime>.5){const xf=Math.min(FM.cfg.x,d/3);if(d-e.currentTime<=xf+.05)fmNext(xf)}}
}
function fmPlay(idx,pos,fin,fout){
 const id=FM.list[idx],url=fmUrl(id);
 if(!url){FM.bad[id]=1;FM.idx=idx;fmFail();return}
 const old=FM.cur,ni=old<0?0:1-old,e=fmEl(ni);
 e.pause();e.src=url;
 /* v0.19: kein Ueberlappen: das alte Stueck wird erst ausgeblendet, dann erst blendet das neue ein */
 const seq=old>=0&&FM.els[old]&&fout>.02&&!FM.els[old].paused;
 if(!seq&&pos>0)e.addEventListener('loadedmetadata',()=>{try{e.currentTime=pos}catch(_){}},{once:true});
 FM.fade[ni]=null;FM.g[ni]=0;fmApply(ni);
 if(old>=0&&FM.els[old])fmFade(old,0,fout,true);
 if(seq)FM.fade[ni]={t:performance.now()+fout*1000,d:Math.max(.02,fin)*1000,from:0,to:1,pause:false,seek:pos};
 else fmFade(ni,1,fin,false);
 FM.cur=ni;FM.idx=idx;FM.on=true;
 if(AU.opt.music>0){const p=e.play();if(p&&p.catch)p.catch(()=>{})}else e._m=1;
 const nx=FM.list[(idx+1)%FM.list.length];setTimeout(()=>fmUrl(nx),2500)}
function fmNext(xf){
 if(!FM.on||!FM.list)return;
 let n=FM.idx;
 if(FM.mode!=='battle'&&FM.list.length>1){const c=FM.list.map((x,i)=>i).filter(i=>i!==FM.idx&&!FM.bad[FM.list[i]]);if(c.length)n=c[Math.floor(Math.random()*c.length)]}
 else for(let k=0;k<FM.list.length;k++){n=(n+1)%FM.list.length;if(!FM.bad[FM.list[n]])break}
 if(FM.bad[FM.list[n]]){fmFail();return}
 fmPlay(n,0,xf,xf)}
function fmFail(){
 if(FM.list&&FM.list[FM.idx])FM.bad[FM.list[FM.idx]]=1;
 if(FM.list&&FM.list.some(x=>!FM.bad[x]))fmNext(0);else fmToSynth()}
function fmToSynth(){ // Datei nicht abspielbar: wie bisher Synth
 vkStop(true);
 FM.on=false;FM.els.forEach((e,i)=>{if(e)e.pause();FM.g[i]=0;FM.fade[i]=null});FM.cur=-1;
 const mode=FM.mode,fk=FM.fk;FM.list=null;
 AU.musicMode=mode==='battle'?'battle':'menu';
 AU.trk=(mode==='menu'||!fk||!TRF[fk])?TR.menu:mode==='camp'?TRF[fk].camp:TRF[fk].battle[AU.bi%TRF[fk].battle.length];AU.step=0;AU.next=0;AU.cycles=0}
function fmSwitch(mode,fk){ // von musicStart bei jedem Wechsel aufgerufen
 if(!FM.tm)FM.tm=setInterval(fmTick,40);
 vkStop(true);
 const wasOn=FM.on,old=FM.cur,pm=FM.mode;
 if(wasOn&&old>=0&&FM.key&&FM.list)FM.mem[FM.key]={id:FM.list[FM.idx],pos:FM.els[old].currentTime||0};
 const key=mode+(fk||'');FM.key=key;FM.mode=mode;FM.fk=fk||null;
 const S=fmSel(),ids=mode==='battle'?(S.battle[fk]||[]):mode==='menu'?S.menu:(S.camp[fk]||[]);
 const list=ids.filter(id=>!FM.bad[id]&&fmHas(id));
 if(!list.length){FM.on=false;FM.list=null;if(old>=0)fmFade(old,0,FM.cfg.out,true);return}
 FM.list=list;
 const m=FM.mem[key];let idx=mode==='battle'?0:Math.floor(Math.random()*list.length),pos=0;
 if(mode==='battle'){const k=m?list.indexOf(m.id):-1;idx=k>=0?(k+1)%list.length:Math.floor(Math.random()*list.length)}
 else if(m&&mode==='camp'){const k=list.indexOf(m.id);if(k>=0){idx=k;pos=m.pos}}
 if(mode==='camp'&&pm!=='battle'){const k=list.indexOf(MAIN[fk]);if(k>=0){idx=k;pos=0}} // Haupttheme zuerst
 if(mode==='menu'){ // v0.20: beim Spielstart immer Der Hornruf; danach bei jeder Rueckkehr ins Menue ein neues Stueck von vorne
  if(!FM.menuDone){const k=list.indexOf('menu_kriegsherr');if(k>=0)idx=k}
  else if(m&&list.length>1){const c=list.map((x,i)=>i).filter(i=>list[i]!==m.id);idx=c[Math.floor(Math.random()*c.length)]}
  FM.menuDone=true;pos=0}
 AU.musicMode='file';
 if(mode==='battle'&&list[idx]==='battle_viking'&&AU.ctx&&window.KH_VK){ // v0.22: Viking-Schlachtlied ueber Stufen-Loops (Web Audio)
  FM.idx=idx;FM.on=false;FM.mem[key]={id:'battle_viking',pos:0};
  if(old>=0)fmFade(old,0,FM.cfg.out,true);
  vkStart();return}
 const soft=wasOn&&mode!=='battle'&&pm!=='battle';
 fmPlay(idx,pos,soft?FM.cfg.quick:FM.cfg.inn,soft?FM.cfg.quick:FM.cfg.out)}
function fmStop(){vkStop(false);FM.on=false;if(FM.cur>=0)fmFade(FM.cur,0,FM.cfg.out,true)}
function fmRefresh(){ // Auswahl im Menue geaendert: Menuemusik neu bestimmen
 if(FM.hold){FM.dirty=true;return}
 AU.key=null;if(typeof musicFor==='function')musicFor(cur)}
function fmPvLevel(){return Math.min(1,Math.max(.3,AU.opt.music)*FM.cfg.gain)}
function fmPreview(id){ // Vorhoeren in der Musik-Auswahl; die laufende Musik pausiert solange
 if(FM.pv.id===id){fmPreviewStop();return}
 auInit();if(!AU.ctx)return;
 const url=fmUrl(id);if(!url)return;
 if(!FM.tm)FM.tm=setInterval(fmTick,40);
 if(!FM.hold){
  FM.hold=true;FM.pvSynth=false;
  if(FM.on&&FM.cur>=0)fmFade(FM.cur,0,.15,true);
  else if(AU.musicMode!=='off'&&AU.musicMode!=='file'){FM.pvSynth=true;AU.musicMode='off';newMusBus()}}
 if(!FM.pv.e){const e=new Audio();e.preload='auto';e.addEventListener('ended',()=>fmPreviewStop());e.addEventListener('error',()=>fmPreviewStop());FM.pv.e=e}
 const e=FM.pv.e;e.pause();e.src=url;e.volume=fmPvLevel();
 const p=e.play();if(p&&p.catch)p.catch(()=>fmPreviewStop());
 FM.pv.id=id;if(typeof renderMus==='function'&&cur==='sMus')renderMus()}
function fmPreviewStop(){
 if(!FM.pv.id&&!FM.hold)return;
 if(FM.pv.e)FM.pv.e.pause();
 FM.pv.id=null;
 if(FM.hold){
  FM.hold=false;
  if(FM.pvSynth||FM.dirty){FM.pvSynth=false;FM.dirty=false;AU.key=null;if(typeof musicFor==='function')musicFor(cur)}
  else if(FM.on&&FM.cur>=0){fmFade(FM.cur,1,FM.cfg.inn,false);if(AU.opt.music>0&&!FM.hidden){const p=FM.els[FM.cur].play();if(p&&p.catch)p.catch(()=>{})}}}
 if(typeof renderMus==='function'&&cur==='sMus')renderMus()}
function fmVol(){ // Musikregler: auch pausieren bei 0 (iOS ignoriert el.volume)
 if(FM.pv.e&&FM.pv.id)FM.pv.e.volume=fmPvLevel();
 if(!FM.els[0]&&!FM.els[1])return;
 const mute=AU.opt.music<=0;
 for(let i=0;i<2;i++){const e=FM.els[i];if(!e)continue;fmApply(i);
  if(mute&&!e.paused){e.pause();e._m=1}
  else if(!mute&&e._m){e._m=0;if(i===FM.cur&&FM.on&&!FM.hidden&&!FM.hold){const p=e.play();if(p&&p.catch)p.catch(()=>{})}}}}
document.addEventListener('visibilitychange',()=>{
 FM.hidden=document.hidden;
 if(FM.hidden&&FM.pv.e&&FM.pv.id)fmPreviewStop();
 const e=FM.cur>=0?FM.els[FM.cur]:null;if(!e||!FM.on||FM.hold)return;
 if(FM.hidden)e.pause();else if(AU.opt.music>0){const p=e.play();if(p&&p.catch)p.catch(()=>{})}});
document.addEventListener('pointerdown',()=>{ // falls der Browser den Start abgelehnt hat
 const e=FM.cur>=0?FM.els[FM.cur]:null;
 if(e&&FM.on&&!FM.hidden&&!FM.hold&&AU.opt.music>0&&e.paused){e._m=0;const p=e.play();if(p&&p.catch)p.catch(()=>{})}},{capture:true});

