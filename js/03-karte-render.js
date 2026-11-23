/* Kartengenerator und Rendering */
/* ===== Prozedurale Fantasy-Landkarte ===== */
const MW=2000,MH=1500,NC=8,OX=300,OY=330,MS=1.4,Z0=1.5;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function makeNoise(seed){const r=mulberry(seed),L=new Float32Array(64*64);for(let i=0;i<L.length;i++)L[i]=r();
 const sm=t=>t*t*(3-2*t);
 const n=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=sm(x-xi),yf=sm(y-yi),a=L[(yi&63)*64+(xi&63)],b=L[(yi&63)*64+((xi+1)&63)],c=L[((yi+1)&63)*64+(xi&63)],d=L[((yi+1)&63)*64+((xi+1)&63)];return a+(b-a)*xf+(c-a)*yf+(a-b-c+d)*xf*yf};
 return (x,y)=>(n(x,y)*.55+n(x*2.1+7,y*2.1+3)*.3+n(x*4.3+1,y*4.3+9)*.15)}
const REG_NAMES=[
 ['Königsfeld','Goldfurt','Weißmark','Hohenau','Lindenbruch','Eichenwall','Brückenstadt','Sonnental'],
 ['Silberhain','Mondwald','Laubthal','Sternenquell','Nebelwald','Tauwiese','Wurzelhain','Lichtung'],
 ['Schädelfels','Rauchgrat','Blutklamm','Eisenzahn','Aschenmark','Knochenpass','Feuerschlund','Kriegsmoor'],
 ['Steinhall','Tiefenschacht','Erzberg','Funkenheim','Runenpass','Amboss','Goldader','Hammerfeste'],
 ['Grabmoor','Knochenfeld','Düsterfenn','Totenwacht','Schattenmoor','Gruftheim','Nebelgrab','Aschentor']];
const CAPS=[[660,520],[310,370],[640,190],[1080,300],[1050,670]];
let MAPD=null;
function genMapData(){
 if(MAPD)return MAPD;
 const W=MW,H=MH,n1=makeNoise(5),n2=makeNoise(9),n3=makeNoise(31);
 const seeds=[];for(let c=0;c<5;c++){seeds.push({x:CAPS[c][0]+OX,y:CAPS[c][1]+OY,c,k:0});for(let k=1;k<NC;k++){const ang=(k-1)*2*Math.PI/(NC-1)+c*.7,rad=95+((k*37+c*11)%5)*17;seeds.push({x:CAPS[c][0]+OX+Math.cos(ang)*rad,y:CAPS[c][1]+OY+Math.sin(ang)*rad*.85,c,k})}}
 const NS=seeds.length,reg=new Int8Array(W*H),dist=new Float32Array(W*H),R=138;
 let bx0=1e9,bx1=-1e9,by0=1e9,by1=-1e9;for(const s of seeds){bx0=Math.min(bx0,s.x);bx1=Math.max(bx1,s.x);by0=Math.min(by0,s.y);by1=Math.max(by1,s.y)}bx0-=R*1.5;bx1+=R*1.5;by0-=R*1.5;by1+=R*1.5;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  if(x<bx0||x>bx1||y<by0||y>by1){reg[y*W+x]=-1;dist[y*W+x]=3;continue}
  const xo=x-OX,yo=y-OY,wx=x+(n1(xo*.008,yo*.008)-.5)*80,wy=y+(n1(xo*.008+50,yo*.008+20)-.5)*80;
  let best=1e9,bi=0;for(let s=0;s<NS;s++){const dx=wx-seeds[s].x,dy=wy-seeds[s].y,d=dx*dx+dy*dy;if(d<best){best=d;bi=s}}
  const rm=R*(.72+.6*n2(xo*.02+90,yo*.02)),d=Math.sqrt(best);
  reg[y*W+x]=d>rm?-1:bi;dist[y*W+x]=d/rm}
 const pix=Array.from({length:NS},()=>[]),sx=new Float64Array(NS),sy=new Float64Array(NS),adjC={};
 for(let y=0;y<H-1;y++)for(let x=0;x<W-1;x++){const i=y*W+x,r=reg[i];if(r<0)continue;pix[r].push(i);sx[r]+=x;sy[r]+=y;
  for(const j of[i+1,i+W]){const q=reg[j];if(q>=0&&q!==r){const a=Math.min(r,q),b=Math.max(r,q),key=a*64+b;adjC[key]=(adjC[key]||0)+1}}}
 const adj=Array.from({length:NS},()=>[]);for(const k in adjC){if(adjC[k]>=14){const a=Math.floor(k/64),b=k%64;adj[a].push(b);adj[b].push(a)}}
 const cent=[];for(let s=0;s<NS;s++){const n=pix[s].length||1;let cx=sx[s]/n,cy=sy[s]/n;
  if(reg[Math.round(cy)*W+Math.round(cx)]!==s&&pix[s].length){let bd=1e9,bp=pix[s][0];for(let q=0;q<pix[s].length;q+=7){const p=pix[s][q],px=p%W,py=(p/W)|0,d=(px-cx)*(px-cx)+(py-cy)*(py-cy);if(d<bd){bd=d;bp=p}}cx=bp%W;cy=(bp/W)|0}
  cent.push([cx,cy])}
 const names=[];for(let c=0;c<5;c++)for(let k=0;k<NC;k++)names.push(REG_NAMES[c][k]);
 const ISL=[[170,230,90],[1840,200,100],[110,1010,80],[1890,880,95],[620,1390,100],[1330,110,75],[1180,1400,70],[150,620,55],[1860,560,60]],isl=new Uint8Array(W*H),ni=makeNoise(123);
 for(const [ix,iy,ir] of ISL){const x0=Math.max(0,Math.floor(ix-ir*1.5)),x1=Math.min(W-1,Math.ceil(ix+ir*1.5)),y0=Math.max(0,Math.floor(iy-ir*1.5)),y1=Math.min(H-1,Math.ceil(iy+ir*1.5));
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const hd=Math.hypot(x-ix,y-iy)/(ir*(.74+.55*ni(x*.03,y*.03)));if(hd<1&&reg[y*W+x]<0)isl[y*W+x]=Math.max(isl[y*W+x],Math.min(255,Math.round(255*(1-hd))+1))}}
 MAPD={W,H,seeds,NS,reg,dist,pix,adj,cent,names,clu:seeds.map(s=>s.c),R,isl,ISL};
 return MAPD}
/* ---------- Rendering ---------- */
const PAL=[{a:[146,174,84],b:[190,186,98]},{a:[44,104,58],b:[76,140,70]},{a:[120,86,64],b:[160,118,80]},{a:[150,150,156],b:[206,208,214]},{a:[92,84,112],b:[120,112,126]}];
function mixa(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}
let MBASE=null,MTINT=null;

function lavaCol(q,x,y,n1){const e=q/255,cr=n1(x*.05,y*.05),cr2=n1(x*.11+9,y*.11+4),rg=Math.abs(cr2-.5);
 if(e<.1)return mixa([58,52,50],[96,84,74],cr);
 let col=mixa([40,30,32],[84,64,58],cr);const th=.03+.05*e;
 if(rg<th){const k=1-rg/th;col=mixa(col,[255,150,40],k*.95);if(k>.6)col=mixa(col,[255,226,120],(k-.6)*1.6)}
 else if(rg<th*1.8)col=mixa(col,[120,40,20],.35*(1-(rg-th)/(th*.8)));
 if(e>.65&&cr>.62)col=mixa(col,[255,110,30],.55);
 return col}
function renderMapBase(){
 if(MBASE)return MBASE;
 const D=genMapData(),W=D.W,H=D.H,n1=makeNoise(41),n2=makeNoise(77),rnd=mulberry(2024);
 const cv=document.createElement('canvas');cv.width=W;cv.height=H;const c0=cv.getContext('2d'),img=c0.createImageData(W,H),px=img.data;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const i=y*W+x,r=D.reg[i],d=D.dist[i];let col;
  const vx=(x-W/2)/(W/2),vy=(y-H/2)/(H/2),vig=1-.28*(vx*vx+vy*vy)*.7;
  if(r<0){const q=D.isl[i];if(q>0){col=lavaCol(q,x,y,n1)}else{const sh=Math.max(0,1-(d-1)*2.2),w=n2(x*.05+y*.01,y*.09)*.5+Math.sin(x*.06+y*.02+n1(x*.01,y*.01)*9)*.05;
   col=mixa([38,86,122],[104,172,190],sh*.85+w*.2);if(d<1.12)col=mixa(col,[196,226,222],.35*(1-(d-1)/.12));if(D.isl[i+4]||D.isl[i-4]||D.isl[i+4*W]||D.isl[i-4*W])col=mixa(col,[214,228,224],.5)}}
  else{const p=PAL[D.clu[r]],n=.25+.5*n1(x*.045,y*.045),hl=(n1(x*.045+2,y*.045)-n1(x*.045-2,y*.045))*4;
   col=mixa(p.a,p.b,n);const rv=((r*53)%17)/17-.5;col=[col[0]+rv*26,col[1]+rv*20,col[2]+rv*20];
   col=col.map(v=>v*(1+hl*.1));
   if(d>.9)col=mixa(col,[222,206,158],Math.min(1,(d-.9)/.08)*.8);
   if(d>.975)col=mixa(col,[70,60,40],Math.min(1,(d-.975)/.025)*.9);
   if(((x*7+y*13)%11)===0)col=col.map(v=>v*.96);
   const q=i+1,q2=i+W,q3=i-1,q4=i-W;
   if((D.reg[q]>=0&&D.reg[q]!==r)||(D.reg[q2]>=0&&D.reg[q2]!==r)||(D.reg[q3]>=0&&D.reg[q3]!==r&&((x+y)&3)<3)||(D.reg[q4]>=0&&D.reg[q4]!==r&&((x+y)&3)<3))col=mixa(col,[60,40,22],.78)}
  const k=i*4;px[k]=Math.max(0,Math.min(255,col[0]*vig));px[k+1]=Math.max(0,Math.min(255,col[1]*vig));px[k+2]=Math.max(0,Math.min(255,col[2]*vig));px[k+3]=255}
 c0.putImageData(img,0,0);
 const big=document.createElement('canvas');big.width=Math.round(W*MS);big.height=Math.round(H*MS);const c=big.getContext('2d');c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(cv,0,0,big.width,big.height);c.scale(MS,MS);
 // Symbole
 const items=[];
 for(let s=0;s<D.NS;s++){const cl=D.clu[s],P=D.pix[s],cnt=[7,32,13,15,14][cl];let tries=0,got=0;
  while(got<cnt&&tries<cnt*12&&P.length){tries++;const p=P[Math.floor(rnd()*P.length)],x=p%W,y=(p/W)|0;if(D.dist[p]>.8)continue;
   const cc=D.cent[s];if(Math.hypot(x-cc[0],y-cc[1])<20)continue;items.push({x,y,cl,t:rnd(),s});got++}}
 items.sort((a,b)=>a.y-b.y);
 const tree=(x,y,z,col)=>{c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x+1,y+1,z*.7,z*.3,0,0,7);c.fill();c.fillStyle='#4a2f1a';c.fillRect(x-1,y-z*.4,2,z*.5);c.fillStyle=col;c.beginPath();c.moveTo(x,y-z*1.5);c.lineTo(x+z*.6,y-z*.2);c.lineTo(x-z*.6,y-z*.2);c.fill();c.beginPath();c.moveTo(x,y-z*1.1);c.lineTo(x+z*.7,y+0);c.lineTo(x-z*.7,y);c.fill()};
 const mount=(x,y,z,body,snow)=>{c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x+z*.3,y+1,z*.9,z*.25,0,0,7);c.fill();c.fillStyle=body;c.beginPath();c.moveTo(x-z,y);c.lineTo(x-z*.2,y-z*1.2);c.lineTo(x+z*.2,y-z*.9);c.lineTo(x+z*.5,y-z*1.4);c.lineTo(x+z,y);c.fill();c.fillStyle=lt(body,.2);c.beginPath();c.moveTo(x+z*.5,y-z*1.4);c.lineTo(x+z,y);c.lineTo(x+z*.3,y);c.fill();if(snow){c.fillStyle='#fff';c.beginPath();c.moveTo(x-z*.2,y-z*1.2);c.lineTo(x-z*.5,y-z*.75);c.lineTo(x,y-z*.85);c.lineTo(x+z*.2,y-z*.9);c.fill();c.beginPath();c.moveTo(x+z*.5,y-z*1.4);c.lineTo(x+z*.25,y-z*1);c.lineTo(x+z*.62,y-z*.95);c.fill()}};
 const house=(x,y,z)=>{c.fillStyle='#e8dcc0';c.fillRect(x-z*.6,y-z*.6,z*1.2,z*.6);c.fillStyle='#a8452e';c.beginPath();c.moveTo(x-z*.8,y-z*.6);c.lineTo(x,y-z*1.2);c.lineTo(x+z*.8,y-z*.6);c.fill()};
 const dead=(x,y,z)=>{c.strokeStyle='#2c2230';c.lineWidth=1.4;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-z);c.moveTo(x,y-z*.6);c.lineTo(x-z*.4,y-z*.95);c.moveTo(x,y-z*.4);c.lineTo(x+z*.4,y-z*.8);c.stroke()};
 const tomb=(x,y,z)=>{c.fillStyle='#b8b4c4';c.beginPath();c.moveTo(x-z*.4,y);c.lineTo(x-z*.4,y-z*.7);c.arc(x,y-z*.7,z*.4,3.14,0);c.lineTo(x+z*.4,y);c.fill()};
 for(const it of items){const z=5+it.t*5;
  if(it.cl===0){if(it.t<.5)house(it.x,it.y,z*.9);else tree(it.x,it.y,z*.9,'#4f7a36')}
  else if(it.cl===1)tree(it.x,it.y,z*1.1,it.t<.5?'#25603a':'#2f7a3c');
  else if(it.cl===2)mount(it.x,it.y,z*1.4,'#5a4034',false);
  else if(it.cl===3)mount(it.x,it.y,z*1.5,'#7e838c',true);
  else{if(it.t<.35)dead(it.x,it.y,z*1.8);else if(it.t<.55)tomb(it.x,it.y,z*.9);else{c.fillStyle='rgba(30,60,60,.55)';c.beginPath();c.ellipse(it.x,it.y,z*1.4,z*.5,0,0,7);c.fill()}}}
 // Hauptstädte
 for(let cl=0;cl<5;cl++){const s=cl*NC,cc=D.cent[s],x=cc[0],y=cc[1];c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(x,y+3,20,6,0,0,7);c.fill();
  c.fillStyle='#d9ccb0';c.fillRect(x-14,y-18,28,18);c.fillStyle='#bba98a';c.fillRect(x-20,y-26,10,26);c.fillRect(x+10,y-26,10,26);
  c.fillStyle='#6d5a42';c.fillRect(x-3,y-9,6,9);c.fillStyle=FACTIONS[FKEYS[cl]].color;for(const tx of[x-15,x+15]){c.beginPath();c.moveTo(tx,y-26);c.lineTo(tx,y-36);c.lineTo(tx+9,y-33);c.lineTo(tx,y-30);c.fill();c.strokeStyle='#333';c.beginPath();c.moveTo(tx,y-26);c.lineTo(tx,y-37);c.stroke()}
  c.fillStyle='#8a7a5f';for(let i=-2;i<=2;i++)c.fillRect(x-20+i*0+ (i+2)*8,y-28,4,3)}
 // Meer-Deko
 const ship=(x,y,z)=>{c.fillStyle='#4a3020';c.beginPath();c.moveTo(x-z,y);c.lineTo(x+z,y);c.lineTo(x+z*.6,y+z*.4);c.lineTo(x-z*.6,y+z*.4);c.fill();c.strokeStyle='#3a2616';c.lineWidth=1.5;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-z*1.5);c.stroke();c.fillStyle='#f1e8d0';c.beginPath();c.moveTo(x,y-z*1.5);c.lineTo(x+z*.9,y-z*.2);c.lineTo(x,y-z*.2);c.fill()};
 ship(330,330,16);ship(1700,1250,14);ship(300,1250,13);ship(1650,330,12);ship(950,1330,12);ship(1760,700,13);ship(250,800,12);
 c.save();c.translate(420,330);c.strokeStyle='#2b5a35';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(1300,480);c.quadraticCurveTo(1318,440,1336,480);c.quadraticCurveTo(1352,520,1370,480);c.stroke();c.fillStyle='#2b5a35';c.beginPath();c.arc(1300,479,7,0,7);c.fill();c.restore();
 const volcano=(x,y,z)=>{c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(x+z*.2,y+2,z*1.3,z*.35,0,0,7);c.fill();c.fillStyle='#3a2a2c';c.beginPath();c.moveTo(x-z*1.2,y);c.lineTo(x-z*.35,y-z*1.5);c.lineTo(x+z*.35,y-z*1.5);c.lineTo(x+z*1.2,y);c.fill();c.fillStyle='#54403c';c.beginPath();c.moveTo(x+z*.35,y-z*1.5);c.lineTo(x+z*1.2,y);c.lineTo(x+z*.3,y);c.fill();
  c.fillStyle='#ff7a22';c.beginPath();c.ellipse(x,y-z*1.5,z*.38,z*.14,0,0,7);c.fill();c.fillStyle='#ffd877';c.beginPath();c.ellipse(x,y-z*1.52,z*.2,z*.07,0,0,7);c.fill();
  c.strokeStyle='#ff8a2a';c.lineWidth=Math.max(1.5,z*.1);c.lineCap='round';c.beginPath();c.moveTo(x-z*.1,y-z*1.4);c.quadraticCurveTo(x-z*.5,y-z*.8,x-z*.3,y-z*.2);c.stroke();c.beginPath();c.moveTo(x+z*.15,y-z*1.4);c.quadraticCurveTo(x+z*.4,y-z*.9,x+z*.6,y-z*.3);c.stroke();
  c.fillStyle='rgba(70,64,66,.55)';for(let i=0;i<4;i++){c.beginPath();c.arc(x+i*z*.18,y-z*(1.9+i*.45),z*(.3+i*.08),0,7);c.fill()}};
 const rock=(x,y,z)=>{c.fillStyle='#2e2426';c.beginPath();c.ellipse(x,y,z,z*.6,0,0,7);c.fill();c.fillStyle='#4a3a38';c.beginPath();c.ellipse(x-z*.2,y-z*.15,z*.5,z*.3,0,0,7);c.fill()};
 for(const [ix,iy,ir] of D.ISL){const gl=c.createRadialGradient(ix,iy,ir*.1,ix,iy,ir*1.5);gl.addColorStop(0,'rgba(255,120,30,.42)');gl.addColorStop(1,'rgba(255,120,30,0)');c.fillStyle=gl;c.beginPath();c.arc(ix,iy,ir*1.5,0,7);c.fill();volcano(ix,iy+ir*.2,ir*.46);for(let q=0;q<5;q++){const a=rnd()*6.28,rr=ir*(.3+rnd()*.35);rock(ix+Math.cos(a)*rr,iy+Math.sin(a)*rr*.8,3+rnd()*5)}}

 // Kompass
 const kx=210,ky=1290;c.save();c.translate(kx,ky);c.strokeStyle='#f2e4b8';c.fillStyle='#f2e4b8';c.lineWidth=1.5;c.beginPath();c.arc(0,0,34,0,7);c.stroke();
 for(let i=0;i<4;i++){c.save();c.rotate(i*Math.PI/2);c.beginPath();c.moveTo(0,-46);c.lineTo(7,-7);c.lineTo(0,0);c.lineTo(-7,-7);c.fill();c.restore()}
 c.rotate(Math.PI/4);for(let i=0;i<4;i++){c.save();c.rotate(i*Math.PI/2);c.beginPath();c.moveTo(0,-26);c.lineTo(4,-4);c.lineTo(-4,-4);c.fillStyle='#d8c690';c.fill();c.restore()}c.restore();
 c.fillStyle='#f2e4b8';c.font='bold 14px Georgia';c.textAlign='center';c.fillText('N',kx,ky-52);
 // Rahmen
 c.strokeStyle='#3a2a14';c.lineWidth=8;c.strokeRect(0,0,W,H);c.strokeStyle='#c9a45a';c.lineWidth=2;c.strokeRect(6,6,W-12,H-12);
 MBASE=big;return big}

/* Besitz-Überlagerung */
function buildTint(own,attackable,selId){
 const D=genMapData(),W=D.W,c1=document.createElement('canvas');c1.width=W;c1.height=D.H;const x=c1.getContext('2d'),img=x.createImageData(W,D.H),p=img.data;
 const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
 const pl=camp?camp.pf:null;
 for(let s=0;s<D.NS;s++){const col=rgb(FACTIONS[own[s]].color),dc=col.map(v=>Math.round(v*.55)),mine=own[s]===pl;
  for(const i of D.pix[s]){const k=i*4,px=i%W,py=(i/W)|0;
   let edge=false;for(const o of[1,2,-1,-2,W,2*W,-W,-2*W]){const j=i+o;if(j<0||j>=D.reg.length)continue;const r=D.reg[j];if(r<0||own[r]!==own[s]){edge=true;break}}
   if(edge){p[k]=dc[0];p[k+1]=dc[1];p[k+2]=dc[2];p[k+3]=235}
   else{p[k]=col[0];p[k+1]=col[1];p[k+2]=col[2];p[k+3]=mine?125:90}
   if(s===selId&&!edge){p[k]=255;p[k+1]=255;p[k+2]=255;p[k+3]=95}}}
 x.putImageData(img,0,0);
 const g=document.createElement('canvas');g.width=W;g.height=D.H;const gx=g.getContext('2d'),gi=gx.createImageData(W,D.H),gp=gi.data;
 for(const s of attackable)for(const i of D.pix[s]){const k=i*4;gp[k]=255;gp[k+1]=215;gp[k+2]=90;gp[k+3]=255}
 gx.putImageData(gi,0,0);
 return {tint:c1,glow:g}}
function mapSwords(ctx,x,y,crossed,t){
 const one=(ax,ay,a)=>{ctx.save();ctx.translate(ax,ay);ctx.rotate(a);ctx.lineCap='round';
  ctx.strokeStyle='#14110a';ctx.lineWidth=5.2;ctx.beginPath();ctx.moveTo(0,-13);ctx.lineTo(0,5);ctx.moveTo(-5,5);ctx.lineTo(5,5);ctx.stroke();
  ctx.strokeStyle='#f4f6f8';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-13);ctx.lineTo(0,5);ctx.stroke();
  ctx.strokeStyle='#f2d58a';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-5,5);ctx.lineTo(5,5);ctx.stroke();
  ctx.strokeStyle='#8a5a2a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,5);ctx.lineTo(0,10);ctx.stroke();ctx.restore()};
 if(crossed){ctx.save();ctx.globalAlpha=.35+.25*Math.sin(t*5);ctx.fillStyle='#ffd24a';ctx.beginPath();ctx.arc(x,y,17,0,7);ctx.fill();ctx.restore()}
 one(x,y,-.7);one(x,y,.7)}
function drawMap(ctx,own,pl,T,t,attackable,selId){
 const D=genMapData();ctx.drawImage(renderMapBase(),0,0);ctx.drawImage(T.tint,0,0,mapCv.width,mapCv.height);
 ctx.globalAlpha=.18+.14*Math.sin(t*3.2);ctx.drawImage(T.glow,0,0,mapCv.width,mapCv.height);ctx.globalAlpha=1;ctx.save();ctx.scale(MS,MS);
 ctx.textAlign='center';ctx.lineJoin='round';for(let s=0;s<D.NS;s++){const cc=D.cent[s],cap=s%NC===0,nm=(typeof tr==='function')?tr(D.names[s]):D.names[s];ctx.font=(cap?'bold 15px':'italic bold 12px')+' Georgia, serif';ctx.lineWidth=3.5;ctx.strokeStyle='rgba(25,15,5,.85)';const ty=cc[1]+(cap?18:12);ctx.strokeText(nm,cc[0],ty);ctx.fillStyle='#fff6d8';ctx.fillText(nm,cc[0],ty)}
 ctx.textAlign='left';
 for(let s=0;s<D.NS;s++){const cc=D.cent[s],col=FACTIONS[own[s]].color,x=cc[0],y=cc[1];
  const px=cc[0]-22,py=cc[1]-2;if(true){ctx.strokeStyle='#2a1a0a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py-22);ctx.stroke();ctx.fillStyle=col;ctx.beginPath();const w=Math.sin(t*3+s)*1.5;ctx.moveTo(px,py-22);ctx.quadraticCurveTo(px+8,py-22+w,px+15,py-19+w);ctx.lineTo(px,py-13);ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=.8;ctx.stroke()}
  if(own[s]===pl){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px,py-24,3,0,7);ctx.fill()}
  else if(attackable.includes(s)){mapSwords(ctx,cc[0]+21,cc[1]-14,s===selId,t);if(typeof PCT!=='undefined'&&PCT[s]!=null){ctx.font='bold 12px Georgia';ctx.textAlign='left';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(PCT[s]+'%',cc[0]+32,cc[1]-9);ctx.fillStyle='#ffe08a';ctx.fillText(PCT[s]+'%',cc[0]+32,cc[1]-9)}}}
ctx.restore()}

