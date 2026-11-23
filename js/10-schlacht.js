/* Schlacht */
/* ---------- Schlacht ---------- */
const cv=$('#cv'),cx=cv.getContext('2d');
let hovId=null,hovUntil=0;
let B=null,cfg=null,selU=0,cursor=3,selR=0,curR=3,paused=false,speed=1,lastTs=0,cw=0,ch=0,dpr=1,bg=null,parts=[],resShown=false,lastSent=0;
function arrowSz(lh,rdy,t){let as=Math.min(lh*.62,touchOn()?24:36);if(rdy&&!touchOn())as*=1.3+.06*Math.sin(t*9);return as}
function laneGeom(){const top=Math.max(ch*.12,Math.min(ch*.17,60),window.UTOPH||0),lh=(ch-top)/LANES;return{top,lh}}
function pf(l){return .8+.26*l/(LANES-1)}
function buildBg(){
 const c=document.createElement('canvas');c.width=Math.max(1,cw*dpr);c.height=Math.max(1,ch*dpr);const g=c.getContext('2d');g.scale(dpr,dpr);
 const {top}=laneGeom(),sk=g.createLinearGradient(0,0,0,top);sk.addColorStop(0,'#6f93b8');sk.addColorStop(1,'#e8d7ae');g.fillStyle=sk;g.fillRect(0,0,cw,top+2);
 let sd=7;const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
 g.fillStyle='#fff6';for(let i=0;i<5;i++){g.beginPath();g.ellipse(rnd()*cw,top*(.15+rnd()*.35),30+rnd()*50,6+rnd()*6,0,0,7);g.fill()}
 g.fillStyle='#56677f';g.beginPath();g.moveTo(0,top);for(let x=0;x<=cw;x+=cw/14)g.lineTo(x,top*(.3+rnd()*.35));g.lineTo(cw,top);g.fill();
 g.fillStyle='#3d5a38';g.beginPath();g.moveTo(0,top);for(let x=0;x<=cw;x+=cw/9)g.quadraticCurveTo(x+cw/18,top*(.5+rnd()*.2),x+cw/9,top*.85);g.lineTo(cw,top+2);g.fill();
 const cxx=cw*.5,cy=top*.9;g.fillStyle='#6b6258';g.fillRect(cxx-28,cy-top*.5,56,top*.5);g.fillRect(cxx-34,cy-top*.7,16,top*.7);g.fillRect(cxx+18,cy-top*.7,16,top*.7);g.fillStyle='#4e463d';g.fillRect(cxx-8,cy-top*.28,16,top*.28);
 for(let i=0;i<22;i++){const x=rnd()*cw;if(Math.abs(x-cxx)<44)continue;const hh=top*(.25+rnd()*.3);g.fillStyle='#1f3b22';g.beginPath();g.moveTo(x,top*.95-hh);g.lineTo(x+hh*.25,top*.95);g.lineTo(x-hh*.25,top*.95);g.fill()}
 const gr=g.createLinearGradient(0,top,0,ch);gr.addColorStop(0,'#4e7a2c');gr.addColorStop(1,'#3a5e21');g.fillStyle=gr;g.fillRect(0,top,cw,ch-top);
 const lh=(ch-top)/LANES;
 for(let l=0;l<LANES;l++){g.fillStyle=l%2?'rgba(0,0,0,.07)':'rgba(255,255,255,.035)';g.fillRect(0,top+l*lh,cw,lh)}
 for(let i=0;i<cw*ch/260;i++){const x=rnd()*cw,y=top+rnd()*(ch-top);g.strokeStyle=rnd()<.5?'#2f5019aa':'#6a9a3caa';g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+(rnd()-.5)*4,y-3-rnd()*4);g.stroke()}
 g.fillStyle='rgba(120,95,55,.22)';for(let l=0;l<LANES;l++){g.beginPath();g.ellipse(cw/2,top+(l+.62)*lh,cw*.5,lh*.14,0,0,7);g.fill()}
 g.strokeStyle='rgba(255,255,255,.08)';for(let l=1;l<LANES;l++){g.beginPath();g.moveTo(0,top+l*lh);g.lineTo(cw,top+l*lh);g.stroke()}
 bg=c}
function resize(){const r=cv.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);cw=r.width;ch=r.height;cv.width=Math.max(1,cw*dpr);cv.height=Math.max(1,ch*dpr);buildBg()}
window.addEventListener('resize',()=>{if(cur==='sBattle')setTimeout(()=>{layoutUnits();resize()},50);if(cur==='sCamp')setTimeout(()=>fitMap(),50)});
window.addEventListener('orientationchange',()=>setTimeout(()=>{if(cur==='sBattle'){layoutUnits();resize()}if(cur==='sCamp')fitMap()},300));
function fmt(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
/* Lauftempo: auf Handy 1x, ab ca. 1600 px Breite (PC) 3x, dazwischen fliessend */
function calcMM(){const w=window.innerWidth;return Math.max(1,Math.min(3,1+2*(w-1000)/600))}
function calcFW(){return Math.max(1000,Math.min(4000,Math.round(window.innerWidth/.45/50)*50))}
function startBattle(c){
 const fl0=FACTIONS[c.L];c.useL=c.useL.slice().sort((x,y)=>fl0.units[x].sp-fl0.units[y].sp);
 if(c.pvp){const flr=FACTIONS[c.R];c.useR=c.useR.slice().sort((x,y)=>flr.units[x].sp-flr.units[y].sp)}
 cfg=c;B=newBattle({L:c.L,R:c.R,mL:c.mL,mR:c.mR,mem:c.mem,aiL:c.watch?(c.aiL!=null?c.aiL:c.diff):null,aiR:c.pvp?null:c.diff,useL:c.useL,useR:c.useR,fw:c.fw||1000,mm:c.mm||1,ev:true});window.CURFW=B.FW;
 selU=0;selR=0;curR=3;lastSent=0;cursor=3;paused=false;speed=1;chargeMode=false;parts=[];goreReset();resShown=false;$('#res').classList.remove('on');$('#bSpd').textContent='1x';$('#bPause').textContent='II';
 const fl=FACTIONS[c.L],fr=FACTIONS[c.R];
 $('#lbL').textContent=fl.name;$('#lbR').textContent=fr.name;$('#lbL').style.color=fl.color;$('#lbR').style.color=fr.color;
 $('#barL').style.background=fl.color;$('#bar').style.background=c.L===c.R?'#b8332e':fr.color;
 const tc=$('#tc'),tc2=$('#tc2');tc.className=(touchOn()&&!c.watch?'on ':'')+(c.pvp?'pv l':(OPT.side==='left'?'l':'r'));tc2.className=(touchOn()&&c.pvp?'on ':'')+(c.pvp?'pv ':'')+'r';$('#bQuit').textContent=(c.watch||c.pvp)?'Beenden':'Aufgeben';
 buildUnitBars(c);
 show('sBattle');refreshInfo(0);requestAnimationFrame(()=>{layoutUnits();resize();lastTs=performance.now()});
 if(AU.ctx){musicStart('battle',c.L);if(AU.opt.sfx>0)hornFor(c.L,true)}}
function refreshInfo(i){}
/* v0.22: Einheiten oben (eigene links, Gegner rechts): runder Cooldown ohne Zahl, die Figur steht im Kreis */
function buildBar(box,side,c,interactive){
 box.innerHTML='';const fac=FACTIONS[side==='L'?c.L:c.R];
 B.use[side].forEach((ui,i)=>{const b=document.createElement('button');b.className='ub';
  b.innerHTML=(interactive?'<span class="key">'+(i+1)+'</span>':'')+'<div class="disc"><div class="cdo"></div></div><canvas></canvas>';
  if(interactive)b.addEventListener('pointerdown',e=>{e.preventDefault();if(side==='R')sendR(i);else sendIdx(i)});else b.style.pointerEvents='none';
  box.appendChild(b)})}
function buildUnitBars(c){buildBar($('#units'),'L',c,!c.watch);buildBar($('#eunits'),'R',c,!!c.pvp);layoutUnits()}
function layoutUnits(){
 if(!B)return;const wrap=$('#cvWrap'),cwid=wrap.clientWidth||window.innerWidth,dp=Math.min(2,window.devicePixelRatio||1),gap=6;
 const nL=B.use.L.length,nR=B.use.R.length,hCap=Math.round(window.innerHeight*.115);
 let DL,DR,cL,cR;
 if(cwid<700){ // Handy hochkant: eigene Leiste etwas groesser, Gegner bei mehr als 5 Einheiten in zwei Reihen
  const cols=n=>n<=5?n:Math.ceil(n/2);cL=cols(nL);cR=cols(nR);
  const k=(cwid-34-(cL-1)*gap-(cR-1)*gap)/(1.2*cL+.9*cR);
  DL=Math.floor(Math.max(28,Math.min(k*1.2,82,hCap)));DR=Math.floor(Math.max(24,Math.min(k*.9,62,hCap)))}
 else{const n=Math.max(nL,nR),avail=Math.min(cwid*.47,640)-12;DL=DR=Math.max(30,Math.min(Math.floor((avail-(n-1)*gap)/n),74,hCap));cL=nL;cR=nR}
 const setG=(g,box,D,c,n)=>{g.style.setProperty('--D',D+'px');g.style.setProperty('--HK',Math.ceil(n/c)>1?1.45:1.75);box.style.width=(c*D+(c-1)*gap)+'px'};
 setG($('#uL'),$('#units'),DL,cL,nL);setG($('#uR'),$('#eunits'),DR,cR,nR);
 for(const side of ['L','R']){const box=side==='L'?$('#units'):$('#eunits'),fk=B.f[side],fac=FACTIONS[fk],D=side==='L'?DL:DR;
  [...box.children].forEach((b,i)=>{const d=fac.units[B.use[side][i]],cv=b.querySelector('canvas'),w=Math.round(D*1.5*dp),h=Math.round(D*1.7*dp);
   cv.width=w;cv.height=h;const g=cv.getContext('2d');g.clearRect(0,0,w,h);const Hb=D*.95*dp;
   figure(g,mkFig(fk,d,{x:w/2,y:h*.84,H:Math.min(sizeOf(d,Hb),Hb*1.2),t:0,dir:side==='L'?1:-1}))})}
 const oh=$('#uTop').offsetHeight+4;if(window.UTOPH!==oh){window.UTOPH=oh;if(cur==='sBattle'&&typeof resize==='function')resize()}}
function paintBar(side,box,nameEl){
 const fac=FACTIONS[B.f[side]],a=B.ai[side],want=a?a.want:null,sel=(side==='L'&&!cfg.watch)?B.use.L[selU]:(side==='R'&&cfg.pvp)?B.use.R[selR]:want;let nm='';
 [...box.children].forEach((b,i)=>{const ui=B.use[side][i],T=Tof(B,side,ui),fr=Math.max(0,(T-B.clock[side])/T),isSel=ui===sel;
  b.classList.toggle('rdy',fr<=0);b.classList.toggle('sel',isSel);
  b.firstElementChild&&(b.querySelector('.cdo').style.background=fr<=0?'none':'conic-gradient(rgba(0,0,0,.8) '+(fr*360)+'deg, transparent 0)');
  if(isSel)nm=fac.units[ui].n});
 const t=nm?tr(nm):'';if(nameEl.textContent!==t)nameEl.textContent=t}

function laneAt(y){const {top,lh}=laneGeom();if(y<top)return 0;return Math.min(LANES-1,Math.floor((y-top)/lh))}
function sendIdx(i){if(!B||B.over||paused||cfg.watch)return;if(chargeMode){if(charge(B,'L',B.use.L[i])){selU=i;lastSent=i}setChargeMode(false);return}lastSent=i;selU=i;[...$('#units').children].forEach((b,k)=>b.classList.toggle('sel',k===i));refreshInfo(i);
 if(!spawn(B,'L',B.use.L[i],cursor)){const b=$('#units').children[i];b.animate([{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'none'}],{duration:160})}}
/* A/D: highlight the previous/next unit in the dock without spawning it */
function selStep(d){if(!B||B.over||cfg.watch)return;const n=B.use.L.length;selU=Math.max(0,Math.min(n-1,selU+d));[...$('#units').children].forEach((b,k)=>b.classList.toggle('sel',k===selU));refreshInfo(selU)}
function moveCur(d){cursor=Math.max(0,Math.min(LANES-1,cursor+d))}
/* v0.31: Spieler gegen Spieler. Rechte Seite = Spieler 2 (Pfeiltasten, Enter, Ziffernblock), linke Seite = Spieler 1 wie bisher */
function moveCurR(d){curR=Math.max(0,Math.min(LANES-1,curR+d))}
function selStepR(d){if(!B||B.over||!cfg.pvp)return;const n=B.use.R.length;selR=Math.max(0,Math.min(n-1,selR+d));[...$('#eunits').children].forEach((b,k)=>b.classList.toggle('sel',k===selR))}
function sendR(i){if(!B||B.over||paused||!cfg.pvp||B.use.R[i]==null)return;selR=i;[...$('#eunits').children].forEach((b,k)=>b.classList.toggle('sel',k===i));
 if(!spawn(B,'R',B.use.R[i],curR)){const b=$('#eunits').children[i];b.animate([{transform:'translateX(4px)'},{transform:'translateX(-4px)'},{transform:'none'}],{duration:160})}}
function chargeReadyR(){return !!B&&!B.over&&!paused&&!!cfg.pvp&&B.ch.R>=chAt(B,'R')&&canSpawn(B,'R',B.use.R[selR])}
function tryChargeR(){if(!chargeReadyR())return;charge(B,'R',B.use.R[selR])}
cv.addEventListener('pointerdown',e=>{const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
 if(cfg&&cfg.pvp&&px>r.width/2){if(chargeReadyR()){const {top,lh}=laneGeom(),cy=top+(curR+.5)*lh,as=arrowSz(lh,true,0);if(px>r.width-(4+as*2+22)&&Math.abs(py-cy)<Math.max(as,lh*.5)+8){tryChargeR();return}}curR=laneAt(py);return}
 if(chargeReady()){const {top,lh}=laneGeom(),cy=top+(cursor+.5)*lh,as=arrowSz(lh,true,0);if(px<4+as*2+22&&Math.abs(py-cy)<Math.max(as,lh*.5)+8){tryCharge();return}}
 cursor=laneAt(py)});
cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&e.buttons===0){/*nur Hover*/}});
function auraOf(b,u){const m=b.m[u.side],o=[],n=u.d.n;
 if(u.cls==='mage'&&m.hl)o.push({r:magR(b,u),c:'#6fe08a',t:'Heilung '+(m.hl*100).toFixed(1).replace('.',',')+'% Leben/s'});
 if(u.cls==='mage'&&m.wb)o.push({r:magR(b,u),c:'#a8f0b8',t:'Waldsegen +'+Math.round(m.wb*100)+'% Schaden'});
 if(m.bn&&(n==='Ritter'||n==='Paladin'))o.push({r:AURA,c:'#ffd24a',t:'Banner +'+Math.round(m.bn*100)+'% Schaden'});
 if(m.pt)o.push({r:PEST_R,c:'#a0d060',t:'Pestodem '+(m.pt*100).toFixed(1).replace('.',',')+'% Leben/s'});
 return o}
function pickUnit(px,py){if(!B)return null;const {top,lh}=laneGeom(),baseH=Math.min(lh*1.3,cw/9);let best=null,bd=1e9;
 for(const u of B.units){const l=u.lane,H=sizeOf(u.d,baseH*pf(l)),x=u.x*cw/B.FW,gy=top+(l+.5)*lh+u.yo*lh*.55+lh*.3;
  if(Math.abs(px-x)<H*.38&&py<gy+6&&py>gy-H*1.05){const d=Math.abs(px-x)+Math.abs(py-(gy-H*.5));if(d<bd){bd=d;best=u}}}
 return best}
cv.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!B)return;const r=cv.getBoundingClientRect(),u=pickUnit(e.clientX-r.left,e.clientY-r.top);if(u&&auraOf(B,u).length){hovId=u.id;hovUntil=1e12}else if(hovUntil>1e11){hovId=null;hovUntil=0}});
cv.addEventListener('pointerleave',()=>{if(hovUntil>1e11){hovId=null;hovUntil=0}});
cv.addEventListener('pointerdown',e=>{if(!B)return;const r=cv.getBoundingClientRect(),u=pickUnit(e.clientX-r.left,e.clientY-r.top);if(u&&auraOf(B,u).length){hovId=u.id;hovUntil=performance.now()+3500}});

let rep=null;
function holdBtn(id,d){const b=$(id);const stop=()=>{clearInterval(rep);rep=null};
 b.addEventListener('pointerdown',e=>{e.preventDefault();moveCur(d);stop();let n=0;rep=setInterval(()=>{if(++n>2)moveCur(d)},130)});
 ['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,stop))}
holdBtn('#tUp',-1);holdBtn('#tDn',1);
let rep2=null;function holdBtnR(id,d){const b=$(id);const stop=()=>{clearInterval(rep2);rep2=null};
 b.addEventListener('pointerdown',e=>{e.preventDefault();moveCurR(d);stop();let n=0;rep2=setInterval(()=>{if(++n>2)moveCurR(d)},130)});
 ['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,stop))}
holdBtnR('#tUp2',-1);holdBtnR('#tDn2',1);
$('#tGo2').addEventListener('pointerdown',e=>{e.preventDefault();sendR(selR)});
$('#tCh2').addEventListener('pointerdown',e=>{e.preventDefault();tryChargeR()});
$('#tL2').addEventListener('pointerdown',e=>{e.preventDefault();selStepR(1)});$('#tR2').addEventListener('pointerdown',e=>{e.preventDefault();selStepR(-1)});
 $('#tGo').addEventListener('pointerdown',e=>{e.preventDefault();if(B&&!B.over&&!paused&&!cfg.watch)sendIdx(selU)});
 $('#tCh').addEventListener('pointerdown',e=>{e.preventDefault();tryCharge()});
 $('#tL').addEventListener('pointerdown',e=>{e.preventDefault();selStep(-1)});$('#tR').addEventListener('pointerdown',e=>{e.preventDefault();selStep(1)});
window.addEventListener('keydown',e=>{if(cur!=='sBattle'||!B)return;const k=e.key;
 if(cfg.pvp){ // Spieler 1 links: W/S Bahn, A/D Einheit, Leertaste oder E ruft, Q Ansturm, 1-8 direkt. Spieler 2 rechts: Pfeile, Enter ruft, Rechte Umschalt-Taste oder Ziffernblock 0 Ansturm, Ziffernblock 1-8 direkt
  const c=e.code;
  if(c==='ArrowUp'){moveCurR(-1)}else if(c==='ArrowDown'){moveCurR(1)}else if(c==='ArrowLeft'){selStepR(1)}else if(c==='ArrowRight'){selStepR(-1)} // rechte Leiste ist gespiegelt: Einheit 1 steht ganz rechts, nach links geht es weiter
  else if(c==='Enter'||c==='NumpadEnter'){sendR(selR)}
  else if(c==='ShiftRight'||c==='Numpad0'){tryChargeR()}
  else if(/^Numpad[1-8]$/.test(c)){sendR(+c.slice(6)-1)}
  else if(k>='1'&&k<='8'&&!e.location){if(B.use.L[+k-1]!=null)sendIdx(+k-1)}
  else if(k==='w'||k==='W'){moveCur(-1)}else if(k==='s'||k==='S'){moveCur(1)}
  else if(k==='a'||k==='A'){selStep(-1)}else if(k==='d'||k==='D'){selStep(1)}
  else if(k===' '||k==='e'||k==='E'){sendIdx(selU)}
  else if(k==='q'||k==='Q'||c==='ShiftLeft'){doCharge()}
  else if(k==='p'||k==='P'){togglePause()}else if(k==='f'||k==='F'){toggleFs()}
  else return;
  e.preventDefault();return}
 if(k>='1'&&k<='8'){if(B.use.L[+k-1]!=null)sendIdx(+k-1)}
 else if(k==='w'||k==='W'||k==='ArrowUp'){moveCur(-1);e.preventDefault()}
 else if(k==='s'||k==='S'||k==='ArrowDown'){moveCur(1);e.preventDefault()}
 else if(k==='a'||k==='A'||k==='ArrowLeft'){selStep(-1);e.preventDefault()}
 else if(k==='d'||k==='D'||k==='ArrowRight'){selStep(1);e.preventDefault()}
 else if(k===' '||k==='Enter'){sendIdx(selU);e.preventDefault()}
 else if(k==='q'||k==='Q')doCharge();
 else if(k==='p'||k==='P')togglePause();
 else if(k==='f'||k==='F')toggleFs()});
let chargeMode=false;
function setChargeMode(v){chargeMode=false}
/* v0.24: Ansturm mit der gewaehlten Einheit (Q, am Handy den roten Pfeil antippen), nur wenn ihre Wartezeit um ist */
function chargeReady(){return !!B&&!B.over&&!paused&&!cfg.watch&&B.ch.L>=chAt(B,'L')&&canSpawn(B,'L',B.use.L[selU])}
function tryCharge(){if(!chargeReady())return;if(charge(B,'L',B.use.L[selU]))lastSent=selU}
function doCharge(){tryCharge()}
function togglePause(){paused=!paused;$('#bPause').textContent=paused?'>':'II';lastTs=performance.now()}
$('#bPause').onclick=togglePause;
$('#bSpd').onclick=()=>{speed=speed===1?2:speed===2?4:1;$('#bSpd').textContent=speed+'x'};
$('#bQuit').onclick=()=>{if(!B||B.over)return;if(cfg.watch||cfg.pvp){B.over=true;B.winner='draw';B.reason='surr';return}if(confirm(tr('Wirklich aufgeben?'))){B.over=true;B.winner='R';B.reason='surr'}};
$('#resB').onclick=()=>{const w=B.winner;window.__lastBat={S:B.ai&&B.ai.R&&B.ai.R.S,t:B.t};B=null;$('#res').classList.remove('on');cfg.onEnd(w)};
function showRes(){resShown=true;const w=B.winner,r=$('#res');
 $('#resT').textContent=cfg.pvp?(w==='L'?'SPIELER 1 SIEGT':w==='R'?'SPIELER 2 SIEGT':'UNENTSCHIEDEN'):cfg.watch?'KAMPFENDE':w==='L'?'SIEG':w==='R'?'NIEDERLAGE':'UNENTSCHIEDEN';
 $('#resT').style.backgroundImage=w==='L'?'linear-gradient(#fff3c4,#d49a2a)':w==='R'?'linear-gradient(#ffb0a0,#a02a1a)':'linear-gradient(#ddd,#888)';
 let s=(cfg.watch||cfg.pvp)?(w==='draw'?'Abgebrochen.':FACTIONS[w==='L'?B.f.L:B.f.R].name+' siegt'+(B.reason==='bar'?' durch vollständige Eroberung.':' nach Zeit.')):B.reason==='bar'?'Der Balken wurde vollständig erobert.':B.reason==='surr'?'Du hast aufgegeben.':'Zeit abgelaufen: '+(w==='L'?'du hattest mehr Gebiet.':w==='R'?'der Gegner hatte mehr Gebiet.':'Gleichstand.');
 if(cfg.gainFn)s+='  '+cfg.gainFn(w);
 $('#resS').textContent=s;$('#resB').textContent=cfg.endLabel||'Weiter';r.classList.add('on');
 if(AU.ctx&&AU.opt.sfx>0)fanBattle(w==='L',B.f.L)}
