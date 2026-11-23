/* Optionen, Auswahl, Balance-Pruefung, Musik-Auswahl */
/* ---------- Optionen ---------- */
let OPT={v:3,gore:(typeof audioLite==='function'&&audioLite())?'low':'normal',mode:'clock',music:.6,sfx:.8,touch:'auto',side:'right',lang:(navigator.language||'de').toLowerCase().startsWith('de')?'de':'en'};
try{const o=JSON.parse(localStorage.getItem('hf_opt')||'{}');if(o.v===3)Object.assign(OPT,o)}catch(e){}
function saveOpt(){try{localStorage.setItem('hf_opt',JSON.stringify(OPT))}catch(e){}}
AU.opt.music=OPT.music;AU.opt.sfx=OPT.sfx;
function musicFor(id){if(!AU.ctx)return;if(id==='sBattle')musicStart('battle',B?B.f.L:null);else if(id==='sCamp'&&camp)musicStart('camp',camp.pf);else musicStart('menu')}
function show(id){cur=id;if(id!=='sMus'&&FM.pv.id)fmPreviewStop();if(id!=='sBattle')ambStop();SCREENS.forEach(s=>$('#'+s).classList.toggle('on',s===id));musicFor(id)}
function touchOn(){return OPT.touch==='on'||(OPT.touch==='auto'&&matchMedia('(pointer:coarse)').matches)}
function toggleFs(){const d=document.documentElement,fe=document.fullscreenElement||document.webkitFullscreenElement;
 if(!fe){const f=d.requestFullscreen||d.webkitRequestFullscreen;if(f){const p=f.call(d);if(p&&p.then)p.then(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}).catch(()=>{})}else alert(tr('Dein Browser erlaubt kein Vollbild. Auf dem iPhone: Teilen, dann "Zum Home-Bildschirm".'))}
 else{(document.exitFullscreen||document.webkitExitFullscreen).call(document)}}
['#mFs','#oFs','#bFs'].forEach(s=>$(s).onclick=toggleFs);
['fullscreenchange','webkitfullscreenchange'].forEach(e=>document.addEventListener(e,()=>setTimeout(()=>{if(cur==='sBattle')resize();if(cur==='sCamp')fitMap()},200)));
document.addEventListener('pointerdown',()=>{auInit();if(AU.ctx&&AU.musicMode==='off')musicFor(cur)},{capture:true});
document.addEventListener('keydown',()=>auInit(),{capture:true});
document.addEventListener('click',e=>{if(e.target.closest('.btn')&&AU.ctx&&AU.opt.sfx>0)SFX.click()},true);
/* Verhindert versehentliches Neuladen durch Runterwischen / Schließen */
window.addEventListener('beforeunload',e=>{if(cur==='sBattle'||cur==='sCamp'){e.preventDefault();e.returnValue=''}});
document.addEventListener('touchmove',e=>{if(cur==='sBattle'||(e.target.closest&&!e.target.closest('#mapScroll,#cOther,.screen.on')))e.preventDefault()},{passive:false});
/* ---------- Figuren-Helfer ---------- */
function hasShield(d,fk){const k=d.k;return fk!=='undead'&&d.arm>=30&&(k==='sword'||k==='spear'||k==='hammer'||k==='big'||(k==='axe'&&fk==='dwarves'))}
function mkFig(fk,d,o){return Object.assign({fk,kind:d.k,name:d.n,H:60,dir:1,wt:0,mv:false,p:-1,t:0,ph:0,hit:0,fall:0,arm:d.arm,big:d.k==='big',hasShield:hasShield(d,fk)},o)}
const SZX={'Grunzer':1.06,'Axtschwinger':1.1,'Axtwerfer':1.0,'Schwarzork':1.18,'Troll':1.28,'Kriegsherr':1.38,'Eberreiter':1.3,'Wolfsreiter':1.12,'Speerwerfer':1.04,'Plünderer':1.04,'Schamane':1.06};
function sizeOf(d,H){const z=(d.fkx==='orcs'||!d.fkx)&&SZX[d.n]?SZX[d.n]:1;return z*(d.k==='big'?H*1.15:d.k==='ent'?H*1.2:d.k==='scout'?H*.9:d.k==='cav'?H*.85:H)}
const mc=$('#menuCv'),mctx=mc.getContext('2d'),pc=$('#pCv'),pctx=pc.getContext('2d');
function fitC(cv){const r=cv.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);cv.width=Math.max(1,r.width*d);cv.height=Math.max(1,r.height*d);return d}
function drawMenu(t){
 const d=fitC(mc),w=mc.width/d,h=mc.height/d,c=mctx;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);
 const g=c.createLinearGradient(0,h*.55,0,h);g.addColorStop(0,'#0000');g.addColorStop(1,'#2a3a1f');c.fillStyle=g;c.fillRect(0,0,w,h);
 const H=Math.min(h*.62,100);
 for(let i=0;i<11;i++){const fk=FKEYS[i%5],u=FACTIONS[fk].units[(i*3)%10],sp=26+(i%3)*5,x=((i*130+t*sp)%(w+260))-130,y=h*.94-((i*37)%5)*h*.03;
  figure(c,mkFig(fk,u,{x,y,H:sizeOf(u,H),mv:true,wt:t*sp*.11+i,t,ph:i,dir:1}))}}
function drawPick(t){
 const fk=FKEYS[pickIdx],us=FACTIONS[fk].units,CW=130,ch0=pc.clientHeight||190,d=Math.min(2,window.devicePixelRatio||1);
 if(pc.width!==Math.round(CW*us.length*d)||pc.height!==Math.round(ch0*d)){pc.style.width=(CW*us.length)+'px';pc.width=Math.round(CW*us.length*d);pc.height=Math.round(ch0*d)}
 const c=pctx,h=ch0;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,CW*us.length,h);
 const H=Math.min(h*.5,92);
 const pv=pvpActive(),pa=pv?pvpCur():null;
 us.forEach((u,i)=>{const on=!pv||pa[i];c.globalAlpha=on?1:.3;const x=CW*(i+.5),ph=(t*.9+i*.35)%2.4,atk=ph>1.2,p=atk?(ph-1.2):-1,walk=ph<=1.2&&u.k!=='bow'&&u.k!=='mage';
  figure(c,mkFig(fk,u,{x,y:h*.78,H:sizeOf(u,H),mv:false,wt:t*u.spd*.11,t,ph:i,p:p>=0?Math.min(.999,p/1.0):-1}));
  c.fillStyle='#f2d58a';c.font='bold 12px Georgia';c.textAlign='center';c.fillText(tr(u.n),x,h-8);c.globalAlpha=1;
  if(pv){c.fillStyle='#000a';c.fillRect(x-48,6,22,22);c.strokeStyle=on?'#ffe08a':'#8a7a50';c.lineWidth=2;c.strokeRect(x-48,6,22,22);if(on){c.strokeStyle='#8fe89a';c.lineWidth=3;c.beginPath();c.moveTo(x-44,17);c.lineTo(x-39,23);c.lineTo(x-30,10);c.stroke()}}})}
/* ---------- Auswahl ---------- */
let pickMode='info',pickIdx=0,pickStep=0,sel={},pickDiff=.55,qmode='pvc';
/* v0.32: im Spieler-gegen-Spieler-Modus waehlt jeder Spieler selbst, welche Einheiten dabei sind (Haken je Einheit, pro Seite und Volk gemerkt) */
const pvpSet={L:{},R:{}};
function pvpArr(side,fk,n){const o=pvpSet[side];if(!o[fk]||o[fk].length!==n)o[fk]=Array(n).fill(true);return o[fk]}
function pvpActive(){return pickMode==='quick'&&qmode==='pvp'}
function pvpCur(){const fk=FKEYS[pickIdx];return pvpArr(pickStep===0?'L':'R',fk,FACTIONS[fk].units.length)}
const DIFFS=[['Leicht',.25],['Normal',.5],['Schwer',.75],['Brutal',.95]];
function renderPick(){
 const k=FKEYS[pickIdx],f=FACTIONS[k];
 $('#pName').textContent=f.name;$('#pName').style.color=f.color;$('#pDesc').textContent=f.desc;$('#pPas').innerHTML='<b>Volksbonus:</b> '+f.passive;
 const pvOn=pvpActive(),parr=pvOn?pvpCur():null;
 let h='<tr>'+(pvOn?'<th></th>':'')+'<th>Einheit</th><th>Leben</th><th>Schaden</th><th>Reichw.</th><th>Tempo</th><th>Rüstung</th></tr>';
 f.units.forEach((u,i)=>{h+='<tr'+(pvOn&&!parr[i]?' style="opacity:.45"':'')+'>'+(pvOn?'<td style="width:30px"><input type="checkbox" data-i="'+i+'" '+(parr[i]?'checked':'')+' style="width:20px;height:20px;accent-color:#c9a45a;cursor:pointer"></td>':'')+'<td>'+u.n+(u.cnt?' x'+u.cnt:'')+'</td><td>'+u.hp+'</td><td>'+u.dmg+'</td><td>'+u.rng+'</td><td>'+u.spd+'</td><td>'+u.arm+'</td></tr>'});
 $('#pTab').innerHTML=h;
 const q=pickMode==='quick'&&(pickStep===1||qmode==='pvp');$('#pDiff').style.display=q?'flex':'none';
 $('#pGo').style.display=pickMode==='info'?'none':'';
 const cv2=qmode==='cvc',pv=qmode==='pvp';
 $('#pStep').textContent=pickMode==='info'?'Fraktionen':pickMode==='camp'?'Wähle deine Fraktion':pickStep===0?(pv?'Spieler 1 (links): Fraktion und Einheiten':cv2?'Linke Fraktion':'Deine Fraktion'):(pv?'Spieler 2 (rechts): Fraktion und Einheiten':cv2?'Rechte Fraktion und Stufe':'Gegner und Schwierigkeit');
 fillDiff();
 const mr=$('#pModeRow');mr.style.display=(pickMode==='quick'&&pickStep===0)?'flex':'none';
 mr.innerHTML=[['pvc','Du gegen Computer'],['pvp','Spieler gegen Spieler'],['cvc','Computer gegen Computer']].map(m=>'<button class="btn sm '+(qmode===m[0]?'on':'')+'" data-m="'+m[0]+'">'+m[1]+'</button>').join('');
 mr.onclick=e=>{const b=e.target.closest('button');if(!b)return;qmode=b.dataset.m;renderPick()};
}
function fillDiff(){const pv=qmode==='pvp';$('#pDiff').innerHTML=pv?[['all','Alle auswählen'],['none','Alle abwählen']].map(d=>'<button class="btn sm" data-u="'+d[0]+'">'+d[1]+'</button>').join(''):DIFFS.map(d=>'<button class="btn sm" data-d="'+d[1]+'">'+d[0]+'</button>').join('');markDiff()}
$('#pDiff').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.u){pvpCur().fill(b.dataset.u==='all');renderPick();return}pickDiff=+b.dataset.d;markDiff()};
$('#pTab').addEventListener('click',e=>{if(!pvpActive())return;const row=e.target.closest('tr'),cb=row&&row.querySelector('input');if(!cb)return;if(e.target!==cb)cb.checked=!cb.checked;pvpCur()[+cb.dataset.i]=cb.checked;renderPick()});
pc.addEventListener('click',e=>{if(!pvpActive())return;const r=pc.getBoundingClientRect(),i=Math.floor((e.clientX-r.left)/130),a=pvpCur();if(i>=0&&i<a.length){a[i]=!a[i];renderPick()}});
function markDiff(){[...$('#pDiff').children].forEach(b=>b.classList.toggle('on',b.dataset.u?false:+b.dataset.d===pickDiff))}
$('#pPrev').onclick=()=>{pickIdx=(pickIdx+4)%5;renderPick()};
$('#pNext').onclick=()=>{pickIdx=(pickIdx+1)%5;renderPick()};
$('#pBack').onclick=()=>{if(pickMode==='quick'&&pickStep===1){pickStep=0;pickIdx=FKEYS.indexOf(sel.L);renderPick()}else show(pickMode==='camp'?'sCM':'sMenu')};
function enemyMods(){return defMods()}
const FT={humans:.45,elves:.3,orcs:.6,dwarves:.7,undead:.5};
const MU={"humans":{"humans":50,"elves":54,"orcs":45,"dwarves":38,"undead":55},"elves":{"humans":47,"elves":50,"orcs":65,"dwarves":23,"undead":58},"orcs":{"humans":53,"elves":35,"orcs":50,"dwarves":75,"undead":38},"dwarves":{"humans":60,"elves":83,"orcs":22,"dwarves":50,"undead":52},"undead":{"humans":49,"elves":40,"orcs":62,"dwarves":60,"undead":50}};
function homeRings(pf){const D=genMapData(),r=Array(D.NS).fill(-1),q=[],hc=FKEYS.indexOf(pf);D.clu.forEach((c,i)=>{if(c===hc){r[i]=0;q.push(i)}});while(q.length){const n=q.shift();D.adj[n].forEach(m=>{if(r[m]<0){r[m]=r[n]+1;q.push(m)}})}return r}
/* Fest geskriptet: Die Gegner-Staerke haengt nur von der Lage im Land ab (Abstand zu deiner Heimat), nie von deinem Fortschritt. */
function regionCfg(i){const r=Math.max(1,camp.ring[i]),cap=i%NC===0,rn=mulberry(300+i*13)(),rn2=mulberry(500+i*17)();
 const base=.22+.12*(r-1)+(rn-.5)*.08,n0=2+r+(rn2<.5?0:1);
 return {r,cap,b:cap?.28:Math.min(.15,.04*(r-1)),sk:cap?Math.min(.97,base+.35):Math.min(.92,base),n:cap?Math.min(10,n0+4):Math.min(10,n0)}}
function pctDiff(i){const c=regionCfg(i),ef=camp.own[i],mu=(MU[camp.pf]&&MU[camp.pf][ef]!=null)?MU[camp.pf][ef]:50;
 return Math.max(8,Math.min(95,Math.round(100*(.5*c.sk+.3*(c.n-3)/7+.2*FT[ef])+(50-mu)*.3+70*c.b)))}
function rewardOf(i){return Math.round((120+8*pctDiff(i)+(i%NC===0?200:0))*(1+.06*((camp&&camp.up&&camp.up.h_guild)||0))/10)*10}
function nFromDiff(d){return Math.min(10,3+Math.floor(d*d*7.5))}
function enemyUse(n,fk,seed){const U=FACTIONS[fk].units,rnd=mulberry((seed==null?Math.floor(Math.random()*1e6):seed*131)+17);
 const rest=Array.from({length:U.length-3},(_,q)=>q+3).map(i=>[i,U[i].cost+rnd()*1100]).sort((x,y)=>x[1]-y[1]).map(x=>x[0]);
 return [0,1,2].concat(rest).slice(0,n)}
$('#pGo').onclick=()=>{
 const k=FKEYS[pickIdx];
 if(pvpActive()&&!pvpCur().some(Boolean)){$('#pGo').animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'none'}],{duration:180});return}
 if(pickMode==='camp'){newCamp(k);show('sCamp');openCamp()}
 else if(pickStep===0){sel.L=k;pickStep=1;pickIdx=(FKEYS.indexOf(k)+1)%5;renderPick();markDiff()}
 else if(qmode==='pvp'){const uL=pvpArr('L',sel.L,FACTIONS[sel.L].units.length).map((v,i)=>v?i:-1).filter(i=>i>=0),uR=pvpArr('R',k,FACTIONS[k].units.length).map((v,i)=>v?i:-1).filter(i=>i>=0);startBattle({L:sel.L,R:k,pvp:true,diff:.5,useL:uL,useR:uR,mL:defMods(),mR:defMods(),onEnd:()=>show('sMenu'),endLabel:'Zum Menü'})}
 else if(qmode==='cvc'){startBattle({L:sel.L,R:k,diff:pickDiff,watch:true,useL:enemyUse(nFromDiff(pickDiff),sel.L),useR:enemyUse(nFromDiff(pickDiff),k),mL:defMods(),mR:defMods(),onEnd:()=>show('sMenu'),endLabel:'Zum Menü'})}
 else{startBattle({L:sel.L,R:k,diff:pickDiff,useL:[0,1,2,3,4,5],useR:enemyUse(nFromDiff(pickDiff),k),mL:defMods(),mR:defMods(),onEnd:()=>show('sMenu'),endLabel:'Zum Menü'})}
};
$('#mQuick').onclick=()=>{pickMode='quick';pickStep=0;pickIdx=0;show('sPick');renderPick()};
$('#mFact').onclick=()=>{pickMode='info';pickIdx=0;show('sPick');renderPick()};
/* ---------- Balance-Pruefung (v0.37): Kraft/Wartezeit-Tabelle und Duell-Test im Spiel ---------- */
const BAL={run:false,res:{},cfg:null};
function balPower(d){return d.hp*(1+d.arm/100)*d.dmg/Math.max(.3,d.cd)}
function balTable(){const out={};
 for(const fk of FKEYS){const us=FACTIONS[fk].units,rows=us.map((u,i)=>({i,n:u.n,sp:u.sp,rng:u.rng,k:u.k,P:balPower(u)}));
  const q=rows.map(r=>r.P/(r.sp*r.sp)),med=q.slice().sort((a,b)=>a-b)[Math.floor(q.length/2)];rows.forEach((r,j)=>r.idx=q[j]/med);
  const ord=rows.slice().sort((a,b)=>a.sp-b.sp||a.i-b.i),cl=r=>r.rng>100?1:0;rows.forEach(r=>{const p=ord.indexOf(r);r.fast=ord[0].i;let pv=null;for(let q=p-1;q>=0;q--)if(cl(ord[q])===cl(r)){pv=ord[q].i;break}r.prev=pv});out[fk]=rows}
 return out}
function balDuel(fk,ia,ib,n,fw,mm){ // unit ia against unit ib, both spammed, sides alternate. Returns the bar share (0..100) of ia at the end of the battle (50 = even)
 let acc=0;
 for(let i=0;i<n;i++){const swap=i%2===1,uL=swap?ib:ia,uR=swap?ia:ib;
  const b2=newBattle({L:fk,R:fk,mL:defMods(),mR:defMods(),aiL:null,aiR:null,useL:[uL],useR:[uR],fw,mm,ev:false});
  const lane=side=>{const foe=side==='L'?'R':'L';let best=-1,bl=Math.floor(Math.random()*7);for(let l=0;l<7;l++){let e=0;for(const u of b2.units)if(u.hp>0&&u.lane===l&&u.side===foe)e++;if(e>best||(e===best&&Math.random()<.3)){best=e;bl=l}}return bl};
  let g=0;while(!b2.over&&g++<30000){step(b2,.05);if(canSpawn(b2,'L',uL))spawn(b2,'L',uL,lane('L'));if(canSpawn(b2,'R',uR))spawn(b2,'R',uR,lane('R'))}
  acc+=swap?100-b2.bar:b2.bar}
 return Math.round(acc/n)}
function balCls(p){return p>=55?'g':p>=40?'y':'r'}
function balIdxCls(x){return x>=.7&&x<=1.6?'g':(x>=.5&&x<=2.5)?'y':'r'}
function balRender(){
 const T=balTable(),R=BAL.res;let h='';
 for(const fk of FKEYS){const f=FACTIONS[fk];h+='<h3>'+tr(f.name)+'</h3><table><tr><th>'+tr('Einheit')+'</th><th>'+tr('Wartezeit')+'</th><th>'+tr('Kraft')+'</th><th>Index</th><th>'+tr('Duell vs. schnellste')+'</th><th>'+tr('vs. nächstschnellere')+'</th><th>'+tr('Urteil')+'</th></tr>';
  for(const r of T[fk].slice().sort((a,b)=>a.sp-b.sp||a.i-b.i)){const x=R[fk]&&R[fk][r.i],rg=r.rng>100?' rg':'';
   const v1=r.i===r.fast?'<span class="m">—</span>':x&&x.fast!=null?'<span class="'+balCls(x.fast)+'">'+x.fast+' %</span>':'<span class="m">·</span>';
   const v2=r.prev==null?'<span class="m">—</span>':x&&x.prev!=null?'<span class="'+balCls(x.prev)+'">'+x.prev+' %</span>':'<span class="m">·</span>';
   let verdict='';if(r.rng>100)verdict='<span class="m">'+tr('Richtwert')+'</span>';else if(r.i!==r.fast&&x&&x.fast!=null){const m=Math.min(x.fast,x.prev!=null?x.prev:100);verdict=m>=55?'<span class="g">'+tr('lohnt sich')+'</span>':m>=40?'<span class="y">'+tr('grenzwertig')+'</span>':'<span class="r">'+tr('lohnt sich nicht')+'</span>'}
   else if(r.idx>2.5)verdict='<span class="r">'+tr('zu stark für die Wartezeit')+'</span>';else if(r.idx<.5)verdict='<span class="y">'+tr('schwach für die Wartezeit')+'</span>';
   h+='<tr class="'+rg.trim()+'"><td>'+tr(r.n)+'</td><td>'+r.sp.toFixed(1)+' s</td><td>'+Math.round(r.P)+'</td><td class="'+balIdxCls(r.idx)+'">'+r.idx.toFixed(2)+'</td><td>'+v1+'</td><td>'+v2+'</td><td>'+verdict+'</td></tr>'}
  h+='</table>'}
 $('#balOut').innerHTML=h}
function balText(){const T=balTable(),R=BAL.res;let t='Balance-Pruefung ('+(BAL.cfg?BAL.cfg.fmt+', '+BAL.cfg.n+' Durchlaeufe':'nur Tabelle')+')\n';
 for(const fk of FKEYS){t+='\n'+FACTIONS[fk].name+'\n';for(const r of T[fk].slice().sort((a,b)=>a.sp-b.sp||a.i-b.i)){const x=R[fk]&&R[fk][r.i];
  t+=(r.n+(r.rng>100?' (Fernkampf)':'')).padEnd(24)+('Wartezeit '+r.sp.toFixed(1)).padEnd(17)+('Index '+r.idx.toFixed(2)).padEnd(13)+('vs schnellste '+(x&&x.fast!=null&&r.i!==r.fast?x.fast+'%':'-')).padEnd(20)+('vs naechste '+(x&&x.prev!=null?x.prev+'%':'-'))+'\n'}}
 return t}
function balStart(){
 if(BAL.run){BAL.run=false;return}
 const n=+$('#balN').value,fmt=$('#balFmt').value,fw=fmt==='pc'?4000:1850,mm=fmt==='pc'?3:1,T=balTable(),jobs=[];
 BAL.res={};BAL.cfg={n,fmt};
 for(const fk of FKEYS){BAL.res[fk]={};for(const r of T[fk]){BAL.res[fk][r.i]={fast:null,prev:null};if(r.i!==r.fast)jobs.push([fk,r.i,r.fast,'fast']);if(r.prev!=null&&r.prev!==r.fast)jobs.push([fk,r.i,r.prev,'prev']);else if(r.prev!=null)jobs.push([fk,r.i,null,'copy'])}}
 BAL.run=true;let k=0;const tot=jobs.length,t0=performance.now();$('#balRun').textContent=tr('Abbrechen');$('#balProg').style.display='block';
 const tick=()=>{if(!BAL.run||cur!=='sBal'){BAL.run=false;$('#balRun').textContent=tr('Duell-Test starten');$('#balMsg').textContent=tr('Abgebrochen.');return}
  const t1=performance.now();
  while(k<tot&&performance.now()-t1<60){const [fk,i,j,kind]=jobs[k++];
   if(kind==='copy')BAL.res[fk][i].prev=BAL.res[fk][i].fast;else BAL.res[fk][i][kind]=balDuel(fk,i,j,n,fw,mm)}
  $('#balProg').firstChild.style.width=(100*k/tot)+'%';$('#balMsg').textContent=k+' / '+tot+' '+tr('Duelle')+' ('+Math.round((performance.now()-t0)/1000)+' s)';
  if(k%12===0||k>=tot)balRender();
  if(k<tot)setTimeout(tick,0);else{BAL.run=false;$('#balRun').textContent=tr('Duell-Test starten');$('#balMsg').textContent=tr('Fertig')+' ('+Math.round((performance.now()-t0)/1000)+' s). '+tr('Grün: lohnt sich, gelb: grenzwertig, rot: lohnt sich nicht.');balRender()}};
 $('#balMsg').textContent='…';setTimeout(tick,20)}
$('#mBal').onclick=()=>{show('sBal');balRender();$('#balMsg').textContent=''};
$('#balBack').onclick=()=>{BAL.run=false;show('sMenu')};
$('#balRun').onclick=balStart;
$('#balCopy').onclick=()=>{const t=balText();const done=()=>{$('#balMsg').textContent=tr('Kopiert.')};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,()=>{$('#balMsg').textContent=t.slice(0,0)});
 else{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}ta.remove();done()}};
$('#mHow').onclick=()=>show('sHow');$('#hBack').onclick=()=>show('sMenu');
/* ---------- Optionen UI ---------- */
function segs(el,items,key,fn){el.innerHTML=items.map(i=>'<button class="btn sm '+(OPT[key]===i[0]?'on':'')+'" data-v="'+i[0]+'">'+i[1]+'</button>').join('');
 el.onclick=e=>{const b=e.target.closest('button');if(!b)return;OPT[key]=b.dataset.v;saveOpt();segs(el,items,key,fn);if(fn)fn()}}
function renderOpt(){segs($('#oLang'),[['de','Deutsch'],['en','English']],'lang',()=>setLang(OPT.lang));segs($('#oTouch'),[['auto','Auto'],['on','An'],['off','Aus']],'touch');segs($('#oSide'),[['right','Rechts'],['left','Links']],'side');segs($('#oGore'),[['off','Aus'],['low','Wenig'],['normal','Normal'],['high','Viel']],'gore');
 $('#oMus').value=OPT.music*100;$('#oSfx').value=OPT.sfx*100}
$('#oMus').oninput=e=>{OPT.music=e.target.value/100;AU.opt.music=OPT.music;auVol();saveOpt();if(AU.ctx&&AU.musicMode==='off'&&OPT.music>0)musicFor(cur)};
$('#oSfx').oninput=e=>{OPT.sfx=e.target.value/100;AU.opt.sfx=OPT.sfx;auVol();saveOpt()};
$('#oSfx').onchange=()=>{if(AU.ctx){if(!smp('sword',null,{g:.9}))SFX.sword(500)}};
$('#mOpt').onclick=()=>{renderOpt();show('sOpt')};$('#oBack').onclick=()=>show('sMenu');
/* ---------- Musik-Auswahl (v0.16): welches Stueck laeuft in Menue, Kampagne, Schlacht ---------- */
const MFS={humans:'Menschen',elves:'Elfen',orcs:'Orks',dwarves:'Zwerge',undead:'Untote'};
let muCtx='menu',muFac='humans';
const muTime=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
function muArr(){const S=fmSel();return muCtx==='menu'?S.menu:(muCtx==='camp'?S.camp:S.battle)[muFac]}
function muUsage(id){
 const S=fmSel(),p=[];
 if(S.menu.includes(id))p.push('Menü');
 for(const [c,n] of [['camp','Kampagne'],['battle','Schlacht']]){
  const ks=FKEYS.filter(k=>S[c][k].includes(id));
  if(ks.length===FKEYS.length)p.push(n+' (alle Fraktionen)');else if(ks.length)p.push(n+' ('+ks.map(k=>MFS[k]).join(', ')+')')}
 return p.length?'Läuft in: '+p.join(' · '):'Läuft nirgends'}
function renderMus(){
 const hints={menu:'Läuft im Hauptmenü und in allen Menüs außer Kampagne und Schlacht.',camp:'Läuft auf der Kampagnenkarte, wenn du mit dieser Fraktion spielst.',battle:'Läuft in Schlachten dieser Fraktion (linke Seite).'};
 $('#muCtx').innerHTML=[['menu','Menü'],['camp','Kampagne'],['battle','Schlacht']].map(([v,n])=>'<button class="btn sm '+(muCtx===v?'on':'')+'" data-c="'+v+'">'+n+'</button>').join('');
 const fr=$('#muFac');fr.style.display=muCtx==='menu'?'none':'flex';
 fr.innerHTML=FKEYS.map(k=>'<button class="btn sm '+(muFac===k?'on':'')+'" data-f="'+k+'" style="border-color:'+FACTIONS[k].color+'">'+MFS[k]+'</button>').join('');
 $('#muHint').textContent=hints[muCtx]+' Ohne Haken spielt die eingebaute Synth-Musik.';
 const arr=muArr();
 $('#muList').innerHTML=MTR.map(t=>{
  const on=arr.includes(t.id),pv=FM.pv.id===t.id;
  return '<div class="mrow'+(on?' on':'')+'"><button class="btn sm pv" data-p="'+t.id+'">'+(pv?'■':'▶')+'</button>'
   +'<label class="ml"><input type="checkbox" data-t="'+t.id+'"'+(on?' checked':'')+'><span class="mt"><b>'+t.t+'</b><span class="ms">'+muUsage(t.id)+'</span></span></label>'
   +'<span class="ms">'+muTime(t.d)+'</span></div>'}).join('')}
function muSet(id,on){
 const S=fmSel(),ids=MTR.map(x=>x.id),old=muArr(),nw=ids.filter(i=>i===id?on:old.includes(i));
 if(muCtx==='menu')S.menu=nw;else S[muCtx][muFac]=nw;
 fmSaveSel();renderMus();if(muCtx==='menu')fmRefresh()}
$('#muCtx').onclick=e=>{const b=e.target.closest('button');if(b){muCtx=b.dataset.c;renderMus()}};
$('#muFac').onclick=e=>{const b=e.target.closest('button');if(b){muFac=b.dataset.f;renderMus()}};
$('#muList').onclick=e=>{const b=e.target.closest('.pv');if(b)fmPreview(b.dataset.p)};
$('#muList').onchange=e=>{const c=e.target;if(c.dataset&&c.dataset.t)muSet(c.dataset.t,c.checked)};
$('#muReset').onclick=()=>{FM.sel=fmDefSel();fmSaveSel();renderMus();fmRefresh()};
$('#mMus').onclick=()=>{renderMus();show('sMus')};$('#muBack').onclick=()=>show('sMenu');
