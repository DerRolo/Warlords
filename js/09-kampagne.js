/* Kampagne, Kopfleiste, Hauptstadt */
/* ---------- Kampagne ---------- */
let PCT={},camp=null,selNode=-1,campTab='map',zoom=1,tintDirty=true,T=null,attackable=[];
const SAVEKEY='hf_camp2';
function saveCamp(){try{localStorage.setItem(SAVEKEY,JSON.stringify(camp))}catch(e){}}
function loadCamp(){try{const s=localStorage.getItem(SAVEKEY);const c=s?JSON.parse(s):null;if(c&&c.v===3&&c.own&&c.own.length===genMapData().NS){c.v=4;c.ring=homeRings(c.pf)}return c&&c.own&&c.v===4&&c.own.length===genMapData().NS?c:null}catch(e){return null}}
function newCamp(pf){const D=genMapData();camp={v:4,ring:homeRings(pf),pf,own:D.clu.map(c=>FKEYS[c]),gold:500,up:{},owned:[1,1,1,0,0,0,0,0,0,0],eq:[0,1,2],wins:0};selNode=-1;saveCamp()}
function rings(){const D=genMapData(),r=Array(D.NS).fill(-1),q=[];camp.own.forEach((o,i)=>{if(o===camp.pf){r[i]=0;q.push(i)}});while(q.length){const n=q.shift();D.adj[n].forEach(m=>{if(r[m]<0){r[m]=r[n]+1;q.push(m)}})}return r}
function nodeDiff(i){return pctDiff(i)/100}
function diffName(d){return d<.3?'Leicht':d<.5?'Mittel':d<.7?'Schwer':'Sehr schwer'}
$('#mCamp').onclick=()=>{const s=loadCamp();
 $('#cmInfo').innerHTML=s?'Gespeicherter Stand:<br><b style="color:'+FACTIONS[s.pf].color+'">'+FACTIONS[s.pf].name+'</b>, '+s.own.filter(o=>o===s.pf).length+' von '+s.own.length+' Gebieten, Gold '+s.gold:'Noch kein gespeicherter Stand.';
 $('#cmCont').style.display=s?'':'none';show('sCM')};
$('#cmBack').onclick=()=>show('sMenu');
$('#cmCont').onclick=()=>{camp=loadCamp();if(camp){selNode=-1;show('sCamp');openCamp()}};
$('#cmNew').onclick=()=>{if(loadCamp()&&!confirm(tr('Den gespeicherten Stand überschreiben?')))return;pickMode='camp';pickIdx=0;show('sPick');renderPick()};
function openCamp(){campTab='map';tintDirty=true;closeCapital();capSel=null;renderCamp();setTimeout(()=>{fitMap(true)},50)}
$('#cBack').onclick=()=>show('sMenu');
function renderCamp(){
 const pf=camp.pf,own=camp.own,cnt=own.filter(o=>o===pf).length;
 headFill();
 const D=genMapData();attackable=[];own.forEach((o,i)=>{if(o!==pf&&D.adj[i].some(j=>own[j]===pf))attackable.push(i)});
 tintDirty=true;PCT={};attackable.forEach(i=>{PCT[i]=pctDiff(i)});
 renderSel();if($('#capPanel').classList.contains('on'))renderCapital();
 saveCamp()}

/* ---------- v0.26: Kopfleiste, Gold-Truhe, Hauptstadt-Knopf, Angriffs-Reiter ---------- */
const CRY={humans:'Für die Krone!',elves:'Für den Hain!',orcs:'Blut und Beute!',dwarves:'Für Berg und Bart!',undead:'Der Tod holt euch!'};
function crestSvg(pf){const c=FACTIONS[pf].color,ik={
 humans:'<path d="M0-7v14M-5-2h10" stroke="#f2d58a" stroke-width="2.4"/>',
 elves:'<path d="M0 7C-6 3-6-4 0-8 6-4 6 3 0 7zM0 7V-4" fill="#f2d58a" stroke="#1b2a10" stroke-width=".8"/>',
 orcs:'<path d="M-6-6L0 0-6 6M6-6L0 0 6 6" fill="none" stroke="#f2d58a" stroke-width="2.4"/>',
 dwarves:'<path d="M-6-6h12v4H2v10h-4V-2h-4z" fill="#f2d58a"/>',
 undead:'<circle cx="0" cy="-2" r="5" fill="#eee9d6"/><rect x="-3" y="2" width="6" height="4" fill="#eee9d6"/><circle cx="-2" cy="-2" r="1.3" fill="#111"/><circle cx="2" cy="-2" r="1.3" fill="#111"/>'}[pf]||'';
 return '<svg viewBox="0 0 56 44" width="46" height="36"><rect x="6" y="14" width="44" height="26" fill="#8d8575" stroke="#2a2418" stroke-width="1.5"/><path d="M6 14v-6h6v3h4V8h6v3h4V8h6v3h4V8h6v6" fill="#9b9383" stroke="#2a2418" stroke-width="1.5"/><rect x="2" y="6" width="12" height="34" fill="#a39b8a" stroke="#2a2418" stroke-width="1.5"/><rect x="42" y="6" width="12" height="34" fill="#a39b8a" stroke="#2a2418" stroke-width="1.5"/><path d="M2 6V1h3v2h2V1h3v2h2V1h2v5zM42 6V1h3v2h2V1h3v2h2V1h2v5z" fill="#b3ab99" stroke="#2a2418" stroke-width="1.2"/><path d="M28 2v10" stroke="#2a1a0a" stroke-width="1.6"/><path d="M28 2l12 4-12 4z" fill="'+c+'" stroke="#000" stroke-width=".8"/><g transform="translate(28 29)"><path d="M-11-12h22v14c0 8-6 12-11 14-5-2-11-6-11-14z" fill="'+c+'" stroke="#f2d58a" stroke-width="2"/>'+ik+'</g></svg>'}
let lastGold=null;
function headFill(){const pf=camp.pf;$('#cCap').innerHTML=crestSvg(pf)+'<span>Hauptstadt</span>';
 const g=$('#cGold');g.textContent=camp.gold;if(lastGold!==null&&lastGold!==camp.gold){const p=$('#cGoldP');p.classList.remove('flash');void p.offsetWidth;p.classList.add('flash')}lastGold=camp.gold}
$('#cFs').onclick=toggleFs;
function swordsSvg(crossed){const sw=(a,x)=>'<g transform="translate('+x+' 22) rotate('+a+')"><path d="M0-19L2.6-14V6H-2.6V-14z" fill="#eef2f6" stroke="#2a2a2a" stroke-width="1"/><path d="M-7 6H7" stroke="#f2d58a" stroke-width="3.2" stroke-linecap="round"/><path d="M0 6V15" stroke="#7a4a22" stroke-width="3.6" stroke-linecap="round"/></g>';
 return crossed?sw(-38,20)+sw(38,20):sw(0,11)+sw(0,29)}
function posAtk(){const b=$('#atkTab');if(!b)return;
 const ok=cur==='sCamp'&&camp&&selNode>=0&&attackable.includes(selNode)&&!$('#capPanel').classList.contains('on')&&campTab==='map';
 if(!ok){b.style.display='none';return}
 const sc=$('#mapScroll'),D=genMapData(),cc=D.cent[selNode],r=mapBaseW*zoom/MW,cm=$('#cMap').getBoundingClientRect(),sr=sc.getBoundingClientRect();
 const f=FACTIONS[camp.pf];
 if(b.dataset.k!==camp.pf+selNode){b.dataset.k=camp.pf+selNode;$('#atkSw').innerHTML=swordsSvg(true);$('#atkCry').textContent=tr(CRY[camp.pf]||'');b.style.setProperty('--c',f.color)}
 b.style.display='flex';
 let x=sr.left-cm.left-sc.scrollLeft+cc[0]*r,y=sr.top-cm.top-sc.scrollTop+(cc[1]-34)*r;
 const w=b.offsetWidth,hh=b.offsetHeight;
 x=Math.max(w/2+6,Math.min(cm.width-w/2-6,x));
 let below=false;if(y-hh<sr.top-cm.top+4){y=sr.top-cm.top+(cc[1]+40)*r-sc.scrollTop;below=true}
 y=Math.max(hh+4,Math.min(cm.height-hh-70,y));
 b.style.left=x+'px';b.style.top=y+'px';b.style.transform=below?'translate(-50%,0)':'translate(-50%,-100%)'}
$('#atkTab').addEventListener('click',()=>{if(selNode>=0&&attackable.includes(selNode))attackNode(selNode)});
function renderInfo(){const el=$('#mapInfo'),D=genMapData();if(selNode<0){el.style.display='none';return}
 const o=camp.own[selNode],f=FACTIONS[o],mine=o===camp.pf,att=attackable.includes(selNode);el.style.display='block';
 let s='<div class="mi-t"><b>'+D.names[selNode]+'</b></div>';
 if(mine)s+='<div style="color:#7fe08a">Dein Land</div>';
 else{s+='<div>Schwierigkeit:</div><div class="mi-p"><b>'+pctDiff(selNode)+'%</b></div>';
  if(att)s+='<div class="mi-b"><span>Beute:</span> <b>'+rewardOf(selNode)+'</b> <span>Gold</span></div>'}
 s+='<div style="margin-top:4px">Besitzer:</div><div class="mi-o" style="color:'+f.color+'"><b>'+f.name+'</b></div>';
 if(!mine&&!att)s+='<div class="mi-n">Nicht angrenzend an dein Land.</div>';
 if(!mine)s+='<div class="mi-u">Einheiten: '+enemyUse(regionCfg(selNode).n,o,selNode).sort((x,y)=>f.units[x].sp-f.units[y].sp).map(i=>f.units[i].n).join(', ')+'</div>';
 el.innerHTML=s}
function renderSel(){renderInfo();const p=$('#cSel'),D=genMapData(),own=camp.own;
 p.classList.toggle('on',own.every(o=>o===camp.pf));
 if(own.every(o=>o===camp.pf)){p.innerHTML='<b>Das ganze Land gehört dir!</b> <button class="btn sm" id="cNew">Neue Kampagne</button>';$('#cNew').onclick=()=>{pickMode='camp';pickIdx=0;show('sPick');renderPick()};return}
 if(selNode<0){p.textContent='Tippe auf ein Gebiet. Leuchtende Gebiete kannst du angreifen.';return}
 const f=FACTIONS[own[selNode]];
 if(own[selNode]===camp.pf){p.innerHTML='<b>'+D.names[selNode]+'</b>, dein Land.'+(selNode===capIdx()?' Hauptstadt: Heer und Werkstätten.':'');return}
 if(!attackable.includes(selNode)){p.innerHTML='<b>'+D.names[selNode]+'</b>, besetzt von <span style="color:'+f.color+'">'+f.name+'</span>. Nicht angrenzend an dein Land.';return}
 const d=nodeDiff(selNode),pc=Math.round(d*100);
 p.innerHTML='Schwierigkeit <b style="color:'+(pc<35?'#7fe08a':pc<60?'#ffe08a':'#ff7a6a')+'">'+pc+'%</b> ('+diffName(d)+'), Beute '+rewardOf(selNode)+' Gold';}
/* Karte */
const mapCv=$('#mapCv');mapCv.width=Math.round(MW*MS);mapCv.height=Math.round(MH*MS);const mapCtx=mapCv.getContext('2d');
function minZoom(){const sc=$('#mapScroll');return Math.max(sc.clientWidth/mapBaseW,sc.clientHeight/(mapBaseW*MH/MW))}
function fitMap(center){const sc=$('#mapScroll'),w=sc.clientWidth,h=sc.clientHeight;if(!w)return;
 mapBaseW=Math.max(w,h*MW/MH);const mz=minZoom();if(center)zoom=Math.max(mz,Z0);zoom=Math.max(zoom,mz);applyZoom();
 if(center){const D=genMapData(),i=FKEYS.indexOf(camp.pf)*NC,cc=D.cent[i],r=mapBaseW*zoom/MW;sc.scrollLeft=cc[0]*r-w/2;sc.scrollTop=cc[1]*r-h/2}}
let mapBaseW=900;
function applyZoom(){mapCv.style.width=Math.round(mapBaseW*zoom)+'px';mapCv.style.height=Math.round(mapBaseW*zoom*MH/MW)+'px'}
function setZoom(nz,cx,cy){nz=Math.max(minZoom(),Math.min(4,nz));const sc=$('#mapScroll'),r=sc.getBoundingClientRect(),ox=cx==null?r.width/2:cx-r.left,oy=cy==null?r.height/2:cy-r.top;
 const fx=(sc.scrollLeft+ox)/mapCv.offsetWidth,fy=(sc.scrollTop+oy)/mapCv.offsetHeight;zoom=nz;applyZoom();sc.scrollLeft=fx*mapCv.offsetWidth-ox;sc.scrollTop=fy*mapCv.offsetHeight-oy}
$('#zIn').onclick=()=>setZoom(zoom*1.35);$('#zOut').onclick=()=>setZoom(zoom/1.35);
function selectAt(cx,cy){const r=mapCv.getBoundingClientRect(),x=Math.floor((cx-r.left)/r.width*MW),y=Math.floor((cy-r.top)/r.height*MH),D=genMapData();
 if(x<0||y<0||x>=MW||y>=MH)return;let id=D.reg[y*MW+x];
 if(id<0){let bd=1e9;for(let s=0;s<D.NS;s++){const c=D.cent[s],d=(c[0]-x)**2+(c[1]-y)**2;if(d<bd&&d<1600){bd=d;id=s}}}
 if(id>=0){selNode=id;tintDirty=true;renderSel();if(id===capIdx())openCapital();else closeCapital()}}
(function(){const sc=$('#mapScroll'),ptrs=new Map();let pinch=null,drag=null,moved=0,wasPinch=false;
 sc.addEventListener('pointerdown',e=>{if(e.target.closest('#zoomB'))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});try{sc.setPointerCapture(e.pointerId)}catch(_){}
  if(ptrs.size===1){moved=0;wasPinch=false;drag={x:e.clientX,y:e.clientY,sl:sc.scrollLeft,st:sc.scrollTop}}
  else if(ptrs.size===2){const [p,q]=[...ptrs.values()];pinch={d:Math.hypot(p.x-q.x,p.y-q.y),z:zoom};wasPinch=true;drag=null}});
 sc.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size>=2&&pinch){const [p,q]=[...ptrs.values()],d=Math.hypot(p.x-q.x,p.y-q.y);setZoom(pinch.z*d/pinch.d,(p.x+q.x)/2,(p.y+q.y)/2)}
  else if(ptrs.size===1&&drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved=Math.max(moved,Math.hypot(dx,dy));if(moved>6){sc.scrollLeft=drag.sl-dx;sc.scrollTop=drag.st-dy}}});
 const up=e=>{if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);
  if(e.type==='pointerup'&&ptrs.size===0&&!wasPinch&&moved<=6)selectAt(e.clientX,e.clientY);
  if(ptrs.size<2)pinch=null;if(ptrs.size===1){const p=[...ptrs.values()][0];drag={x:p.x,y:p.y,sl:sc.scrollLeft,st:sc.scrollTop};moved=99}else if(ptrs.size===0)drag=null};
 sc.addEventListener('pointerup',up);sc.addEventListener('pointercancel',up);
 sc.addEventListener('wheel',e=>{e.preventDefault();setZoom(zoom*Math.exp(-e.deltaY*.0015),e.clientX,e.clientY)},{passive:false})})();
let lastMapDraw=0;
function drawCampMap(ts){if(ts-lastMapDraw<45)return;lastMapDraw=ts;
 if(tintDirty||!T){T=buildTint(camp.own,attackable,selNode);tintDirty=false}
 drawMap(mapCtx,camp.own,camp.pf,T,ts/1000,attackable,selNode)}
function campFrame(){try{posAtk()}catch(e){}requestAnimationFrame(campFrame)}requestAnimationFrame(campFrame);
/* Heer */
/* ---------- Hauptstadt-Panel: Heer und Schmiede (v0.22) ---------- */
let capSel=null,capHover=null;
function capIdx(){return FKEYS.indexOf(camp.pf)*NC}
function openCapital(){if(!capSel)capSel={t:'u',i:0};$('#capPanel').classList.add('on');renderCapital()}
function closeCapital(){$('#capPanel').classList.remove('on');capHover=null}
const KTAG={sword:'Nahkämpfer',axe:'Nahkämpfer',hammer:'Nahkämpfer',club:'Nahkämpfer',claw:'Nahkämpfer',spear:'Speerkämpfer',bow:'Fernkämpfer',mage:'Magier',cav:'Berittener Kämpfer',big:'Schwerer Kämpfer',scout:'Schneller Läufer'};

const FTABS=[
 {id:'w',n:'Waffenschmiede',sub:'Schärfe für Klinge, Spitze und Schlag.',c:'#e08a4a',ks:['a','blade','blunt','pole','crit'],ic:'<path d="M12 2l2.6 3.2V15h-5.2V5.2z" fill="#eef2f6" stroke="#222"/><path d="M6 15h12" stroke="#f2d58a" stroke-width="2.6"/><path d="M12 15v6" stroke="#7a4a22" stroke-width="3"/>'},
 {id:'r',n:'Rüstungsschmiede',sub:'Harnische, Schilde und schwere Panzerung.',c:'#8fb0d8',ks:['r','shield','big','ra'],ic:'<path d="M4 4h16v8c0 5-4 8-8 10-4-2-8-5-8-10z" fill="#5a7aa8" stroke="#f2d58a" stroke-width="1.8"/><path d="M12 5v15M5 11h14" stroke="#f2d58a" stroke-width="1.6"/>'},
 {id:'h',n:'Hofschmiede',sub:'Sondergerät für Schützen und Reiter des Hofes.',c:'#d8b060',ks:['bow','cdm','cav','fs'],ic:'<path d="M5 20V9a7 7 0 0 1 14 0v11h-4.5V9.5a2.5 2.5 0 0 0-5 0V20z" fill="#c9a45a" stroke="#2a1a0a" stroke-width="1.4"/><circle cx="7.2" cy="14" r="1" fill="#2a1a0a"/><circle cx="16.8" cy="14" r="1" fill="#2a1a0a"/>'},
 {id:'al',n:'Alchemie',sub:'Tränke und Essenzen: Eile, Mut und Magie.',c:'#b58af0',ks:['c','s','h','mage','mrng','heal'],ic:'<path d="M9 2h6v6l5 11a2 2 0 0 1-2 3H6a2 2 0 0 1-2-3l5-11z" fill="#8a62e8" stroke="#e9ddff" stroke-width="1.6"/><path d="M7 15h10" stroke="#e9ddff" stroke-width="1.6"/><circle cx="11" cy="18" r="1" fill="#e9ddff"/>'}];
let forgeTab=null;
function upAffects(u,d){const t=u[4];if(u[6]&&u[6]!==camp.pf)return false;if(t==='gold')return false;if(t==='all')return true;
 if(typeof t==='string'&&t[0]==='#')return t.slice(1).split(',').includes(d.n);
 if(t==='shield')return camp.pf!=='undead'&&d.arm>=30&&(d.k==='sword'||d.k==='spear'||d.k==='hammer'||d.k==='big'||(d.k==='axe'&&camp.pf==='dwarves'));
 return Array.isArray(t)?t.includes(uclass(d)):uclass(d)===t}
function upMax(k){const u=UPS.find(x=>x[0]===k);return (u&&u[5])||5}
function forgeRel(f){return u=>(!u[6]||u[6]===camp.pf)&&(u[4]==='gold'||f.units.some(d=>upAffects(u,d)))}
const VTAB={
 humans:{n:'Königshof',sub:'Krone, Banner und Handel.',ic:'<path d="M3 18l2-10 5 5 2-8 2 8 5-5 2 10z" fill="#f2d58a" stroke="#2a1a0a" stroke-width="1.3"/><rect x="3" y="18" width="18" height="3" fill="#c9a45a" stroke="#2a1a0a"/>'},
 elves:{n:'Hain',sub:'Wald, Mond und Falkenblick.',ic:'<path d="M12 2C6 6 5 12 12 16 19 12 18 6 12 2z" fill="#5ad07a" stroke="#1b2a10" stroke-width="1.3"/><path d="M12 16v6M12 8v8" stroke="#1b2a10" stroke-width="1.4"/>'},
 orcs:{n:'Kriegslager',sub:'Blut, Gebrüll und dicke Haut.',ic:'<path d="M3 20L9 4l3 9 3-9 6 16z" fill="#c8432e" stroke="#2a0a06" stroke-width="1.3"/><path d="M8 20l4-8 4 8" fill="#e8b24a"/>'},
 dwarves:{n:'Runenhalle',sub:'Runen, Bräu und Fels.',ic:'<path d="M2 20l7-14 3 5 3-8 7 17z" fill="#8a8a94" stroke="#222" stroke-width="1.3"/><path d="M12 12l-2 4h4z" fill="#ffb84a"/>'},
 undead:{n:'Gruft',sub:'Seuche, Knochen und Wiederkehr.',ic:'<circle cx="12" cy="10" r="7" fill="#eee9d6" stroke="#222" stroke-width="1.3"/><rect x="8" y="15" width="8" height="5" fill="#eee9d6" stroke="#222"/><circle cx="9.3" cy="10" r="1.7" fill="#222"/><circle cx="14.7" cy="10" r="1.7" fill="#222"/>'}};
function forgeTabs(f){const rel=forgeRel(f);const r=FTABS.map(t=>({t,ups:t.ks.map(k=>UPS.find(u=>u[0]===k)).filter(u=>u&&rel(u))})).filter(x=>x.ups.length);
 const vt=VTAB[camp.pf],vu=UPS.filter(u=>u[6]===camp.pf);if(vt&&vu.length)r.push({t:{id:'v',n:vt.n,sub:vt.sub,c:FACTIONS[camp.pf].color,ks:vu.map(u=>u[0]),ic:vt.ic},ups:vu});return r}
function upIcon(g,id,lv){ // runde Wappen-Symbole fuer die Schmiede
 const W=116,H=132;g.clearRect(0,0,W,H);g.save();g.translate(58,56);
 g.fillStyle='#1a140c';g.beginPath();g.arc(0,0,38,0,7);g.fill();g.strokeStyle='#c9a45a';g.lineWidth=3;g.stroke();
 const gold='#f2d58a',steel='#d5dbe2',dark='#6a4a28',ln=(x1,y1,x2,y2,w,c)=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()};
 const sword=(a)=>{g.save();g.rotate(a);ln(0,-30,0,12,5,steel);ln(-10,12,10,12,4,gold);ln(0,12,0,26,5,dark);g.restore()};
 if(id==='a'){sword(-.7);sword(.7)}
 else if(id==='blade'){sword(.5)}
 else if(id==='r'){g.fillStyle='#9aa3ad';g.beginPath();g.moveTo(-26,-8);g.lineTo(24,-8);g.lineTo(30,-16);g.lineTo(-30,-16);g.closePath();g.fill();g.fillRect(-14,-8,28,10);g.fillStyle='#7a838d';g.fillRect(-20,2,40,8);g.fillRect(-28,10,56,8)}
 else if(id==='c'){g.fillStyle=gold;g.beginPath();g.moveTo(-18,-26);g.lineTo(18,-26);g.lineTo(2,0);g.lineTo(18,26);g.lineTo(-18,26);g.lineTo(-2,0);g.closePath();g.fill();ln(-22,-26,22,-26,4,steel);ln(-22,26,22,26,4,steel)}
 else if(id==='h'){g.fillStyle='#d8503a';g.beginPath();g.moveTo(0,22);g.bezierCurveTo(-34,-4,-20,-30,0,-12);g.bezierCurveTo(20,-30,34,-4,0,22);g.fill()}
 else if(id==='s'){g.fillStyle='#5ad0c8';g.beginPath();g.moveTo(-6,-14);g.lineTo(6,-14);g.lineTo(6,-6);g.bezierCurveTo(26,2,22,28,0,28);g.bezierCurveTo(-22,28,-26,2,-6,-6);g.closePath();g.fill();g.strokeStyle='#d8fffb';g.lineWidth=2.5;g.stroke();g.fillStyle='#a8743a';g.fillRect(-7,-24,14,10);ln(-10,8,10,8,2,'#d8fffb');ln(-8,15,8,15,2,'#d8fffb')}
 else if(id==='bow'){g.strokeStyle='#a8743a';g.lineWidth=5;g.lineCap='round';g.beginPath();g.arc(-6,0,28,-1.2,1.2);g.stroke();ln(10,-25,10,25,1.5,'#eee');ln(-24,0,28,0,2.5,steel);g.fillStyle=steel;g.beginPath();g.moveTo(28,0);g.lineTo(18,-5);g.lineTo(18,5);g.fill()}
 else if(id==='mage'){g.fillStyle='#8a62e8';g.beginPath();g.arc(0,-6,15,0,7);g.fill();g.fillStyle='#d8c8ff';g.beginPath();g.arc(-4,-10,5,0,7);g.fill();ln(0,9,0,30,5,dark);ln(-26,-24,-20,-18,2,gold);ln(24,-26,18,-20,2,gold)}
 else if(id==='pole'){ln(0,-4,0,34,5,dark);g.fillStyle=steel;g.beginPath();g.moveTo(0,-34);g.lineTo(9,-4);g.lineTo(-9,-4);g.fill();ln(-12,-4,12,-4,3,gold)}
 else if(id==='blunt'){ln(-18,26,12,-20,5,dark);g.fillStyle=steel;g.beginPath();g.moveTo(6,-26);g.lineTo(26,-30);g.quadraticCurveTo(34,-12,22,-2);g.lineTo(8,-10);g.closePath();g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.moveTo(26,-30);g.quadraticCurveTo(34,-12,22,-2);g.stroke()}
 else if(id==='cav'){g.fillStyle='#e9e5da';g.beginPath();g.moveTo(-16,26);g.lineTo(-10,-6);g.lineTo(-20,-20);g.lineTo(-6,-30);g.lineTo(10,-26);g.lineTo(26,2);g.lineTo(22,10);g.lineTo(8,6);g.lineTo(10,26);g.closePath();g.fill();g.fillStyle='#1a1a1a';g.beginPath();g.arc(8,-14,3,0,7);g.fill();ln(-6,-30,-10,-6,6,'#a8a294')}
 else if(id==='big'){g.fillStyle='#c8a070';g.beginPath();g.roundRect?g.roundRect(-20,-12,40,32,9):g.rect(-20,-12,40,32);g.fill();for(let i=0;i<4;i++){g.beginPath();g.roundRect?g.roundRect(-20+i*10,-26,9,18,4):g.rect(-20+i*10,-26,9,18);g.fill()}ln(-20,-8,20,-8,2,'#8a6a40')}
 else if(id==='crit'){g.fillStyle='#8c939c';g.beginPath();g.moveTo(-24,10);g.lineTo(-16,-12);g.lineTo(18,-14);g.lineTo(26,8);g.lineTo(10,18);g.closePath();g.fill();g.strokeStyle='#d8dde3';g.lineWidth=2;g.stroke();ln(-8,-4,14,-6,2,'#c0c6ce');ln(0,-28,2,-20,2.5,'#ffe08a');ln(14,-26,10,-19,2.5,'#ffe08a');ln(-12,-24,-8,-18,2.5,'#ffe08a')}
 else if(id==='ra'){g.fillStyle='#8a5a32';g.beginPath();g.moveTo(-26,-18);g.lineTo(-10,-26);g.lineTo(-4,-18);g.lineTo(4,-18);g.lineTo(10,-26);g.lineTo(26,-18);g.lineTo(20,-4);g.lineTo(18,26);g.lineTo(-18,26);g.lineTo(-20,-4);g.closePath();g.fill();g.strokeStyle='#d5a566';g.lineWidth=2;g.stroke();ln(0,-18,0,26,2,'#5a3a1c');for(let i=0;i<3;i++)ln(-8,-6+i*10,8,-6+i*10,2,'#d5a566')}
 else if(id==='cdm'){g.fillStyle='#7a4a22';g.fillRect(-12,-4,24,34);g.strokeStyle='#d5a566';g.lineWidth=2;g.strokeRect(-12,-4,24,34);for(let i=0;i<3;i++){ln(-7+i*7,-4,-7+i*7+(i-1)*3,-28,2.5,'#eee');g.fillStyle='#d8dde3';g.beginPath();g.moveTo(-7+i*7+(i-1)*3,-34);g.lineTo(-10+i*7+(i-1)*3,-26);g.lineTo(-4+i*7+(i-1)*3,-26);g.fill()}}
 else if(id==='fs'){ln(-22,24,22,-18,5,dark);g.fillStyle=steel;g.beginPath();g.moveTo(30,-26);g.lineTo(14,-20);g.lineTo(22,-10);g.fill();g.fillStyle='#d8503a';g.beginPath();g.moveTo(-6,10);g.lineTo(-20,2);g.lineTo(-14,14);g.lineTo(-24,18);g.lineTo(-8,20);g.fill()}
 else if(id==='mrng'){g.fillStyle='#3a2a6a';g.beginPath();g.ellipse(0,0,30,18,0,0,7);g.fill();g.strokeStyle='#c8b0ff';g.lineWidth=3;g.stroke();g.fillStyle='#8a62e8';g.beginPath();g.arc(0,0,11,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(0,0,5,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(-4,-4,2.5,0,7);g.fill();ln(-34,-22,-28,-16,2,gold);ln(34,-22,28,-16,2,gold)}
 else if(id==='heal'){g.fillStyle='#5ad07a';g.fillRect(-7,-24,14,48);g.fillRect(-24,-7,48,14);g.strokeStyle='#d8ffe4';g.lineWidth=2.5;g.strokeRect(-7,-24,14,48);g.fillStyle='#ffffffcc';[[-24,-22],[24,-18],[22,22]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],3,0,7);g.fill()})}
 else if(id==='rg'){g.fillStyle='#e0605a';g.beginPath();g.moveTo(-6,-14);g.lineTo(6,-14);g.lineTo(6,-6);g.bezierCurveTo(26,2,22,28,0,28);g.bezierCurveTo(-22,28,-26,2,-6,-6);g.closePath();g.fill();g.strokeStyle='#ffd8d4';g.lineWidth=2.5;g.stroke();g.fillStyle='#a8743a';g.fillRect(-7,-24,14,10);ln(-3,6,3,6,2.5,'#fff');ln(0,3,0,9,2.5,'#fff')}

 else if(id==='u_rez'){g.fillStyle='#8a8f98';g.beginPath();g.moveTo(-14,24);g.lineTo(-14,-4);g.arc(0,-4,14,Math.PI,0);g.lineTo(14,24);g.closePath();g.fill();g.strokeStyle='#cfd4da';g.lineWidth=2;g.stroke();ln(0,-12,0,8,3,'#2a2e33');ln(-6,-4,6,-4,3,'#2a2e33');g.strokeStyle='#7aff9a';g.lineWidth=2.5;g.beginPath();g.arc(0,-2,24,Math.PI*1.1,Math.PI*1.9);g.stroke()}
 else if(id==='u_str'){g.fillStyle='#eee9d6';g.beginPath();g.arc(0,-5,17,0,7);g.fill();g.fillRect(-9,6,18,13);g.fillStyle='#1a1a20';g.beginPath();g.arc(-7,-5,4.5,0,7);g.arc(7,-5,4.5,0,7);g.fill();ln(-4,12,-4,19,2,'#1a1a20');ln(4,12,4,19,2,'#1a1a20');g.strokeStyle='#b58af0';g.lineWidth=2.5;g.beginPath();g.arc(0,-5,22,0,7);g.stroke()}
 else if(id==='u_pest'){g.fillStyle='#8fbf4a';[[-13,7,12],[2,0,15],[15,9,11]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],p[2],0,7);g.fill()});g.fillStyle='#4a6a1c';[[-8,4],[6,-2],[16,10],[-2,12]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],3,0,7);g.fill()});g.fillStyle='#d8f090';ln(-4,-18,-4,-10,2,'#d8f090');ln(10,-20,10,-13,2,'#d8f090')}
 else if(id==='o_rage'){ln(-16,-22,0,22,5,'#e0402a');ln(-2,-24,14,20,5,'#e0402a');ln(12,-22,26,16,5,'#e0402a');ln(-20,-14,-8,12,2,'#ffb08a')}
 else if(id==='o_roar'){g.strokeStyle='#e8e0c0';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(-22,18);g.quadraticCurveTo(-6,22,6,0);g.quadraticCurveTo(14,-14,22,-20);g.stroke();g.strokeStyle='#8a6a3a';g.lineWidth=4;g.beginPath();g.moveTo(-24,20);g.lineTo(-17,19);g.stroke();g.strokeStyle='#ffb84a';g.lineWidth=2.5;[14,22].forEach(r=>{g.beginPath();g.arc(-4,-6,r,-1.1,-.2);g.stroke()})}
 else if(id==='o_hide'){g.fillStyle='#6a9a3a';g.beginPath();g.arc(0,0,22,0,7);g.fill();g.strokeStyle='#3a5a1c';g.lineWidth=2.5;g.stroke();ln(-12,-8,-4,2,2.5,'#3a5a1c');ln(6,-10,14,0,2.5,'#3a5a1c');ln(-8,10,2,14,2.5,'#3a5a1c');g.fillStyle='#e8e0c0';g.beginPath();g.moveTo(-14,-4);g.lineTo(-8,-14);g.lineTo(-4,-4);g.fill();g.beginPath();g.moveTo(14,-4);g.lineTo(8,-14);g.lineTo(4,-4);g.fill()}
 else if(id==='d_rune'){g.fillStyle='#6a6a74';g.fillRect(-16,-24,32,48);g.strokeStyle='#9a9aa4';g.lineWidth=2;g.strokeRect(-16,-24,32,48);ln(-6,-14,6,-2,3.5,'#ffb84a');ln(6,-2,-6,12,3.5,'#ffb84a');ln(-8,-2,9,-2,3,'#ffb84a')}
 else if(id==='d_brew'){g.fillStyle='#d8a030';g.fillRect(-15,-12,26,34);g.strokeStyle='#8a5a10';g.lineWidth=2.5;g.strokeRect(-15,-12,26,34);g.strokeStyle='#d8a030';g.lineWidth=5;g.beginPath();g.arc(15,6,9,-1.4,1.4);g.stroke();g.fillStyle='#fff6d8';[[-12,-14],[-4,-18],[4,-14],[10,-17]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],6,0,7);g.fill()});ln(-8,-2,-8,16,2,'#ffe08a');ln(-2,-2,-2,16,2,'#ffe08a')}
 else if(id==='d_fort'){g.fillStyle='#7a7a82';g.beginPath();g.moveTo(-28,24);g.lineTo(-4,-22);g.lineTo(6,-6);g.lineTo(12,-14);g.lineTo(28,24);g.closePath();g.fill();g.strokeStyle='#b8b8c2';g.lineWidth=2;g.stroke();g.fillStyle='#fff';g.beginPath();g.moveTo(-4,-22);g.lineTo(-10,-10);g.lineTo(2,-10);g.fill();g.fillStyle='#8a5a32';g.fillRect(-6,8,12,16)}
 else if(id==='e_bless'){ln(0,6,0,26,7,'#7a5230');g.fillStyle='#4fbf6a';[[0,-12,15],[-13,0,12],[13,0,12],[0,-2,13]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],p[2],0,7);g.fill()});g.fillStyle='#bff5c8';[[-6,-14],[6,-4],[-10,2]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],2.5,0,7);g.fill()})}
 else if(id==='e_hawk'){ln(-24,20,22,-18,4,'#8a5a2a');g.fillStyle=steel;g.beginPath();g.moveTo(26,-22);g.lineTo(14,-18);g.lineTo(22,-10);g.fill();ln(-24,20,-14,16,3,'#4fbf6a');ln(-22,14,-12,10,3,'#4fbf6a');ln(-18,24,-10,20,3,'#4fbf6a');g.strokeStyle='#ffe08a';g.lineWidth=2.5;g.beginPath();g.arc(-2,-4,12,0,7);g.stroke();g.fillStyle='#ffe08a';g.beginPath();g.arc(-2,-4,3,0,7);g.fill()}
 else if(id==='e_moon'){g.fillStyle='#d6defa';g.beginPath();g.arc(0,0,24,-Math.PI*.62,Math.PI*.62,false);g.arc(11,0,19,Math.PI*.55,-Math.PI*.55,true);g.closePath();g.fill();g.fillStyle='#fff';[[16,-12],[20,6],[10,-2]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],2.2,0,7);g.fill()})}
 else if(id==='h_banner'){ln(-14,-28,-14,28,4,'#7a5230');g.fillStyle='#3b82f6';g.beginPath();g.moveTo(-12,-26);g.lineTo(22,-20);g.lineTo(16,-8);g.lineTo(22,4);g.lineTo(-12,-2);g.closePath();g.fill();g.strokeStyle=gold;g.lineWidth=2.5;g.stroke();ln(2,-18,2,-6,3,gold);ln(-2,-12,6,-12,3,gold)}
 else if(id==='h_siege'){ln(-24,2,24,2,4,'#7a5230');g.strokeStyle='#9a6a3a';g.lineWidth=5;g.beginPath();g.arc(-2,2,22,-1.3,1.3);g.stroke();ln(-2,-19,-2,23,1.5,'#e8e0c0');ln(-22,2,16,2,2.5,steel);g.fillStyle=steel;g.beginPath();g.moveTo(26,2);g.lineTo(14,-3);g.lineTo(14,7);g.fill()}
 else if(id==='h_guild'){[[0,16],[0,6],[0,-4]].forEach((p,i)=>{g.fillStyle=i%2?'#ffd24a':'#f2b830';g.beginPath();g.ellipse(p[0],p[1],20,8,0,0,7);g.fill();g.strokeStyle='#8a5a00';g.lineWidth=1.8;g.stroke();g.fillRect(-20,p[1]-0,40,0)});g.fillStyle='#ffd24a';g.beginPath();g.ellipse(0,-14,20,8,0,0,7);g.fill();g.strokeStyle='#8a5a00';g.lineWidth=1.8;g.stroke();g.fillStyle='#8a5a00';g.font='bold 12px Georgia';g.textAlign='center';g.fillText('G',0,-10)}
 else if(id==='shield'){g.fillStyle='#4a6a9a';g.beginPath();g.moveTo(-24,-26);g.lineTo(24,-26);g.lineTo(24,0);g.quadraticCurveTo(24,22,0,32);g.quadraticCurveTo(-24,22,-24,0);g.closePath();g.fill();g.strokeStyle=gold;g.lineWidth=3;g.stroke();ln(0,-22,0,26,3,gold);ln(-20,-6,20,-6,3,gold)}
 g.restore();{const n=upMax(id);for(let i=0;i<n;i++){g.fillStyle=i<lv?'#ffd877':'#ffffff30';g.beginPath();g.arc(58+(i-(n-1)/2)*14,114,4,0,7);g.fill()}}}
function smithSound(){try{auInit();if(!AU.ctx||AU.opt.sfx<=0)return;if(smp('smith',null,{g:.9}))return;SFX.smith(0)}catch(e){}}
function capStat(l,v,m,suf){return '<div class="st"><span>'+tr(l)+'</span><i><b style="width:'+Math.max(4,Math.min(100,v/m*100))+'%"></b></i><em>'+v+(suf||'')+'</em></div>'}
function capInfoShow(sel){
 const f=FACTIONS[camp.pf],o=$('#capInfo');
 document.querySelectorAll('#capTiles .tile[data-t="u"]').forEach(b=>{const on=!!(sel&&sel.t==='f'&&(()=>{const u=UPS.find(x=>x[0]===sel.k);return u&&upAffects(u,f.units[+b.dataset.i])})());b.classList.toggle('aff',on)});
 if(!sel){o.innerHTML='';return}
 let h='',act='';
 if(sel.t==='u'){const u=f.units[sel.i],own=!!camp.owned[sel.i],eq=camp.eq.includes(sel.i);
  h='<div class="ihead"><canvas width="192" height="216"></canvas><div><h3>'+tr(u.n)+'</h3><div class="tag">'+tr(KTAG[u.k]||'Kämpfer')+'</div></div></div><div class="desc">'+tr(u.info)+'</div>'+capStat('Leben',u.hp,420)+capStat('Schaden',u.dmg,32)+capStat('Rüst.',u.arm,95)+capStat('Tempo',u.spd,125)+capStat('Reichw.',u.rng,1200)+capStat('Wartezeit',u.sp,10,' s');
  act=own?'<button class="btn" data-act="eq" data-i="'+sel.i+'">'+tr(eq?'Im Heer (entfernen)':'Ins Heer stellen')+'</button>':'<button class="btn" data-act="buy" data-i="'+sel.i+'" '+(camp.gold<u.cost?'disabled':'')+'>'+tr('Kaufen')+': '+u.cost+' Gold</button>'}
 else{const u=UPS.find(x=>x[0]===sel.k),l=camp.up[sel.k]||0,cost=upCost(l,sel.k),max=l>=upMax(sel.k);
  const aff=u[4]==='all'?tr('Alle Einheiten'):u[4]==='gold'?tr('Beute aus Eroberungen'):f.units.filter(d=>upAffects(u,d)).map(d=>tr(d.n)).join(', ');
  h='<div class="ihead"><canvas width="192" height="216"></canvas><div><h3>'+tr(u[1])+'</h3><div class="tag">'+tr('Stufe')+' '+l+' / '+upMax(sel.k)+'</div></div></div><div class="desc">'+tr(u[2])+'</div><div class="tag">'+tr('Wirkt auf')+': '+aff+'</div>'+(AURA_IDS.includes(sel.k)?'<div class="tag" style="color:#9fe8a8">'+tr('Im Kampf zeigt ein Ring den Umkreis: Maus über die Einheit oder antippen.')+'</div>':'');
  act='<button class="btn" data-act="up" data-k="'+sel.k+'" '+(max||camp.gold<cost?'disabled':'')+'>'+(max?tr('Maximal'):tr('Kaufen')+': '+cost+' Gold')+'</button>'}
 o.innerHTML='<div class="icont">'+h+'</div><div class="iact">'+act+'</div>';const cv=o.querySelector('canvas'),g=cv.getContext('2d');
 if(sel.t==='u'){const u=f.units[sel.i];figure(g,mkFig(camp.pf,u,{x:96,y:196,H:Math.min(sizeOf(u,120),160),t:0}))}
 else{g.save();g.scale(192/116,216/132);upIcon(g,sel.k,camp.up[sel.k]||0);g.restore()}}
function renderCapital(){
 const f=FACTIONS[camp.pf],D=genMapData();
 $('#capTitle').textContent=tr('Hauptstadt')+': '+tr(D.names[capIdx()]);$('#capGold').style.display='none';
 const FT=forgeTabs(f);
 if(capSel.t==='f'){const x=FT.find(y=>y.ups.some(u=>u[0]===capSel.k));if(x)forgeTab=x.t.id}
 if(!FT.some(y=>y.t.id===forgeTab))forgeTab=FT[0].t.id;
 const cu=FT.find(y=>y.t.id===forgeTab);
 let h='<div class="capSec">'+tr('Heer')+'</div><div class="tiles">';
 f.units.forEach((u,i)=>{const own=!!camp.owned[i],eq=camp.eq.includes(i);h+='<button class="tile'+(own?' owned':' lock')+((capSel.t==='u'&&capSel.i===i)?' sel':'')+'" data-t="u" data-i="'+i+'"><canvas width="116" height="132"></canvas>'+(own?'':'<span class="bd">'+u.cost+'</span>')+(eq?'<span class="eqm">&#9733;</span>':'')+'</button>'});
 h+='</div><div class="capSec">'+tr('Werkstätten')+'</div><div class="ftabs">'+FT.map(y=>{const got=y.ups.reduce((s,u)=>s+(camp.up[u[0]]||0),0);return '<button class="ftab'+(y.t.id===forgeTab?' on':'')+'" data-ft="'+y.t.id+'" style="--c:'+y.t.c+'"><svg viewBox="0 0 24 24" width="18" height="18">'+y.t.ic+'</svg><span>'+tr(y.t.n)+'</span>'+(got?'<em>'+got+'</em>':'')+'</button>'}).join('')+'</div><div class="fsub" style="--c:'+cu.t.c+'">'+tr(cu.t.sub)+'</div><div class="tiles">';
 cu.ups.forEach(u=>{const l=camp.up[u[0]]||0;h+='<button class="tile'+(l?' owned':'')+((capSel.t==='f'&&capSel.k===u[0])?' sel':'')+'" data-t="f" data-k="'+u[0]+'"><canvas width="116" height="132"></canvas><span class="bd">'+(l>=upMax(u[0])?'MAX':l?'&#9733;'+l:'')+'</span></button>'});
 h+='</div>';const T=$('#capTiles'),st=T.scrollTop;T.innerHTML=h;T.scrollTop=st;
 T.querySelectorAll('.tile').forEach(b=>{const g=b.querySelector('canvas').getContext('2d');
  if(b.dataset.t==='u'){const u=f.units[+b.dataset.i];figure(g,mkFig(camp.pf,u,{x:58,y:118,H:Math.min(sizeOf(u,84),104),t:0}))}else upIcon(g,b.dataset.k,camp.up[b.dataset.k]||0)});
 capInfoShow(capHover||capSel)}
(function(){const T=$('#capTiles'),I=$('#capInfo');
 const pick=b=>b.dataset.t==='u'?{t:'u',i:+b.dataset.i}:{t:'f',k:b.dataset.k};
 T.addEventListener('click',e=>{const ft=e.target.closest('.ftab');if(ft){const x=forgeTabs(FACTIONS[camp.pf]).find(y=>y.t.id===ft.dataset.ft);if(x){forgeTab=x.t.id;capSel={t:'f',k:x.ups[0][0]};capHover=null;renderCapital();const nt=document.querySelector('#capTiles .ftab.on');if(nt)nt.focus&&nt.focus({preventScroll:true})}return}const b=e.target.closest('.tile');if(!b)return;capSel=pick(b);capHover=null;renderCapital()});
 T.addEventListener('mouseover',e=>{const b=e.target.closest('.tile');if(!b||!matchMedia('(hover:hover)').matches)return;capHover=pick(b);capInfoShow(capHover)});
 T.addEventListener('mouseleave',()=>{if(capHover){capHover=null;capInfoShow(capSel)}});
 I.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const f=FACTIONS[camp.pf],a=b.dataset.act;
  if(a==='buy'){const i=+b.dataset.i,u=f.units[i];if(camp.gold>=u.cost){camp.gold-=u.cost;camp.owned[i]=1;if(camp.eq.length<8)camp.eq.push(i);camp.eq.sort((x,y)=>x-y);smithSound();renderCamp()}}
  else if(a==='eq'){const i=+b.dataset.i,k=camp.eq.indexOf(i);if(k>=0){if(camp.eq.length>1)camp.eq.splice(k,1)}else if(camp.eq.length<8)camp.eq.push(i);camp.eq.sort((x,y)=>x-y);renderCamp()}
  else if(a==='up'){const k=b.dataset.k,l=camp.up[k]||0,c=upCost(l,k);if(camp.gold>=c&&l<upMax(k)){camp.gold-=c;camp.up[k]=l+1;smithSound();renderCamp()}}});
 $('#capX').onclick=closeCapital;$('#cCap').onclick=()=>{selNode=capIdx();tintDirty=true;renderSel();openCapital()}})();
function renderArmy(){const f=FACTIONS[camp.pf],o=$('#cOther');
 let h='<p class="sub">Kaufe neue Einheiten. Tippe auf eigene Einheiten, um sie in das Heer zu stellen oder herauszunehmen (bis zu 8 im Kampf).</p><div class="grid">';
 f.units.forEach((u,i)=>{const own=camp.owned[i],eq=camp.eq.includes(i);
  h+='<div class="card '+(eq?'eq':'')+'"><canvas width="150" height="130" data-u="'+i+'"></canvas><b>'+u.n+'</b><br>Leben '+u.hp+' | Schaden '+u.dmg+'<br>Reichw. '+u.rng+' | Tempo '+u.spd+' | Rüst. '+u.arm+'<br><span style="color:#a8a08c">'+u.info+'</span>'+
  (own?'<button class="btn" data-eq="'+i+'">'+(eq?'Im Heer (entfernen)':'Ins Heer stellen')+'</button>':'<button class="btn" data-buy="'+i+'" '+(camp.gold<u.cost?'disabled':'')+'>Kaufen: '+u.cost+' Gold</button>')+'</div>'});
 o.innerHTML=h+'</div>';
 o.querySelectorAll('canvas').forEach(cv=>{const i=+cv.dataset.u,u=f.units[i];figure(cv.getContext('2d'),mkFig(camp.pf,u,{x:75,y:122,H:sizeOf(u,92),t:0}))});
 o.onclick=e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.buy!=null){const i=+b.dataset.buy,u=f.units[i];if(camp.gold>=u.cost){camp.gold-=u.cost;camp.owned[i]=1;if(camp.eq.length<8)camp.eq.push(i);renderCamp()}}
  else if(b.dataset.eq!=null){const i=+b.dataset.eq,k=camp.eq.indexOf(i);if(k>=0){if(camp.eq.length>1)camp.eq.splice(k,1)}else if(camp.eq.length<8)camp.eq.push(i);camp.eq.sort((a,b)=>a-b);renderCamp()}}}
/* Schmiede */
const UPS=[
 ['a','Scharfer Stahl','Einheiten mit Stahlwaffen (Schwert, Speer, Axt, Reiter, Schwere): +6% Schaden',450,['blade','blunt','pole','cav','big']],
 ['r','Plattenpanzer','Alle Einheiten +6 Rüstung',600,'all'],
 ['c','Zeitelixier','Alle Wartezeiten 6% kürzer',500,'all'],
 ['h','Heiltrank','Alle Einheiten +8% Leben',400,'all'],
 ['s','Windtrunk','Alle Einheiten +6% Tempo',550,'all'],
 ['bow','Bogenmacher','Bogen und Armbrust: +8% Schaden, +5% Reichweite',500,'bow'],
 ['mage','Arkane Essenz','Magier: +10% Schaden',550,'mage'],
 ['pole','Speerdrill','Speere und Hellebarden: +8% Schaden, dazu +25% mehr Schaden gegen Reiter',450,'pole'],
 ['blade','Klingenmeister','Schwerter und Dolche: +10% Schaden',450,'blade'],
 ['blunt','Schlagkraft','Äxte, Hämmer und Keulen: +10% Schaden',450,'blunt'],
 ['cav','Sattler und Hufschmied','Reiter: +8% Schaden, +5% Tempo',600,'cav'],
 ['big','Riesenstärke','Riesen und Schwere: +10% Leben, +6% Schaden',650,'big'],
 ['shield','Schildwall','Einheiten mit Schild: 8% weniger Schaden durch Pfeile',500,'shield'],
 ['crit','Wetzstein','Nahkämpfer: 4% Chance auf Doppelschaden pro Stufe',500,['blade','blunt','pole','cav','big']],
 ['ra','Lederkoller','Bogen, Armbrust und Magier: +6 Rüstung',400,['bow','mage']],
 ['cdm','Schnellspanner','Bogen und Armbrust: 6% kürzere Schusspause',550,'bow'],
 ['fs','Lanzenspitzen','Reiter: +12% Schaden beim ersten Aufprall',500,'cav'],
 ['mrng','Seherglas','Magier: +8% Reichweite',450,'mage'],
 ['heal','Heilende Magie','Magier heilen Einheiten in ihrer Bahn innerhalb ihrer Schussreichweite (wächst mit dem Seherglas): 0,5% Leben pro Sekunde je Stufe (bis 1,5%)',900,'mage',3],
 ['u_rez','Wiederkehr','Totenerweckung: +5% Chance je Stufe, dass ein Gefallener als Skelett zurückkehrt (Grundwert 25%, bis 45%)',700,'all',4,'undead'],
 ['u_str','Starke Auferstandene','Zurückgekehrte Skelette: +20% Leben und +12% Schaden je Stufe',600,'#Skelette',3,'undead'],
 ['u_pest','Pestodem','Gegner im Umkreis von 11% der Feldbreite um deine Einheiten verlieren 0,4% Leben pro Sekunde je Stufe',800,'all',3,'undead'],
 ['o_rage','Blutrausch','Je besiegtem Gegner +0,3% Schaden je Stufe (höchstens +25%)',650,'all',3,'orcs'],
 ['o_roar','Kriegsgebrüll','Der Ansturm ist je Stufe 1 besiegten Gegner früher bereit',700,'all',3,'orcs'],
 ['o_hide','Dicke Haut','Trolle und Kriegsherren regenerieren 0,5% Leben pro Sekunde je Stufe',650,'#Troll,Kriegsherr',3,'orcs'],
 ['d_rune','Runenschmiede','Runenwaffen durchschlagen Rüstung: 6% weniger gegnerische Rüstung je Stufe',700,'all',4,'dwarves'],
 ['d_brew','Tiefenbräu','10 Sekunden nach dem Ansturm: +8% Schaden und 4% weniger erlittener Schaden je Stufe',750,'all',3,'dwarves'],
 ['d_fort','Bergfestung','Stehende Einheiten: +4 Rüstung je Stufe',600,'all',3,'dwarves'],
 ['e_bless','Waldsegen','Einheiten in der Bahn innerhalb der Schussreichweite eines Druiden (wächst mit dem Seherglas): +4% Schaden je Stufe',700,'all',3,'elves'],
 ['e_hawk','Falkenauge','Fernkämpfer: +6% Reichweite und +3% Trefferchance je Stufe',650,'bow',3,'elves'],
 ['e_moon','Mondlicht','Gegner verfehlen öfter: 4% Ausweichchance je Stufe',700,'all',4,'elves'],
 ['h_banner','Königsbanner','Einheiten in der Bahn im Umkreis von 16% der Feldbreite um einen Ritter oder Paladin: +4% Schaden je Stufe',700,'all',3,'humans'],
 ['h_siege','Belagerungswerk','Armbrustschütze und Hofmagier: +8% Schaden je Stufe',650,'#Armbrustschütze,Hofmagier',3,'humans'],
 ['h_guild','Gilde der Händler','Mehr Beute aus Eroberungen: +6% je Stufe',500,'gold',4,'humans']];
const AURA_IDS=['heal','e_bless','h_banner','u_pest'];
function upCost(l,k){const u=UPS.find(x=>x[0]===k);return Math.round(u[3]*(1+.45*l)/10)*10}
function renderForge(){const o=$('#cOther'),cls=new Set(FACTIONS[camp.pf].units.map(uclass));
 const card=u=>{const l=camp.up[u[0]]||0,cost=upCost(l,u[0]),max=l>=5;return '<div class="card"><b>'+u[1]+'</b><br>'+u[2]+'<br>Stufe '+l+' von 5<br><button class="btn" data-u="'+u[0]+'" '+(max||camp.gold<cost?'disabled':'')+'>'+(max?'Maximal':cost+' Gold')+'</button></div>'};
 const rel=u=>u[4]==='all'||(u[4]==='shield'?camp.pf!=='undead':cls.has(u[4]));
 let h='<p class="sub">Verbesserungen gelten für alle deine Einheiten der jeweiligen Art.</p><h2>Allgemein</h2><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">'+UPS.filter(u=>u[4]==='all').map(card).join('')+'</div><h2>Einheitentypen</h2><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">'+UPS.filter(u=>u[4]!=='all'&&rel(u)).map(card).join('')+'</div>';
 o.innerHTML=h;o.onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.u,l=camp.up[k]||0,c=upCost(l,k);if(camp.gold>=c&&l<5){camp.gold-=c;camp.up[k]=l+1;renderCamp()}}}
function playerMods(){const u=camp.up,g=k=>u[k]||0;const A=1+.06*g('a');return {a:1,r:6*g('r'),c:Math.max(.5,1-.06*g('c')),h:1+.08*g('h'),s:1+.06*g('s'),ua:{bow:1+.08*g('bow'),mage:1+.1*g('mage'),pole:A*(1+.08*g('pole')),blade:A*(1+.1*g('blade')),blunt:A*(1+.1*g('blunt')),cav:A*(1+.08*g('cav')),big:A*(1+.06*g('big'))},ur:{bow:(1+.05*g('bow'))*(1+.06*g('e_hawk')),mage:1+.08*g('mrng')},rz:.05*g('u_rez'),rsh:1+.2*g('u_str'),rsd:1+.12*g('u_str'),pt:.004*g('u_pest'),br:.003*g('o_rage'),cn:g('o_roar'),bg:.005*g('o_hide'),ap:.06*g('d_rune'),bw:.08*g('d_brew'),bwd:.04*g('d_brew'),fo:4*g('d_fort'),wb:.04*g('e_bless'),hk:.03*g('e_hawk'),dg:.04*g('e_moon'),bn:.04*g('h_banner'),un:{'Armbrustschütze':1+.08*g('h_siege'),'Hofmagier':1+.08*g('h_siege')},cr:.04*g('crit'),ra:{bow:6*g('ra'),mage:6*g('ra')},cdm:{bow:Math.max(.5,1-.06*g('cdm'))},fs:1+.12*g('fs'),hl:.005*g('heal'),uh:{big:1+.1*g('big')},us:{cav:1+.05*g('cav')},pk:1+.25*g('pole'),sh:1-.08*g('shield')}}
function modal(h,t,a,fa,b,fb){$('#mdH').textContent=h;$('#mdT').innerHTML=t;$('#mdA').textContent=a;$('#mdB').textContent=b;$('#mdB').style.display=b?'':'none';
 $('#mdA').onclick=()=>{$('#modal').classList.remove('on');fa&&fa()};$('#mdB').onclick=()=>{$('#modal').classList.remove('on');fb&&fb()};$('#modal').classList.add('on')}
function campWin(){fanCamp(true,camp.pf);try{localStorage.removeItem(SAVEKEY)}catch(e){}modal('Kampagne gewonnen','Das ganze Land gehört dir. Die Kampagne ist gewonnen.','Zum Menü',()=>show('sMenu'))}
function checkOver(){if(!camp.own.includes(camp.pf)){fanCamp(false,camp.pf);try{localStorage.removeItem(SAVEKEY)}catch(e){}modal('Alles verloren','Dein ganzes Land ist gefallen. Die Kampagne ist zu Ende.','Zum Menü',()=>show('sMenu'))}}
function nextOk(done){return ()=>{if(camp.own.includes(camp.pf))done()}}
function maybeRaid(p,done0){const done=nextOk(done0||(()=>{}));if(Math.random()>p)return done();const D=genMapData(),pf=camp.pf,cand=[];
 camp.own.forEach((o,e)=>{if(o===pf)return;D.adj[e].forEach(t=>{if(camp.own[t]===pf)cand.push([e,t])})});
 if(!cand.length)return done();const cap=FKEYS.indexOf(pf)*NC,nc=cand.filter(c=>c[1]!==cap),pool=nc.length?nc:cand,[e,t]=pool[Math.floor(Math.random()*pool.length)],af=camp.own[e],f=FACTIONS[af],cfg=regionCfg(e);
 const lose=()=>{camp.own[t]=af;saveCamp();renderCamp();checkOver()};
 modal('Überfall!','<span style="color:'+f.color+'">'+f.name+'</span> greift <b>'+D.names[t]+'</b> aus <b>'+D.names[e]+'</b> an. Verteidige es, sonst geht das Gebiet verloren.','Verteidigen',()=>{
  startBattle({L:pf,R:af,diff:cfg.sk*.9,useL:camp.eq.slice(),useR:enemyUse(cfg.n,af,e),mL:playerMods(),mR:defMods(),
   onEnd:w=>{if(w==='L'){camp.gold+=60;saveCamp();show('sCamp');renderCamp();done()}else{show('sCamp');lose();done()}},endLabel:'Zur Karte',
   gainFn:w=>w==='L'?D.names[t]+' gehalten. +60 Gold':D.names[t]+' ist verloren.'})},'Gebiet aufgeben',()=>{lose();done()})}
function skirmish(p,done0){const done=nextOk(done0||(()=>{}));if(Math.random()>p)return done();const D=genMapData(),pf=camp.pf,c=[];
 camp.own.forEach((x,a)=>{if(x===pf)return;D.adj[a].forEach(t=>{const y=camp.own[t];if(y!==pf&&y!==x)c.push([a,t])})});if(!c.length)return done();
 const [a,t]=c[Math.floor(Math.random()*c.length)],X=camp.own[a],Y=camp.own[t],ca=regionCfg(a),ct=regionCfg(t),fx=FACTIONS[X],fy=FACTIONS[Y];
 const base={L:X,R:Y,useL:enemyUse(ca.n,X,a),useR:enemyUse(ct.n,Y,t),mL:defMods(),mR:defMods()};
 const apply=w=>{const won=w==='L';if(won)camp.own[t]=X;saveCamp();renderCamp();return won};
 const nameX='<span style="color:'+fx.color+'">'+fx.name+'</span>',nameY='<span style="color:'+fy.color+'">'+fy.name+'</span>';
 modal('Krieg im Land',nameX+' greift <b>'+D.names[t]+'</b> ('+nameY+') aus <b>'+D.names[a]+'</b> an.','Zuschauen',()=>{
   startBattle(Object.assign({},base,{aiL:ca.sk,diff:ct.sk,watch:true,onEnd:w=>{apply(w);show('sCamp');done()},endLabel:'Zur Karte'}))},
  'Überspringen',()=>{const b=newBattle(Object.assign({},base,{aiL:ca.sk,aiR:ct.sk,fw:1400}));while(!b.over)step(b,.05);const won=apply(b.winner);
   modal('Ergebnis',won?nameX+' erobert <b>'+D.names[t]+'</b>.':nameY+' wehrt den Angriff auf <b>'+D.names[t]+'</b> ab.','Weiter',()=>done())})}
function runEvents(pRaid){const q=[d=>maybeRaid(pRaid,d),d=>skirmish(.85,d),d=>skirmish(.35,d)];(function next(){const f=q.shift();if(f)f(next)})()}
function attackNode(i){
 const ef=camp.own[i],cfg=regionCfg(i),pf=camp.pf,D=genMapData(),gain=rewardOf(i);
 startBattle({L:pf,R:ef,diff:cfg.sk,useL:camp.eq.slice(),useR:enemyUse(cfg.n,ef,i),mL:playerMods(),mR:Object.assign(defMods(),{h:1+cfg.b,a:1+cfg.b,c:cfg.cap?.92:1}),mem:(camp.aiMem||{})[ef],
  onEnd:w=>{{const lb=window.__lastBat||{},S0=lb.S;camp.aiMem=camp.aiMem||{};camp.aiMem[ef]={last:S0?S0.hist.slice(-3):[],aiWon:w!=='L',t:Math.round(lb.t||0)}}if(w==='L'){camp.own[i]=pf;camp.gold+=gain;camp.wins++;selNode=-1}else camp.gold+=40;saveCamp();show('sCamp');renderCamp();if(w==='L'&&camp.own.every(o=>o===pf)){campWin();return}setTimeout(()=>{fitMap();runEvents(w==='L'?.2:1)},80)},
  endLabel:'Zur Karte',gainFn:w=>w==='L'?D.names[i]+' erobert. Beute: '+gain+' Gold':'Trostpreis: 40 Gold'});
}
