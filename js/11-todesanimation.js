/* Todesanimationen mit Blut */
/* ---------- v0.40: Todesanimationen mit Blut ----------
   Beim Tod wird die Figur je nach Waffe zerteilt, weggeschleudert oder mit steckenden Pfeilen und Speeren hingelegt.
   Teile werden mit der normalen Figurenzeichnung und Clip-Flaechen erzeugt, Blut ist ein Tropfensystem plus Bodenschicht. */
const GORE={objs:[],drops:[],bits:[],layer:null,lc:null,ls:1,fadeT:0};
const GORE_PEST={w:'pest',dx:0,ov:0};
function goreReset(){GORE.objs=[];GORE.drops=[];GORE.bits=[];GORE.layer=null;GORE.lc=null}
function goreLevel(){return OPT.gore==='off'?0:OPT.gore==='low'?1:OPT.gore==='high'?3:2}
function goreWeapon(fk,d){if(d._gw)return d._gw;const w=(LOOK[fk+':'+d.n]||{}).w||'',k=d.k;let r;
 if(w==='axejav'||w==='axe'||w==='axe2'||w==='halberd')r='cleave';else if(w==='hammerjav'||w==='hammer'||w==='maul'||w==='club')r='blunt';
 else if(w==='jav'||w==='spear')r='pierce';else if(w==='bow')r='arrow';else if(w==='xbow')r='bolt';else if(w==='gun')r='shot';
 else if(k==='mage'||w==='mage')r='magic';else if(w==='claw'||k==='claw')r='claw';else if(k==='big')r='blunt';else if(k==='cav')r='pierce';else r='slash';
 d._gw=r;d._gth=w.indexOf('jav')>=0;return r}
function goreBloodCol(g){return g.skel?'#e6e0c4':g.gh?'#42602a':g.fk==='orcs'?'#6a1c12':'#a31616'}
function goreSpawn(b,u){const lv=goreLevel();if(!lv)return false;
 const fk=b.f[u.side],d=u.d,L=LOOK[fk+':'+d.n]||{},lk=u.lk||{w:'slash',dx:u.side==='L'?-1:1,ov:0};
 const big=d.k==='big'||d.k==='ent',cav=!!L.m||d.k==='cav',gh=!!L.gh,skel=fk==='undead'&&!L.hv&&d.k!=='mage'&&!gh;
 const g={fk,d,x:u.x,lane:u.lane,yo:u.yo,dir:u.side==='L'?1:-1,ph:u.ph||0,wt:u.wt||0,age:0,w:lk.w,th:!!lk.th,big,cav,skel,gh,pcs:[],bursts:[],life:big?12:9,
  cloth:(b.f.L===b.f.R&&u.side==='R')?'#b8332e':null,back:lk.dx||0,ov:Math.min(2,lk.ov||0),orb:lk.ox,lv,first:true,spurt:null,pool:false};
 g.col=lk.w==='pest'?'#6c8a2a':goreBloodCol(g);
 const seat=cav?(MT[L.m||'horse']||MT.horse).seat*1.2:.44;g.hy=-(seat+.44);g.sh=g.hy+.14;g.waist=cav?-(seat+.18):-.60;
 goreVariant(g);
 GORE.objs.push(g);const cap=lv===1?22:lv===2?44:80;while(GORE.objs.length>cap)GORE.objs.shift();
 return true}
function goreVariant(g){const R=(a,b,c,d)=>[[a,b],[c,b],[c,d],[a,d]],rnd=Math.random,bk=(g.back*g.dir)||-1,sg=()=>rnd()<.5?-1:1;
 const HEAD=R(-.36,g.hy-.38,.40,g.hy+.12),ARM=R(.17,g.sh-.2,.80,g.sh+.38),neckY=g.hy+.10;
 const body=(o)=>{const p=Object.assign({pv:[0,0],ox:0,oy:0,vx:bk*.35,vy:0,a:0,w:0,fall:0,fd:.55,delay:0,clip:null,excl:[],over:[],role:'body',fly:false},o||{});g.pcs.push(p);return p};
 const part=(clip,pv,v,w,over)=>{const p={pv,ox:0,oy:0,vx:v[0],vy:v[1],a:0,w,fall:0,clip,excl:null,over:over||[],role:'part',bn:0,rest:false};g.pcs.push(p);return p};
 const burst=(fx,fy,n,sp,ang,spr)=>g.bursts.push({fx,fy,n,sp,ang,spr});
 const cap=(x,y,w)=>({t:'cap',x,y,w}),W0=g.w;
 const decap=()=>{const b=body({excl:[HEAD],over:[cap(.02,neckY,.075)]});part([HEAD],[0,g.hy+.02],[bk*(.7+rnd()*.9),-(1.9+rnd()*1.3)],sg()*(4+rnd()*6),[cap(.02,neckY,.075)]);burst(.02,neckY,26,2.3,-1.45,.7);g.spurt={fx:.02,fy:neckY,until:.95,rate:38}};
 const arm=()=>{body({excl:[ARM],over:[cap(.17,g.sh+.1,.06)]});part([ARM],[.17,g.sh+.1],[bk*.8,-1.2],sg()*(5+rnd()*4),[cap(.17,g.sh+.1,.06)]);burst(.17,g.sh+.1,20,2,-1.2,.9);g.spurt={fx:.17,fy:g.sh+.1,until:.7,rate:26}};
 const bisect=()=>{const ang=(rnd()-.5)*.7,s=Math.tan(ang),y=g.waist,UP=[[-1.1,-2.8],[1.1,-2.8],[1.1,y+s*1.1],[-1.1,y-s*1.1]],LOW=[[-1.1,y-s*1.1],[1.1,y+s*1.1],[1.1,.6],[-1.1,.6]],band={t:'band',x:0,y,w:.17,a:ang};
  body({clip:[LOW],over:[band],delay:.22,fd:.5});part([UP],[0,y],[bk*.9,-.55],-1*Math.abs(bk)*(2.5+rnd()*2)*(bk<0?1:-1),[band]);burst(0,y,36,2,-1.1,1.2);g.spurt={fx:0,fy:y,until:.8,rate:30}};
 const gash=(big)=>{const a=-.5+rnd()*1;body({over:[{t:'gash',x:0,y:g.waist-.1,a,l:big?.4:.28}]});burst(0,g.waist-.1,big?26:16,1.8,-.9,1)};
 const headcrush=()=>{body({excl:[HEAD],over:[{t:'splat',x:.02,y:g.hy,r:.17}],vx:bk*1.4,vy:-.9,fly:true,fd:.5});burst(.02,g.hy,34,2.2,-1.6,2.4)};
 const fling=()=>{body({over:[{t:'gash',x:0,y:g.waist-.12,a:.3,l:.3}],vx:bk*(2+rnd()),vy:-(1.2+rnd()*.8),fly:true,fd:.7});burst(0,g.waist-.12,20,2,-1,1.4)};
 const headpop=()=>{body({excl:[HEAD],over:[cap(.02,neckY,.075)]});part([HEAD],[0,g.hy+.02],[bk*1.2,-2.4],sg()*7,[cap(.02,neckY,.075)]);burst(.02,neckY,28,2.4,-1.5,.9);g.chips=6;g.spurt={fx:.02,fy:neckY,until:.7,rate:26}};
 const crumple=()=>{body({fd:.34,over:[{t:'splat',x:0,y:g.waist-.1,r:.12}]});burst(0,g.waist-.1,14,1.6,-1,1.4)};
 const shatter=()=>{const r=rnd();if(r<.45){const HB=cap(.02,neckY,.06);body({excl:[HEAD],over:[HB]});part([HEAD],[0,g.hy+.02],[bk*(.8+rnd()),-(2+rnd()*1.2)],sg()*(5+rnd()*6),[HB])}else if(r<.8)bisect();else arm();g.chips=14;burst(0,g.waist,8,1.6,-1,1.3)};
 const ash=()=>{body({ash:true,fd:1});g.ashCol=g.orb||'#ff9a3a'};
 const arrows=(n,len)=>{const ov=[];for(let i=0;i<n;i++)ov.push({t:'arrow',x:-.08+rnd()*.2,y:g.hy+.16+rnd()*(g.waist-g.hy),a:-(.2+rnd()*.55),l:len*(.9+rnd()*.25)});return ov};
 if(g.skel&&(W0==='slash'||W0==='cleave'||W0==='blunt'||W0==='claw'||W0==='pierce'))return shatter();
 const r=rnd();
 switch(W0){
  case 'slash':if(r<.30)decap();else if(r<.52)arm();else if(r<.70&&!g.cav&&!g.big)bisect();else gash(false);break;
  case 'cleave':if(g.th){body({over:[{t:'axe',x:.06,y:g.waist-.14,a:-.5}]});burst(.06,g.waist-.14,22,1.8,-.8,1.1);break}
   if(r<.34)decap();else if(r<.60&&!g.cav)bisect();else if(r<.80)arm();else gash(true);break;
  case 'blunt':if(g.th){body({over:[{t:'dent',x:.04,y:g.waist-.16}],vx:bk*1.2,vy:-.7,fly:true,fd:.5});burst(.04,g.waist-.16,18,1.8,-.8,1.2);break}
   if(r<.32)headcrush();else if(r<.58)fling();else if(r<.80)headpop();else crumple();break;
  case 'pierce':if(g.th){const b=body({over:[{t:'spear',x:.05,y:g.waist-.10,a:-.28+rnd()*.2,l:.8+rnd()*.2,brk:0}]});burst(.05,g.waist-.1,20,1.7,-.8,1);b.vx=bk*.5}
   else{body({over:[{t:'gash',x:.02,y:g.waist-.05,a:-.15,l:.2}].concat(rnd()<.3?[{t:'spear',x:.04,y:g.waist-.05,a:-.2,l:.25,brk:1}]:[]),vx:bk*.7});burst(-.08,g.waist-.05,22,2.6,Math.PI+.2*(bk>0?1:-1),.7);burst(.04,g.waist-.05,10,1.4,-.2,.8)}break;
  case 'arrow':case 'bolt':{const n=W0==='bolt'?1+(rnd()<.4?1:0):1+Math.floor(rnd()*3);if(n===1&&rnd()<.35){body({over:[{t:'arrow',x:.1,y:g.hy-.02,a:-.12,l:W0==='bolt'?.24:.34}],vx:bk*.9,fd:.5});burst(.1,g.hy,16,1.6,-.4,.9)}
   else{body({over:arrows(n,W0==='bolt'?.24:.34),vx:bk*.6});burst(0,g.waist-.1,10+n*4,1.5,-.6,1)}break}
  case 'shot':body({over:[{t:'hole',x:.06,y:g.waist-.14}],vx:bk*1.3,vy:-.4,fly:true,fd:.45});burst(-.12,g.waist-.14,22,2.8,Math.PI+.15*(bk>0?-1:1),.7);break;
  case 'magic':ash();break;
  case 'claw':if(r<.3)arm();else{body({over:[{t:'claw',x:0,y:g.waist-.15}]});burst(0,g.waist-.15,22,1.8,-.9,1.2)}break;
  default:body({over:[],vx:bk*.3});burst(0,g.waist-.1,10,1.3,-.8,1)}}
function goreBodyPt(pc,fx,fy){const e=pc.fall>0?eo(pc.fall):0,a=-e*1.48,ca=Math.cos(a),sa=Math.sin(a);return[fx*ca-fy*sa+pc.ox,fx*sa+fy*ca-.04*e+pc.oy]}
function goreStepObj(g,dt){g.age+=dt;const G=7;
 for(const pc of g.pcs){
  if(pc.role==='body'){if(g.age<(pc.delay||0))continue;pc.fall=Math.min(1,pc.fall+dt/pc.fd);
   if(pc.fly){pc.vy+=G*dt;pc.ox+=pc.vx*dt;pc.oy+=pc.vy*dt;if(pc.oy>=0){pc.oy=0;pc.vx*=.45;pc.vy=0;pc.fly=false}}else{pc.ox+=pc.vx*dt;pc.vx*=Math.pow(.03,dt)}}
  else if(!pc.rest){pc.vy+=G*dt;pc.ox+=pc.vx*dt;pc.oy+=pc.vy*dt;pc.a+=pc.w*dt;const gnd=-pc.pv[1]-.06;
   if(pc.oy>gnd){pc.oy=gnd;if(Math.abs(pc.vy)>.7&&pc.bn<3){pc.vy*=-.3;pc.vx*=.6;pc.w*=.55;pc.bn++;pc.hitG=true}else{pc.vy=0;pc.vx*=.7;pc.w*=.5;if(Math.abs(pc.vx)<.05&&Math.abs(pc.w)<.2)pc.rest=true}}}}}
function goreDecal(x,y,r,col,al){const L=GORE.lc;if(!L)return;L.save();L.globalAlpha=al;L.fillStyle=col;const ls=GORE.ls;L.setTransform(ls,0,0,ls,0,0);
 L.beginPath();L.ellipse(x,y,r,r*.5,0,0,7);L.fill();for(let i=0;i<3;i++){L.beginPath();L.ellipse(x+(Math.random()-.5)*r*2.1,y+(Math.random()-.5)*r*.9,r*(.25+Math.random()*.3),r*.14,0,0,7);L.fill()}L.restore()}
function goreGround(c){if(!goreLevel())return;
 if(!GORE.layer||GORE.lw!==cw||GORE.lh!==ch){GORE.ls=Math.min(dpr,1.5);GORE.layer=document.createElement('canvas');GORE.layer.width=Math.round(cw*GORE.ls);GORE.layer.height=Math.round(ch*GORE.ls);GORE.lc=GORE.layer.getContext('2d');GORE.lw=cw;GORE.lh=ch}
 c.drawImage(GORE.layer,0,0,cw,ch)}
function goreBlood(g,px,py,n,speed,ang,spread,U,sx,gy){const lv=g.lv,k=lv===1?.5:lv===2?1:1.7,col=g.col;n=Math.round(n*k);const cap=lv===1?200:lv===2?380:650;
 for(let i=0;i<n&&GORE.drops.length<cap;i++){const a=ang+(Math.random()-.5)*Math.PI*spread*.7,v=U*speed*(.4+Math.random()*.9);
  const X=sx+g.dir*px*U,Y=gy+py*U;GORE.drops.push({x:X,y:Y,vx:g.dir*Math.cos(a)*v,vy:Math.sin(a)*v,gr:U*11,sz:Math.max(1.4,U*(.025+Math.random()*.03)),gy:gy+(Math.random()-.5)*U*.1,col,t:2.5,skel:g.skel})}}
function goreBits(g,px,py,n,U,sx,gy,kind,col){const cap=g.lv===1?60:g.lv===2?140:260;
 for(let i=0;i<n&&GORE.bits.length<cap;i++){const a=-Math.PI/2+(Math.random()-.5)*2.4,v=U*(.8+Math.random()*2);
  GORE.bits.push({x:sx+g.dir*px*U,y:gy+py*U,vx:Math.cos(a)*v,vy:Math.sin(a)*v,gr:U*9,r:U*(.012+Math.random()*.02),rot:Math.random()*6,w:(Math.random()-.5)*14,t:kind==='ember'?1.1+Math.random()*.8:3+Math.random()*3,max:2,kind,col:col||'#e8e2c8',gy:gy+(Math.random()-.5)*U*.1})}}
function goreItems(items,c,top,lh,X,baseH,t,dt){
 for(const g of GORE.objs){const l=g.lane,s=pf(l),Hf=sizeOf(g.d,baseH*s),U=Hf*FPROP[g.fk].h,sx=X(g.x),gy=top+(l+.5)*lh+g.yo*lh*.55+lh*.3;
  goreStepObj(g,dt);items.push({y:top+(l+.5)*lh+g.yo*lh*.55-1,fn:()=>goreDraw(c,g,Hf,U,sx,gy,t)})}
 GORE.objs=GORE.objs.filter(g=>g.age<g.life)}
function goreSettled(g){if(g.age>4)for(const pc of g.pcs){if(pc.role==='part')pc.rest=true;else{pc.vx=0;pc.fly=false;pc.fall=1}}
 if(g.spurt&&g.age<g.spurt.until)return false;for(const pc of g.pcs){if(pc.ash)return false;if(pc.role==='body'){if(pc.fall<1||pc.fly||Math.abs(pc.vx)>.03)return false}else if(!pc.rest)return false}return true}
function goreMakeCache(g,Hf,U,t){let mn=1e9,mx=-1e9;for(const pc of g.pcs){const x=g.dir*(pc.pv[0]+pc.ox)*U;mn=Math.min(mn,x);mx=Math.max(mx,x)}
 const m=1.2*U,ox=mn-m,w=Math.ceil(mx-mn+2*m),oy=-1.4*U,h=Math.ceil(1.75*U);if(w*h>900000){g.noCache=true;return}
 const cv=document.createElement('canvas');cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);const cc=cv.getContext('2d');cc.scale(dpr,dpr);
 for(const pc of g.pcs)gorePiece(cc,g,pc,Hf,U,-ox,-oy,t,1);g.cache={cv,w,h,ox,oy,U:Math.round(U)}}
function goreDraw(c,g,Hf,U,sx,gy,t){
 if(g.first){g.first=false;try{if(AU.ctx&&AU.opt.sfx>0&&gate('splat',70))SFX.splat((sx/Math.max(1,cw))*1000)}catch(e){}
  for(const b of g.bursts)goreBlood(g,b.fx,b.fy,b.n,b.sp,b.ang+(g.dir<0?0:0),b.spr,U,sx,gy);
  if(g.skel||g.chips)goreBits(g,0,g.hy,g.chips||10,U,sx,gy,'bone',g.skel?'#e6e0c4':'#d8cfb0');
  if(g.w==='magic')goreBits(g,0,g.waist,28,U,sx,gy,'ember',g.ashCol)}
 const al=g.age>g.life-2.2?Math.max(0,(g.life-g.age)/2.2):1,bd=g.pcs[0];
 if(g.cache&&g.cache.U!==Math.round(U))g.cache=null;
 if(g.cache){c.save();c.globalAlpha=al;c.drawImage(g.cache.cv,sx+g.cache.ox,gy+g.cache.oy,g.cache.w,g.cache.h);c.restore();return}
 if(!g.noCache&&g.age>2.2&&goreSettled(g))goreMakeCache(g,Hf,U,t);
 if(g.spurt&&g.age<g.spurt.until){const sp=g.spurt,k=1-g.age/sp.until;if(Math.random()<sp.rate*k*.016*(g.lv===1?.6:1.2)){const q=goreBodyPt(bd,sp.fx,sp.fy);goreBlood(g,q[0],q[1],2,1.1,-1.4,.9,U,sx,gy)}}
 if(!g.pool&&g.age>.8&&!g.skel){g.pool=true;const q=bd.ox;goreDecal(sx+g.dir*q*U,gy-U*.02,U*(.16+g.ov*.06+(g.big?.1:0)),g.col,.45)}
 for(const pc of g.pcs)gorePiece(c,g,pc,Hf,U,sx,gy,t,al);
 for(const pc of g.pcs){if(pc.hitG){pc.hitG=false;const q=[pc.ox+pc.pv[0],pc.pv[1]+pc.oy];if(!g.skel)goreBlood(g,q[0],q[1]-.02,6,.7,-1.2,.9,U,sx,gy);else goreBits(g,q[0],q[1],3,U,sx,gy,'bone')}}}
function gorePiece(c,g,pc,Hf,U,sx,gy,t,al){const dir=g.dir,pvx=pc.pv[0],pvy=pc.pv[1];
 if(pc.ash){goreAsh(c,g,pc,Hf,U,sx,gy,t,al);return}
 c.save();c.translate(sx+dir*(pvx+pc.ox)*U,gy+(pvy+pc.oy)*U);if(pc.a)c.rotate(pc.a*dir);
 const mp=P=>{c.moveTo((P[0][0]-pvx)*dir*U,(P[0][1]-pvy)*U);for(let i=1;i<P.length;i++)c.lineTo((P[i][0]-pvx)*dir*U,(P[i][1]-pvy)*U);c.closePath()};
 if(pc.clip){c.beginPath();pc.clip.forEach(mp);c.clip()}
 if(pc.excl&&pc.excl.length){c.beginPath();c.rect(-6*U,-6*U,12*U,12*U);pc.excl.forEach(mp);c.clip('evenodd')}
 figure(c,mkFig(g.fk,g.d,{x:-pvx*dir*U,y:-pvy*U,H:Hf,dir,t,ph:g.ph,wt:g.wt,fall:pc.fall||0,alpha:al,cloth:g.cloth}));
 c.restore();
 if(!pc.over.length)return;
 c.save();c.translate(sx+dir*(pvx+pc.ox)*U,gy+(pvy+pc.oy)*U);if(pc.a)c.rotate(pc.a*dir);c.translate(-pvx*dir*U,-pvy*U);c.scale(dir,1);
 if(pc.fall>0){c.translate(0,-U*.04*eo(pc.fall));c.rotate(-eo(pc.fall)*1.48)}
 c.globalAlpha=al;for(const o of pc.over)goreOver(c,g,o,U);c.restore()}
function goreOver(c,g,o,U){const col=g.col,x=o.x*U,y=o.y*U;c.save();c.translate(x,y);
 if(o.t==='cap'||o.t==='band'){const w=o.w*U;if(o.a)c.rotate(o.a);c.fillStyle=g.skel?'#d8d2b8':col;c.beginPath();c.ellipse(0,0,w,w*(o.t==='band'?.28:.5),0,0,7);c.fill();c.fillStyle=g.skel?'#9a9478':'#5a0a0a';c.beginPath();c.ellipse(0,0,w*.55,w*.22,0,0,7);c.fill()}
 else if(o.t==='gash'){c.rotate(o.a);c.strokeStyle=col;c.lineWidth=Math.max(2,U*.045);c.lineCap='round';c.beginPath();c.moveTo(-o.l*U/2,0);c.lineTo(o.l*U/2,0);c.stroke();c.strokeStyle='#00000066';c.lineWidth=Math.max(1,U*.015);c.stroke()}
 else if(o.t==='splat'){const r=o.r*U;c.fillStyle=col;c.beginPath();for(let i=0;i<14;i++){const a=i/14*6.283,k=(i%2?.62:1.12)*(.85+((i*37)%7)/20);c.lineTo(Math.cos(a)*r*k,Math.sin(a)*r*k*.9)}c.closePath();c.fill();c.fillStyle='#00000040';c.beginPath();c.arc(0,0,r*.45,0,7);c.fill();c.fillStyle=g.skel?'#d8d2b8':'#d9bfa6';for(let i=0;i<4;i++){c.beginPath();c.arc(Math.cos(i*2.3+.4)*r*.7,Math.sin(i*2.3+.4)*r*.55,r*.14,0,7);c.fill()}}
 else if(o.t==='arrow'){c.rotate(o.a);c.strokeStyle='#8a6a3a';c.lineWidth=Math.max(1.4,U*.02);c.lineCap='round';c.beginPath();c.moveTo(0,0);c.lineTo(o.l*U,0);c.stroke();c.fillStyle='#e8e0c0';c.beginPath();c.moveTo(o.l*U,0);c.lineTo(o.l*U+U*.07,-U*.03);c.lineTo(o.l*U+U*.05,0);c.lineTo(o.l*U+U*.07,U*.03);c.fill();c.fillStyle='#c8483a';c.beginPath();c.moveTo(o.l*U*.82,0);c.lineTo(o.l*U*.95,-U*.028);c.lineTo(o.l*U*.95,U*.028);c.fill();c.fillStyle=col;c.beginPath();c.arc(0,0,U*.03,0,7);c.fill()}
 else if(o.t==='spear'){c.rotate(o.a);c.strokeStyle='#7a5a30';c.lineWidth=Math.max(2,U*.03);c.lineCap='round';c.beginPath();c.moveTo(-U*.04,0);c.lineTo(o.l*U,0);c.stroke();if(o.brk){c.strokeStyle='#d8c898';c.lineWidth=Math.max(1,U*.015);c.beginPath();c.moveTo(o.l*U,-U*.012);c.lineTo(o.l*U+U*.03,U*.01);c.stroke()}else{c.fillStyle='#e8e8ee';c.beginPath();c.moveTo(o.l*U,0);c.lineTo(o.l*U-U*.1,-U*.035);c.lineTo(o.l*U-U*.1,U*.035);c.fill()}c.fillStyle=col;c.beginPath();c.arc(0,0,U*.04,0,7);c.fill()}
 else if(o.t==='axe'){c.rotate(o.a);c.strokeStyle='#7a5a30';c.lineWidth=Math.max(2,U*.028);c.lineCap='round';c.beginPath();c.moveTo(0,0);c.lineTo(U*.38,-U*.06);c.stroke();c.fillStyle='#d4d8de';c.beginPath();c.moveTo(0,-U*.03);c.lineTo(-U*.05,-U*.14);c.quadraticCurveTo(U*.1,-U*.16,U*.12,-U*.02);c.closePath();c.fill();c.fillStyle=col;c.beginPath();c.arc(0,0,U*.04,0,7);c.fill()}
 else if(o.t==='dent'){c.fillStyle='#00000055';c.beginPath();c.ellipse(0,0,U*.09,U*.07,0,0,7);c.fill();c.fillStyle=col;c.beginPath();c.arc(0,0,U*.05,0,7);c.fill()}
 else if(o.t==='hole'){c.fillStyle='#1a0505';c.beginPath();c.arc(0,0,U*.018,0,7);c.fill();c.strokeStyle=col;c.lineWidth=Math.max(1,U*.015);c.beginPath();c.arc(0,0,U*.04,0,7);c.stroke()}
 else if(o.t==='claw'){c.strokeStyle=col;c.lineWidth=Math.max(1.6,U*.03);c.lineCap='round';for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(-U*.13+i*U*.04,-U*.12);c.lineTo(U*.13+i*U*.04,U*.12);c.stroke()}}
 c.restore()}
function goreAsh(c,g,pc,Hf,U,sx,gy,t,al){const k=Math.min(1,g.age/1.5);
 if(!g.snap){const w=Math.ceil(U*2.6),h=Math.ceil(U*2.3);g.snap=document.createElement('canvas');g.snap.width=w;g.snap.height=h;const s=g.snap.getContext('2d');
  figure(s,mkFig(g.fk,g.d,{x:w/2,y:h-U*.08,H:Hf,dir:g.dir,t,ph:g.ph,cloth:g.cloth}));s.globalCompositeOperation='source-atop';s.fillStyle='rgba(28,14,8,.82)';s.fillRect(0,0,w,h);g.snw=w;g.snh=h}
 const w=g.snw,h=g.snh,a=al*(k<.35?1:Math.max(0,1-(k-.35)/.65)),sc=1-k*.85;
 c.save();c.globalAlpha=a;c.translate(sx,gy-U*.08*0);c.scale(1,sc);c.drawImage(g.snap,-w/2,-(h-U*.08),w,h);
 if(k<.6){c.globalCompositeOperation='lighter';c.globalAlpha=a*(.6-k)*1.2;const gr=c.createRadialGradient(0,-U*.5,U*.05,0,-U*.5,U*.6);gr.addColorStop(0,(g.ashCol||'#ff9a3a')+'cc');gr.addColorStop(1,(g.ashCol||'#ff9a3a')+'00');c.fillStyle=gr;c.fillRect(-U*.7,-U*1.2,U*1.4,U*1.4)}
 c.restore();if(Math.random()<.5*(1-k)&&GORE.bits.length<(g.lv===1?60:140)){const a2=-Math.PI/2+(Math.random()-.5)*1.2;GORE.bits.push({x:sx+(Math.random()-.5)*U*.4,y:gy-U*(.1+Math.random()*.9)*sc,vx:Math.cos(a2)*U*.3,vy:Math.sin(a2)*U*.9,gr:-U*.3,r:U*.014,rot:0,w:0,t:.9+Math.random()*.7,max:1.2,kind:'ember',col:g.ashCol||'#ff9a3a',gy:gy+999})}}
function goreFx(c,dt){
 if(GORE.lc){GORE.fadeT+=dt;if(GORE.fadeT>2){GORE.fadeT=0;GORE.lc.save();GORE.lc.setTransform(1,0,0,1,0,0);GORE.lc.globalCompositeOperation='destination-out';GORE.lc.fillStyle='rgba(0,0,0,.02)';GORE.lc.fillRect(0,0,GORE.layer.width,GORE.layer.height);GORE.lc.restore()}}
 for(const d of GORE.drops){d.t-=dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.vy+=d.gr*dt;
  if(d.y>=d.gy){d.t=0;goreDecal(d.x,d.y,d.sz*1.6,d.col,.5)}else{c.strokeStyle=d.col;c.lineWidth=d.sz*1.15;c.lineCap='round';c.beginPath();c.moveTo(d.x,d.y);c.lineTo(d.x-d.vx*.022,d.y-d.vy*.022);c.stroke()}}
 GORE.drops=GORE.drops.filter(d=>d.t>0);
 for(const b of GORE.bits){b.t-=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vy+=b.gr*dt;b.rot+=b.w*dt;
  if(b.kind==='ember'){c.fillStyle=b.col;c.globalAlpha=Math.max(0,b.t/b.max);c.fillRect(b.x,b.y,b.r*2,b.r*2);c.globalAlpha=1}
  else{if(b.y>=b.gy){b.y=b.gy;b.vy*=-.3;b.vx*=.5;b.w*=.5}c.save();c.translate(b.x,b.y);c.rotate(b.rot);c.globalAlpha=Math.min(1,b.t*.8);c.fillStyle=b.col;c.fillRect(-b.r*2.2,-b.r*.6,b.r*4.4,b.r*1.2);c.restore()}}
 GORE.bits=GORE.bits.filter(b=>b.t>0)}

function drawBattle(now,dt){
 const c=cx;c.setTransform(dpr,0,0,dpr,0,0);c.drawImage(bg,0,0,cw,ch);goreGround(c);
 const {top,lh}=laneGeom(),X=x=>x*cw/B.FW,t=now/1000;
 const baseH=Math.min(lh*1.3,cw/9);
 const colL=FACTIONS[B.f.L].color,colR=B.f.L===B.f.R?'#b8332e':FACTIONS[B.f.R].color;
 let g=c.createLinearGradient(0,0,X(BX*2.6),0);g.addColorStop(0,colL+'88');g.addColorStop(1,colL+'00');c.fillStyle=g;c.fillRect(0,top,X(BX*2.6),ch-top);
 g=c.createLinearGradient(cw,0,cw-X(BX*2.6),0);g.addColorStop(0,colR+'88');g.addColorStop(1,colR+'00');c.fillStyle=g;c.fillRect(cw-X(BX*2.6),top,X(BX*2.6),ch-top);
 for(let l=0;l<LANES;l++){const y=top+(l+.5)*lh;for(const s of[0,1]){const x=s?cw-5:5,col=s?colR:colL,hh=lh*.7;c.strokeStyle='#5a4326';c.lineWidth=2;c.beginPath();c.moveTo(x,y+hh*.5);c.lineTo(x,y-hh*.6);c.stroke();c.fillStyle=col;c.beginPath();const d=s?-1:1,w=Math.sin(t*3+l+s)*3;c.moveTo(x,y-hh*.6);c.quadraticCurveTo(x+d*10,y-hh*.55+w,x+d*18,y-hh*.5+w);c.lineTo(x,y-hh*.3);c.fill()}}
 // Cursor-Bahn
 if(!cfg.watch){c.fillStyle='rgba(255,235,150,.14)';c.fillRect(0,top+cursor*lh,cw,lh);
 const cy=top+(cursor+.5)*lh,rdy=chargeReady(),as=arrowSz(lh,rdy,t),bl=Math.sin(t*9);c.fillStyle=rdy?'rgba(255,'+(70+Math.round(25*bl))+',50,'+(.8+.2*bl)+')':'#ffe08a';c.strokeStyle=rdy?'#5a0808':'#7a5a10';c.lineWidth=2;c.beginPath();c.moveTo(4,cy-as*.55);c.lineTo(4+as*.9,cy-as*.55);c.lineTo(4+as*.9,cy-as);c.lineTo(4+as*1.9,cy);c.lineTo(4+as*.9,cy+as);c.lineTo(4+as*.9,cy+as*.55);c.lineTo(4,cy+as*.55);c.closePath();c.fill();c.stroke();
 if(!touchOn()&&rdy){c.fillStyle='#fff';c.font='bold '+Math.round(as*1.0)+'px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillText('Q',4+as*.8,cy+1);c.textBaseline='alphabetic';c.textAlign='left'}}
 if(cfg.pvp){c.fillStyle='rgba(150,210,255,.14)';c.fillRect(0,top+curR*lh,cw,lh);
  const cy=top+(curR+.5)*lh,rdy=chargeReadyR(),as=arrowSz(lh,rdy,t),bl=Math.sin(t*9),x0=cw-4;c.fillStyle=rdy?'rgba(255,'+(70+Math.round(25*bl))+',50,'+(.8+.2*bl)+')':'#9fd6ff';c.strokeStyle=rdy?'#5a0808':'#1a4a7a';c.lineWidth=2;c.beginPath();
  c.moveTo(x0,cy-as*.55);c.lineTo(x0-as*.9,cy-as*.55);c.lineTo(x0-as*.9,cy-as);c.lineTo(x0-as*1.9,cy);c.lineTo(x0-as*.9,cy+as);c.lineTo(x0-as*.9,cy+as*.55);c.lineTo(x0,cy+as*.55);c.closePath();c.fill();c.stroke()}
 const auraLbl=[];
 if(hovId!=null&&now<hovUntil){const hu=B.units.find(u=>u.id===hovId);if(hu){const gx=X(hu.x),gy=top+(hu.lane+.5)*lh+hu.yo*lh*.55+lh*.3,ry=Math.max(lh*.42,14);
  auraOf(B,hu).forEach((a,i)=>{const rx=X(a.r);c.save();c.fillStyle=a.c+'26';c.strokeStyle=a.c;c.lineWidth=2.2;c.setLineDash([9,6]);c.lineDashOffset=-t*18;c.beginPath();c.ellipse(gx,gy,rx,ry,0,0,7);c.fill();c.stroke();c.restore();auraLbl.push({x:gx,y:gy-ry-6-i*20,t:tr(a.t),c:a.c})})}}
 const items=[];
 for(const f of B.fx){
  if(f.k==='c'){const pr=f.max-f.t,fall=Math.min(1,pr/.55),al=f.t<1.3?f.t/1.3:1,l=f.lane,s=pf(l);
   items.push({y:top+(l+.5)*lh+f.yo*lh*.55,fn:()=>{const H=sizeOf(f.d,baseH*s),dir=f.side==='L'?1:-1;figure(c,mkFig(B.f[f.side],f.d,{x:X(f.x)-dir*H*.12*eo(fall),y:top+(l+.5)*lh+f.yo*lh*.55+lh*.3,H,dir,fall,alpha:al,t,ph:f.ph,cloth:(B.f.L===B.f.R&&f.side==='R')?'#b8332e':null}))}})}}
 goreItems(items,c,top,lh,X,baseH,t,dt);
 for(const u of B.units){const l=u.lane,s=pf(l),H=sizeOf(u.d,baseH*s),dir=u.side==='L'?1:-1,yy=top+(l+.5)*lh+u.yo*lh*.55;
  if(u.hit>.14&&!u.hs){u.hs=true;for(let i=0;i<5;i++)parts.push({k:'sp',x:X(u.x),y:yy+lh*.3-H*.5,vx:(Math.random()-.5)*90,vy:-30-Math.random()*60,t:.35,max:.35})}
  if(u.hit<=0)u.hs=false;
  if(u.mv&&Math.random()<dt*7)parts.push({k:'du',x:X(u.x)-dir*H*.1,y:yy+lh*.3,vx:-dir*10,vy:-8,t:.5,max:.5,r:H*.06});
  items.push({y:yy,fn:()=>{figure(c,mkFig(B.f[u.side],u.d,{x:X(u.x),y:yy+lh*.3,H,dir,mv:u.mv,wt:u.wt,p:u.anim>0?Math.min(.999,1-u.anim/u.am):-1,t,ph:u.ph,hit:Math.max(0,u.hit),cloth:(B.f.L===B.f.R&&u.side==='R')?'#b8332e':null}));
   if(u.hp<u.mhp){const w=H*.5,x=X(u.x)-w/2,y=yy+lh*.3-H*1.12;c.fillStyle='#000a';c.fillRect(x-1,y-1,w+2,5);c.fillStyle=u.hp/u.mhp>.5?'#6fd36a':u.hp/u.mhp>.25?'#e8c24a':'#e25a4a';c.fillRect(x,y,w*Math.max(0,u.hp/u.mhp),3)}}})}
 items.sort((a,b)=>a.y-b.y);for(const it of items)it.fn();
  for(const L of auraLbl){c.save();c.font='bold '+Math.max(12,Math.round(lh*.21))+'px Georgia';c.textAlign='center';const w=c.measureText(L.t).width+14;c.fillStyle='#000b';c.fillRect(L.x-w/2,L.y-16,w,20);c.strokeStyle=L.c;c.lineWidth=1.5;c.strokeRect(L.x-w/2,L.y-16,w,20);c.fillStyle='#fff';c.fillText(L.t,L.x,L.y-1);c.restore()}
 for(const f of B.fx){if(f.k==='a'){const pr=(f.max-f.t-f.dly)/(f.max-f.dly);if(pr<=0||pr>1)continue;const s=pf(f.lane),yy=top+(f.lane+.5)*lh+f.yo*lh*.55+lh*.3-baseH*s*.55;
   const x1=X(f.x1),x2=X(f.x2),x=x1+(x2-x1)*pr,y=yy-Math.sin(pr*Math.PI)*lh*(f.orb?.15:.45),vx=(x2-x1),vy=f.orb?0:-Math.cos(pr*Math.PI)*lh*.9,a=Math.atan2(vy,vx);
   if(f.orb){const oc=FACTIONS[f.fk].orb;c.fillStyle=oc+'55';c.beginPath();c.arc(x,y,9,0,7);c.fill();c.fillStyle=oc;c.beginPath();c.arc(x,y,4.5,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(x-1,y-1,1.8,0,7);c.fill();if(Math.random()<.5)parts.push({k:'sp',x,y,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30,t:.3,max:.3})}
   else if(f.thr==='axe'||f.thr==='hammer'){c.save();c.translate(x,y);c.rotate(pr*16*(x2>x1?1:-1));c.strokeStyle='#6a4524';c.lineWidth=2.2;c.lineCap='round';c.beginPath();c.moveTo(-7,0);c.lineTo(7,0);c.stroke();if(f.thr==='axe'){c.fillStyle='#d4d8de';c.beginPath();c.moveTo(3,-1);c.lineTo(1,-8);c.quadraticCurveTo(10,-9,9,-1);c.fill();c.strokeStyle='#555';c.lineWidth=.8;c.stroke()}else{c.fillStyle='#9aa0a8';c.fillRect(2,-4.5,7,9);c.strokeStyle='#444';c.lineWidth=.8;c.strokeRect(2,-4.5,7,9)}c.restore()}
   else{c.save();c.translate(x,y);c.rotate(a);c.strokeStyle=f.thr==='spear'?'#8a6a3a':'#e8e0c0';c.lineWidth=f.thr==='spear'?2.4:1.5;c.beginPath();c.moveTo(-9,0);c.lineTo(5,0);c.stroke();c.fillStyle='#ddd';c.beginPath();c.moveTo(5,-2);c.lineTo(9,0);c.lineTo(5,2);c.fill();c.restore()}}
  else if(f.k==='r'){const pr=1-f.t/f.max,y=top+(f.lane+.5)*lh;c.strokeStyle=(f.side==='L'?colL:colR);c.globalAlpha=1-pr;c.lineWidth=3;c.beginPath();c.arc(X(f.x),y,10+pr*40,0,7);c.stroke();c.globalAlpha=1}}
 goreFx(c,dt);
 for(const p of parts){p.t-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.k==='sp'){p.vy+=200*dt;c.fillStyle='rgba(255,230,160,'+(p.t/p.max)+')';c.fillRect(p.x,p.y,2.5,2.5)}else{c.fillStyle='rgba(150,125,85,'+(p.t/p.max*.4)+')';c.beginPath();c.arc(p.x,p.y,p.r*(1+(1-p.t/p.max)),0,7);c.fill()}}
 parts=parts.filter(p=>p.t>0);if(parts.length>300)parts.splice(0,100);
 if(paused){c.fillStyle='#0008';c.fillRect(0,0,cw,ch);c.fillStyle='#fff';c.font='28px Georgia';c.textAlign='center';c.fillText(tr('Pause'),cw/2,ch/2)}
}
function updHud(){
 $('#barL').style.width=B.bar+'%';$('#barM').style.left=B.bar+'%';$('#time').textContent=fmt(B.time-B.t);
 AU.intense=B.bar<35||B.bar>65||B.time-B.t<30;
 if(VK.on)vkDecide(B);
 paintBar('L',$('#units'),$('#uname'));paintBar('R',$('#eunits'),$('#ename'));
 {const g=$('#tGo'),hb=$('#tCh');if(g&&!cfg.watch){const T=Tof(B,'L',B.use.L[selU]);g.classList.toggle('rdy',B.clock.L>=T);hb.classList.toggle('rdy',!!B&&!B.over&&B.ch.L>=chAt(B,'L'))}}
 {const g=$('#tGo2'),hb=$('#tCh2');if(g&&cfg.pvp){const T=Tof(B,'R',B.use.R[selR]);g.classList.toggle('rdy',B.clock.R>=T);hb.classList.toggle('rdy',!!B&&!B.over&&B.ch.R>=chAt(B,'R'))}}
 if(cfg.watch)return;
 
}
function tick(ts){
 requestAnimationFrame(tick);const t=ts/1000;
 if(cur==='sMenu')drawMenu(t);else if(cur==='sPick')drawPick(t);
 else if(cur==='sCamp'&&campTab==='map'&&camp)drawCampMap(ts);
 else if(cur==='sBattle'&&B&&bg){const dt=Math.min(.05,(ts-lastTs)/1000);lastTs=ts;
  if(!paused){let rem=dt*speed;while(rem>0){const s=Math.min(.025,rem);step(B,s);rem-=s}}
  if(B.ev){for(const e of B.ev){vkEv(e);playEv(e)}B.ev.length=0}
  ambSync();
  drawBattle(ts,dt*(paused?0:1));updHud();if(B.over&&!resShown)showRes()}
}
requestAnimationFrame(tick);

setLang(OPT.lang);

/* v0.19: Musik schon beim Start versuchen. Sperrt der Browser Autoplay, startet sie beim ersten Tippen, Klicken oder Tastendruck. */
(function(){let hint=null;
 function blocked(){const e=FM.cur>=0?FM.els[FM.cur]:null;return !AU.ctx||AU.ctx.state!=='running'||(FM.on&&e&&e.paused&&AU.opt.music>0)}
 function drop(){if(hint&&!blocked()){hint.remove();hint=null}}
 function kick(){auInit();if(AU.ctx&&AU.musicMode==='off')musicFor(cur);
  const e=FM.cur>=0?FM.els[FM.cur]:null;
  if(e&&FM.on&&!FM.hidden&&!FM.hold&&AU.opt.music>0&&e.paused){e._m=0;const p=e.play();if(p&&p.catch)p.catch(()=>{})}
  setTimeout(drop,500)}
 ['pointerdown','keydown','touchstart','click'].forEach(ev=>document.addEventListener(ev,kick,{capture:true}));
 try{auInit();musicFor(cur)}catch(e){}
 setTimeout(()=>{if(AU.opt.music>0&&blocked()&&!hint){hint=document.createElement('div');hint.id='musHint';hint.textContent=tr('Tippen oder Klicken startet die Musik');
  hint.style.cssText='position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:50;padding:7px 14px;border-radius:16px;background:rgba(0,0,0,.65);color:#ddd;font:14px Georgia,serif;pointer-events:none';document.body.appendChild(hint)}},700);
})();


