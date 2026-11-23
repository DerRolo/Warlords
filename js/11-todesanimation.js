/* Todesanimationen mit Blut */
/* ---------- v0.41: Todesanimationen als Ragdoll aus Einzelteilen ----------
   Beim Tod wird die Figur mit der normalen Figurenzeichnung Teil fuer Teil zerlegt (figure(), Schalter F.parts):
   Kopf, Arm, Bein, Koerper, Beine, Waffe und Reittier. Jedes Teil ist ein kleines Bild mit eigener Physik
   (Fliegen, Aufprall, Rollen, Liegenbleiben). Ruhende Teile werden in die Bodenschicht gebrannt, dann kostet ein Toter keinen Speicher mehr.
   Reiter fallen vom Tier, das Tier laeuft weiter oder bricht zusammen. Orks gehen gegen andere Voelker brutaler vor. */
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
/* Waffen: halbe Laenge (fuer den Bodenkontakt) und Achsenwinkel in der Ruhepose */
const WHL={spear:.55,halberd:.6,glaive:.6,jav:.4,sword:.22,greatsword:.4,dagger:.12,dagger2:.12,club:.25,axe:.3,axe2:.3,axejav:.25,hammerjav:.25,hammer:.3,maul:.35,spikemaul:.35,pick:.25,mage:.5,bow:.3,xbow:.3,gun:.4,scout:.15};
const WA0={spear:2.9,halberd:2.9,glaive:2.9,mage:3.0,sword:2.4,greatsword:2.4,jav:2.6,axejav:2.6,hammerjav:2.6};
function goreAxis(wk){if(wk==='bow')return Math.PI/2;if(wk==='xbow'||wk==='gun')return 0;const wa=WA0[wk]||2.2;return Math.atan2(Math.cos(wa),Math.sin(wa))}
function goreBox(k,up){const B={head:[-.6,-1.55,.65,-.64],arm:[-.25,-.98,.6,-.2],wp:[-.9,-2.35,1.9,0],legs:[-.62,-.6,.72,.14],leg:[-.45,-.6,.55,.14],body:[-.7,-1.62,.75,.14],upper:[-.7,-1.62,.75,-.34]}[k];return[B[0],B[1]-up,B[2],B[3]-up]}
function goreSpawn(b,u){const lv=goreLevel();if(!lv)return false;
 const fk=b.f[u.side],d=u.d,L=LOOK[fk+':'+d.n]||{},lk=u.lk||{w:'slash',dx:u.side==='L'?-1:1,ov:0};
 const big=d.k==='big'||d.k==='ent',mt=L.m||(d.k==='cav'?'horse':null),gh=!!L.gh,skel=fk==='undead'&&!L.hv&&d.k!=='mage'&&!gh;
 const wk=L.w||(d.k==='mage'?'mage':d.k==='bow'?'bow':d.k==='cav'?'spear':'sword');
 const g={fk,d,x:u.x,lane:u.lane,yo:u.yo,dir:u.side==='L'?1:-1,ph:u.ph||0,wt:u.wt||0,age:0,w:lk.w,th:!!lk.th,big,cav:!!mt,mt,skel,gh,wk,pcs:[],bursts:[],life:big?14:11,
  cloth:(b.f.L===b.f.R&&u.side==='R')?'#b8332e':null,back:lk.dx||0,ov:Math.min(2,lk.ov||0),orb:lk.ox,lv,first:true,spurt:null,pool:false,built:false,
  brut:((lk.af==='orcs'&&fk!=='orcs')||lk.ak==='big'||lk.ak==='ent')?1:0,main:null,mount:null,force:lk.force||null};
 g.col=lk.w==='pest'?'#6c8a2a':goreBloodCol(g);
 GORE.objs.push(g);const cap=lv===1?26:lv===2?50:90;while(GORE.objs.length>cap)GORE.objs.shift();
 return true}
/* ---------- Bild eines Teils: figure() nur mit den genannten Teilen in ein kleines Canvas ---------- */
function goreSprite(g,Hf,U,t,box,passes,over){
 const pr=Math.min(2,dpr||1),w=Math.max(2,Math.ceil((box[2]-box[0])*U)),h=Math.max(2,Math.ceil((box[3]-box[1])*U)),ox=-box[0]*U,oy=-box[1]*U;
 const cv=document.createElement('canvas');cv.width=Math.round(w*pr);cv.height=Math.round(h*pr);const s=cv.getContext('2d');s.scale(pr,pr);
 for(const ps of passes){s.save();if(ps[1]){s.beginPath();s.rect(0,(ps[1][0]-box[1])*U,w,(ps[1][1]-ps[1][0])*U);s.clip()}
  figure(s,mkFig(g.fk,g.d,{x:ox,y:oy,H:Hf,dir:1,t,ph:g.ph,wt:g.wt,mv:false,p:-1,hit:0,fall:0,parts:ps[0],cloth:g.cloth,alpha:1}));s.restore()}
 if(over&&over.length){s.save();s.translate(ox,oy);for(const o of over)goreOver(s,g,o,U);s.restore()}
 return{cv,w,h,ox,oy,U0:U}}
const GRANK={legs:0,leg:0,body:1,upper:1,head:2,arm:3,wp:4};
function goreBuild(g,Hf,U,t){
 g.built=true;
 const rnd=Math.random,sg=()=>rnd()<.5?-1:1,bk=(g.back*g.dir)||-1,seat=g.cav?(MT[g.mt]||MT.horse).seat:.44,up=g.cav?seat*1.2-.44:0;
 const ms=g.big?.55:1,br=g.brut?1.55:1,W0=g.w,wk=g.wk;
 g.hy=-.88-up;g.sh=g.hy+.14;g.waist=-.60-up;
 const NK=-.76-up,SH=-.72-up,HIP=-.44-up,KN=-.24-up;
 const cap=(x,y,w)=>({t:'cap',x,y,w}),burst=(fx,fy,n,sp,ang,spr)=>g.bursts.push({fx,fy,n,sp,ang,spr});
 const droppable=wk!=='claw'&&!g.gh&&W0!=='pest';
 const ALL=['body','legs','head','arm','wp'];
 const mk=(kind,box,passes,over,C,hl,hw,o)=>{const q=Object.assign({kind,sp:goreSprite(g,Hf,U,t,box,passes,over),cx:C[0],cy:C[1],hl,hw,x:C[0],y:C[1],a:0,vx:0,vy:0,w:0,mode:'lie',bn:0,t:0,fd:.55,sgn:1,fx:0,ax:-Math.PI/2,settle:true,rank:GRANK[kind]},o||{});g.pcs.push(q);return q};
 const fly=(q,vx,vy,w)=>{q.mode='fly';q.vx=bk*vx*br*ms;q.vy=-vy*Math.sqrt(br)*(g.big?.7:1);q.w=w*br*ms;return q};
 const hd=(over)=>mk('head',goreBox('head',up),[[['head']]],over,[.03,-.88-up],.15,.15,{settle:false});
 const arm=(withWp,over)=>withWp?mk('arm',goreBox('wp',up),[[['arm','wp']]],over,[.14,-.52-up],.45,.15,{settle:false,rank:3}):mk('arm',goreBox('arm',up),[[['arm']]],over,[.12,-.56-up],.2,.08,{ax:1.0713});
 const wpn=()=>mk('wp',goreBox('wp',up),[[['wp']]],null,[.17,-.48-up],WHL[wk]||.3,.06,{ax:goreAxis(wk)});
 const legsP=(over)=>mk('legs',goreBox('legs',up),[[['legs']]],over,[0,-.22-up],.28,.24);
 const body=(rm,over,adds,o)=>{const parts=ALL.filter(x=>rm.indexOf(x)<0),hasL=parts.indexOf('legs')>=0||(adds&&adds.length>0)||parts.some(x=>x==='legA'||x==='legB');
  const passes=(adds||[]).concat([[parts]]);const q=mk(hasL?'body':'upper',goreBox(hasL?'body':'upper',up),passes,over,hasL?[.02,-.55-up]:[0,-.98-up],hasL?.58:.38,.2,o);if(!g.main)g.main=q;return q};
 const tip=(q,fd,slide,delay)=>{if(g.cav){return fly(q,.5+rnd()*.5,.6+rnd()*.7,bk*(1.4+rnd()*2.2))}q.mode='tip';q.sgn=bk>0?1:-1;q.fd=fd*(g.big?1.5:1);q.t=-(delay||0);q.vx=bk*slide*br;return q};
 const stain=(x,y,r)=>({t:'stain',x,y,r});
 const arrows=(n,len)=>{const ov=[];for(let i=0;i<n;i++)ov.push({t:'arrow',x:-.08+rnd()*.2,y:g.hy+.16+rnd()*(g.waist-g.hy),a:-(.2+rnd()*.55),l:len*(.9+rnd()*.25)});return ov};
 const wdrop=droppable&&W0!=='magic'&&rnd()<.88;
 const pk=(a)=>{let s=0;for(const x of a)s+=x[1];let r=rnd()*s;for(const x of a){r-=x[1];if(r<=0)return x[0]}return a[0][0]};
 /* ---- Art des Todes ---- */
 let kind;const mel=(W0==='slash'||W0==='cleave'||W0==='blunt'||W0==='claw'||W0==='pierce');
 if(g.skel&&mel)kind='shatter';
 else switch(W0){
  case 'slash':kind=pk([['decap',22],['arm',22],['leg',14],['bisect',g.brut?9:3],['fling',g.brut?18:4],['wound',22]]);break;
  case 'cleave':kind=g.th?'axe':pk([['decap',26],['arm',20],['leg',12],['bisect',g.brut?18:9],['fling',g.brut?15:4],['wound',16]]);break;
  case 'blunt':kind=g.th?'dent':pk([['headcrush',24],['fling',g.brut?44:28],['headpop',20],['crumple',16]]);break;
  case 'pierce':kind=g.th?'spear':pk([['stab',70],['fling',g.brut?20:6],['arm',12]]);break;
  case 'arrow':case 'bolt':kind='arrows';break;
  case 'shot':kind='shot';break;
  case 'magic':kind='ash';break;
  case 'claw':kind=pk([['arm',25],['wound',75]]);break;
  default:kind='crumple'}
 if(g.force)kind=g.force;
 if(g.big){if(kind==='leg'||kind==='bisect')kind='wound';else if(kind==='fling')kind='crumple';else if(kind==='decap'&&rnd()<.5)kind='wound'}
 if(g.cav&&(kind==='leg'||kind==='bisect'))kind='wound';
 g.kindDeath=kind;
 if(kind==='ash'){g.ashMode=true;g.life=2.8;g.ashCol=g.orb||'#ff9a3a';return}
 let rm=[],ov=[],adds=null,bmode='tip',armHasWp=false;
 switch(kind){
  case 'decap':case 'headpop':{const pop=kind==='headpop',h=hd([cap(.03,NK,.07)]);fly(h,pop?1.2:.8+rnd()*1.3,pop?2.8:1.6+rnd()*1.0,sg()*(5+rnd()*8));
   rm=['head'];ov=[cap(.03,NK,.075)];burst(.03,NK,pop?28:26,2.3,-1.45,.7);g.spurt={fx:.03,fy:NK,until:.95,rate:38};if(pop)g.chips=6;break}
  case 'headcrush':rm=['head'];ov=[{t:'splat',x:.03,y:NK-.08,r:.17}];burst(.03,g.hy,34,2.2,-1.6,2.4);g.chips=5;bmode=[1.2,.9,bk*3];break;
  case 'arm':{const keep=droppable&&rnd()<.45,a=arm(keep,[cap(.05,SH,.05)]);fly(a,.9+rnd()*1.1,1.2+rnd()*1.2,sg()*(5+rnd()*5));
   rm=['arm'];if(keep){rm.push('wp');armHasWp=true}ov=[cap(.05,SH,.06),stain(.04,SH+.14,.08)];burst(.05,SH,20,2,-1.2,.9);g.spurt={fx:.05,fy:SH,until:.7,rate:26};break}
  case 'leg':{const side=rnd()<.5?'legA':'legB',sx=side==='legA'?.05:-.05,lp=mk('leg',goreBox('leg',up),[[[side],[KN,.4]]],[cap(sx,KN,.045)],[sx,-.12-up],.13,.08);
   fly(lp,.7+rnd()*.8,1+rnd()*1,sg()*(4+rnd()*4));rm=['legs'];adds=[[[side=== 'legA'?'legB':'legA']],[[side],[-1.5,KN]]];
   ov=[cap(sx,KN,.05)];burst(sx,KN,22,2,-1,1);g.spurt={fx:sx,fy:KN,until:.8,rate:28};bmode='legcut';break}
  case 'bisect':{const lg=legsP([{t:'band',x:0,y:HIP,w:.15}]);lg.mode='tip';lg.sgn=-(bk>0?1:-1);lg.fd=.5;lg.t=-.12;lg.vx=-bk*.4;
   rm=['legs'];ov=[{t:'band',x:0,y:HIP,w:.16,a:(rnd()-.5)*.4}];burst(0,HIP,36,2,-1.1,1.2);g.spurt={fx:0,fy:HIP,until:.8,rate:30};bmode=[1.0,.7,bk*(2.5+rnd()*2.5)];break}
  case 'fling':ov=[stain(.04,g.waist-.1,.1)];burst(0,g.waist-.12,22,2,-1,1.4);bmode=[2.4+rnd()*1.4,1.6+rnd()*1,bk*(5+rnd()*5)];break;
  case 'crumple':ov=[{t:'splat',x:0,y:g.waist-.1,r:.1}];burst(0,g.waist-.1,14,1.6,-1,1.4);bmode='tip.34';break;
  case 'wound':ov=[stain(.03,g.waist-.04,.09+rnd()*.03)];burst(0,g.waist-.1,rnd()<.5?16:26,1.8,-.9,1);break;
  case 'stab':ov=[stain(.02,g.waist-.05,.07)].concat(rnd()<.3?[{t:'spear',x:.04,y:g.waist-.05,a:-.2,l:.25,brk:1}]:[]);burst(-.08,g.waist-.05,22,2.6,Math.PI+.2*(bk>0?1:-1),.7);burst(.04,g.waist-.05,10,1.4,-.2,.8);bmode='tip.5';break;
  case 'spear':ov=[{t:'spear',x:.05,y:g.waist-.10,a:-.28+rnd()*.2,l:.8+rnd()*.2,brk:0}];burst(.05,g.waist-.1,20,1.7,-.8,1);break;
  case 'axe':ov=[{t:'axe',x:.06,y:g.waist-.14,a:-.5}];burst(.06,g.waist-.14,22,1.8,-.8,1.1);break;
  case 'dent':ov=[{t:'dent',x:.04,y:g.waist-.16}];burst(.04,g.waist-.16,18,1.8,-.8,1.2);bmode=[1.2,.7,bk*2];break;
  case 'arrows':{const n=W0==='bolt'?1+(rnd()<.4?1:0):1+Math.floor(rnd()*3),ln=W0==='bolt'?.24:.34;
   if(n===1&&rnd()<.35){ov=[{t:'arrow',x:.1,y:g.hy-.02,a:-.12,l:ln}];burst(.1,g.hy,16,1.6,-.4,.9)}else{ov=arrows(n,ln);burst(0,g.waist-.1,10+n*4,1.5,-.6,1)}break}
  case 'shot':ov=[{t:'hole',x:.06,y:g.waist-.14}];burst(-.12,g.waist-.14,22,2.8,Math.PI+.15*(bk>0?-1:1),.7);bmode=[1.3,.5,bk*1.6];break;
  case 'shatter':{const keep=droppable&&rnd()<.5,h=hd(null),a=arm(keep,null);fly(h,.8+rnd()*1.2,2+rnd()*1.2,sg()*(5+rnd()*6));fly(a,.6+rnd()*1.2,1.3+rnd()*1.3,sg()*(4+rnd()*6));
   const lg=legsP(null);lg.mode='tip';lg.sgn=bk>0?1:-1;lg.fd=.42;lg.vx=bk*.3;rm=['head','arm','legs'];if(keep){rm.push('wp');armHasWp=true}
   g.chips=14;burst(0,g.waist,8,1.6,-1,1.3);bmode=[.7+rnd()*.7,.9+rnd()*.8,bk*(2+rnd()*3)];break}
  default:break}
 /* Waffe faellt ab (oder bleibt in der Hand) */
 let wp=null;if(wdrop&&!armHasWp&&rm.indexOf('wp')<0){rm.push('wp');wp=wpn();
  const ang=rnd();fly(wp,(ang<.3?-.5:.3)+rnd()*1.5,.5+rnd()*1.7,sg()*(3+rnd()*7))}
 /* Koerper */
 const b=body(rm,ov,adds);
 if(Array.isArray(bmode)){fly(b,bmode[0],bmode[1],bmode[2])}
 else if(bmode==='legcut'){tip(b,.75,.6,0)}
 else if(typeof bmode==='string'&&bmode.indexOf('tip.')===0){tip(b,parseFloat(bmode.slice(3)),.5,0)}
 else tip(b,.55,.35,0);
 if(g.spurt)g.spurt.pc=b;
 g.pcs.sort((p,q)=>p.rank-q.rank);
 /* Reittier */
 if(g.cav){const run=rnd()<.55;g.mount={run,rs:sg(),t:0,fx:0,vx:run?3+rnd()*.6:bk*.9,wt:g.wt,fall:0,fd:.75,dur:3.4,done:false}}
}
function gorePt(pc,fx,fy){const dx=fx-pc.cx,dy=fy-pc.cy,ca=Math.cos(pc.a),sa=Math.sin(pc.a);return[pc.x+dx*ca-dy*sa,pc.y+dx*sa+dy*ca]}
function goreExt(q){const th=q.ax+q.a;return q.hl*Math.abs(Math.sin(th))+q.hw*Math.abs(Math.cos(th))}
function gorePhys(q,dt){
 const G=7;if(q.mode==='lie')return;
 if(q.mode==='tip'){q.t+=dt;if(q.t<0)return;q.fx+=q.vx*dt;q.vx*=Math.pow(.03,dt);const e=Math.min(1,q.t/q.fd);q.a=q.sgn*1.48*e*e;const ca=Math.cos(q.a),sa=Math.sin(q.a);q.x=q.fx+q.cx*ca-q.cy*sa;q.y=q.cx*sa+q.cy*ca;if(e>=1)q.mode='lie';return}
 q.vy+=G*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.a+=q.w*dt;
 if(q.mode==='fly'){const ex=goreExt(q);if(q.y+ex>=0){q.y=-ex;if(q.vy>.9&&q.bn<3){q.vy*=-.3;q.vx*=.62;q.w*=.6;q.bn++;q.hitG=true}else{q.vy=0;q.mode='slide'}}}
 else{q.vy=0;q.vx*=Math.pow(.004,dt);q.w*=Math.pow(.01,dt);
  if(q.settle){const r=-q.ax,k=Math.round((q.a-r)/Math.PI),tg=r+k*Math.PI;q.a+=(tg-q.a)*Math.min(1,dt*9)}
  q.y=-goreExt(q);if(Math.abs(q.vx)<.04&&Math.abs(q.w)<.15)q.mode='lie'}}
function goreStepObj(g,dt){g.age+=dt;
 for(const q of g.pcs)gorePhys(q,dt);
 const m=g.mount;if(m&&!m.done){m.t+=dt;m.fx+=m.vx*dt;if(m.run){m.vx*=Math.pow(.82,dt);m.wt+=dt*(8+m.vx*2);if(m.t>m.dur)m.done=true}else{m.vx*=Math.pow(.05,dt);m.fall=Math.min(1,m.fall+dt/m.fd)}}
 if(g.age>7)for(const q of g.pcs)q.mode='lie'}
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
  if(!g.built){try{goreBuild(g,Hf,U,t)}catch(e){console.error('Todesanimation:',e);g.dead=true;continue}}
  goreStepObj(g,dt);
  items.push({y:top+(l+.5)*lh+g.yo*lh*.55-1,fn:()=>goreDraw(c,g,Hf,U,sx,gy,t)})}
 GORE.objs=GORE.objs.filter(g=>!g.dead)}
function goreSettled(g){if(g.spurt&&g.age<g.spurt.until)return false;for(const q of g.pcs)if(q.mode!=='lie')return false;const m=g.mount;if(m&&!m.done&&(m.run||m.fall<1))return false;return true}
function gorePieceDraw(c,g,q,U,sx,gy){const sp=q.sp,S=U/sp.U0;c.save();c.translate(sx+g.dir*q.x*U,gy+q.y*U);c.scale(g.dir,1);c.rotate(q.a);c.translate(-q.cx*U,-q.cy*U);c.scale(S,S);c.drawImage(sp.cv,-sp.ox,-sp.oy,sp.w,sp.h);c.restore()}
/* Reittier: laeuft ohne Reiter weiter oder ueberschlaegt sich und bleibt mit den Beinen nach oben liegen */
function goreMountDraw(c,g,Hf,U,sx,gy,t,al,e,wt,run){const m=g.mount;c.save();c.translate(sx+g.dir*m.fx*U,gy);
 if(!run&&e>0){const k=e*e*(3-2*e);c.translate(0,.3*U*k);c.translate(0,-.5*U);c.rotate(m.rs*Math.PI*k);c.translate(0,.5*U)}
 figure(c,mkFig(g.fk,g.d,{x:0,y:0,H:Hf,dir:g.dir,t,ph:g.ph,wt,mv:run,fall:0,parts:['mount'],cloth:g.cloth,alpha:al}));c.restore()}
/* Ruhende Teile samt liegendem Reittier in die Bodenschicht brennen: danach kostet der Tote nur noch Bildpunkte */
function goreBake(g,Hf,U,sx,gy,t){const L=GORE.lc;if(!L)return;L.save();L.setTransform(GORE.ls,0,0,GORE.ls,0,0);
 const m=g.mount;if(m&&!m.run&&!m.done)goreMountDraw(L,g,Hf,U,sx,gy,t,1,1,0,false);
 for(const q of g.pcs)gorePieceDraw(L,g,q,U,sx,gy);L.restore()}
function goreDraw(c,g,Hf,U,sx,gy,t){
 if(g.first){g.first=false;try{if(AU.ctx&&AU.opt.sfx>0&&gate('splat',70))SFX.splat((sx/Math.max(1,cw))*1000)}catch(e){}
  for(const b of g.bursts)goreBlood(g,b.fx,b.fy,b.n,b.sp,b.ang,b.spr,U,sx,gy);
  if(g.skel||g.chips)goreBits(g,0,g.hy,g.chips||10,U,sx,gy,'bone',g.skel?'#e6e0c4':'#d8cfb0');
  if(g.ashMode)goreBits(g,0,g.waist,28,U,sx,gy,'ember',g.ashCol)}
 if(g.ashMode){const al=g.age>g.life-.8?Math.max(0,(g.life-g.age)/.8):1;goreAsh(c,g,null,Hf,U,sx,gy,t,al);if(g.age>=g.life)g.dead=true;return}
 if(g.spurt&&g.spurt.pc&&g.age<g.spurt.until){const sp=g.spurt,k=1-g.age/sp.until;if(Math.random()<sp.rate*k*.016*(g.lv===1?.6:1.2)){const q=gorePt(sp.pc,sp.fx,sp.fy);goreBlood(g,q[0],q[1],2,1.1,-1.4,.9,U,sx,gy)}}
 if(g.main){if(!g.pool&&g.age>.8&&!g.skel){g.pool=true;goreDecal(sx+g.dir*g.main.x*U,gy-U*.02,U*(.16+g.ov*.06+(g.big?.1:0)),g.col,.45)}
  c.save();c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.ellipse(sx+g.dir*g.main.x*U,gy,U*.3,U*.06,0,0,7);c.fill();c.restore()}
 const m=g.mount;if(m&&!m.done){const al=m.run?Math.max(0,Math.min(1,(m.dur-m.t)/.8)):1;goreMountDraw(c,g,Hf,U,sx,gy,t,al,m.run?0:m.fall,m.wt,m.run)}
 for(const q of g.pcs)gorePieceDraw(c,g,q,U,sx,gy);
 for(const q of g.pcs)if(q.hitG){q.hitG=false;if(q.kind==='wp')continue;const p=gorePt(q,q.cx,q.cy);if(!g.skel)goreBlood(g,p[0],p[1]-.02,5,.7,-1.2,.9,U,sx,gy);else goreBits(g,p[0],p[1],3,U,sx,gy,'bone')}
 if((g.age>1.2&&goreSettled(g))||g.age>g.life){goreBake(g,Hf,U,sx,gy,t);g.dead=true}}
function goreOver(c,g,o,U){const col=g.col,x=o.x*U,y=o.y*U;c.save();c.translate(x,y);
 if(o.t==='cap'||o.t==='band'){const w=o.w*U;if(o.a)c.rotate(o.a);c.fillStyle=g.skel?'#d8d2b8':col;c.beginPath();c.ellipse(0,0,w,w*(o.t==='band'?.28:.5),0,0,7);c.fill();c.fillStyle=g.skel?'#9a9478':'#5a0a0a';c.beginPath();c.ellipse(0,0,w*.55,w*.22,0,0,7);c.fill()}
 else if(o.t==='stain'){const r=o.r*U;c.fillStyle=col;c.globalAlpha*=.85;c.beginPath();for(let i=0;i<10;i++){const a=i/10*6.283,k=.7+((i*53)%7)/12;c.lineTo(Math.cos(a)*r*k,Math.sin(a)*r*k*1.1)}c.closePath();c.fill();c.fillStyle='#00000030';c.beginPath();c.arc(0,0,r*.4,0,7);c.fill();c.fillStyle=col;for(let i=0;i<3;i++)c.fillRect(-r*.5+i*r*.5,r*.7,Math.max(1.5,U*.02),r*(.4+.3*((i*3)%2)))}
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
 if(GORE.lc){GORE.fadeT+=dt;if(GORE.fadeT>2.5){GORE.fadeT=0;GORE.lc.save();GORE.lc.setTransform(1,0,0,1,0,0);GORE.lc.globalCompositeOperation='destination-out';GORE.lc.fillStyle='rgba(0,0,0,.03)';GORE.lc.fillRect(0,0,GORE.layer.width,GORE.layer.height);GORE.lc.restore()}}
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


