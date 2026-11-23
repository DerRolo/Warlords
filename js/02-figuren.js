/* Waffen, Koepfe, Reittiere, Figurenzeichnung */
/* ---------- Waffen ---------- */
function weapon(c,w,fk,hx,hy,wa,H,big,st){
 c.save();c.translate(hx,hy);c.rotate(Math.PI/2-wa);const s=big?1.3:1;c.scale(s,s);const m=st.metal,wood='#7a5230';
 const bl=lt(m,.35);
 if(w==='spear'||w==='jav'){const L=w==='jav'?.5:.8;limb(c,-H*.28,0,H*L,0,H*.025,wood);c.fillStyle=lt(m,.2);c.beginPath();c.moveTo(H*L,-H*.04);c.lineTo(H*(L+.17),0);c.lineTo(H*L,H*.04);c.fill()}
 else if(w==='halberd'){ // v0.29: Beilklinge zeigt nach vorn (+y), Haken nach hinten (-y), Spitze oben
  limb(c,-H*.3,0,H*.86,0,H*.026,wood);limb(c,H*.5,0,H*.88,0,H*.036,dk(wood,.2));
  const out=(col)=>{c.fillStyle=col;c.fill();c.strokeStyle=dk(m,.5);c.lineWidth=1;c.stroke()};
  c.beginPath();c.moveTo(H*.58,H*.012);c.quadraticCurveTo(H*.55,H*.2,H*.66,H*.29);c.quadraticCurveTo(H*.84,H*.27,H*.84,H*.012);c.closePath();out(lt(m,.2));
  c.strokeStyle=lt(m,.75);c.lineWidth=Math.max(1,H*.018);c.beginPath();c.moveTo(H*.56,H*.14);c.quadraticCurveTo(H*.6,H*.27,H*.68,H*.29);c.quadraticCurveTo(H*.8,H*.28,H*.83,H*.12);c.stroke();
  c.beginPath();c.moveTo(H*.62,-H*.012);c.lineTo(H*.5,-H*.12);c.lineTo(H*.7,-H*.012);c.closePath();out(dk(m,.1));
  c.beginPath();c.moveTo(H*.82,-H*.032);c.lineTo(H*1.04,0);c.lineTo(H*.82,H*.032);c.closePath();out(lt(m,.3));
  c.fillStyle=dk(m,.3);c.fillRect(H*.78,-H*.026,H*.05,H*.052)}
 else if(w==='glaive'){ // v0.30: Elfenglefe: Schaft, breite geschwungene Blattklinge, Schneide nach vorn (+y)
  limb(c,-H*.3,0,H*.64,0,H*.026,'#6a4a2a');limb(c,-H*.05,0,H*.12,0,H*.034,'#3f6a3a');
  c.fillStyle='#c9a64a';c.fillRect(H*.57,-H*.032,H*.06,H*.064);
  c.beginPath();c.moveTo(H*.62,-H*.02);c.quadraticCurveTo(H*.62,H*.27,H*.86,H*.23);c.quadraticCurveTo(H*1.02,H*.18,H*1.12,-H*.04);c.quadraticCurveTo(H*.88,-H*.05,H*.62,-H*.02);c.closePath();
  c.fillStyle=lt(m,.45);c.fill();c.strokeStyle=dk(m,.55);c.lineWidth=1;c.stroke();
  c.strokeStyle=lt(m,.9);c.lineWidth=Math.max(1,H*.016);c.beginPath();c.moveTo(H*.66,H*.12);c.quadraticCurveTo(H*.84,H*.2,H*1.0,H*.12);c.stroke();
  c.strokeStyle=dk(m,.4);c.lineWidth=1;c.beginPath();c.moveTo(H*.64,H*.0);c.lineTo(H*1.08,-H*.02);c.stroke()}
 else if(w==='sword'){limb(c,-H*.04,0,H*.34,0,H*.035,bl);limb(c,0,-H*.06,0,H*.06,H*.03,'#8a6a2a');limb(c,-H*.06,0,-H*.01,0,H*.035,'#5a3a1a')}
 else if(w==='greatsword'){c.fillStyle=bl;c.beginPath();c.moveTo(0,-H*.04);c.lineTo(H*.62,-H*.03);c.lineTo(H*.7,0);c.lineTo(H*.62,H*.03);c.lineTo(0,H*.04);c.fill();limb(c,0,-H*.1,0,H*.1,H*.035,'#8a6a2a');limb(c,-H*.12,0,-H*.01,0,H*.04,'#5a3a1a')}
 else if(w==='dagger'||w==='dagger2'||w==='scout'){limb(c,0,0,H*.2,0,H*.03,bl)}
 else if(w==='club'){limb(c,-H*.05,0,H*.36,0,H*.06,'#6a4524');c.fillStyle='#5a3a1c';c.beginPath();c.arc(H*.38,0,H*.075,0,7);c.fill();c.fillStyle=lt(m,.3);for(let i=0;i<3;i++){c.beginPath();c.arc(H*(.34+i*.03),(i-1)*H*.07,H*.018,0,7);c.fill()}}
 else if(w==='axe'||w==='axe2'){ // v0.29: Bartaxt: Schneide zeigt nach vorn (+y), Nacken hinten; axe2 = Doppelaxt
  limb(c,-H*.12,0,H*.56,0,H*.032,'#6a4524');limb(c,-H*.1,0,H*.04,0,H*.04,'#3a2412');
  const bit=(sg)=>{c.save();c.scale(1,sg);
   c.fillStyle=lt(m,.12);c.beginPath();c.moveTo(H*.5,H*.015);c.lineTo(H*.6,H*.17);c.quadraticCurveTo(H*.64,H*.2,H*.57,H*.26);c.quadraticCurveTo(H*.46,H*.34,H*.34,H*.27);c.quadraticCurveTo(H*.27,H*.22,H*.3,H*.15);c.quadraticCurveTo(H*.36,H*.1,H*.37,H*.015);c.closePath();c.fill();
   c.strokeStyle=dk(m,.5);c.lineWidth=1;c.stroke();
   c.strokeStyle=lt(m,.8);c.lineWidth=Math.max(1,H*.02);c.beginPath();c.moveTo(H*.6,H*.19);c.quadraticCurveTo(H*.56,H*.29,H*.45,H*.32);c.quadraticCurveTo(H*.35,H*.3,H*.31,H*.2);c.stroke();
   c.restore()};
  bit(1);
  if(w==='axe2')bit(-1);else{c.fillStyle=dk(m,.2);c.fillRect(H*.38,-H*.075,H*.12,H*.06);c.strokeStyle=dk(m,.55);c.lineWidth=1;c.strokeRect(H*.38,-H*.075,H*.12,H*.06)}
  c.fillStyle=dk(m,.3);c.fillRect(H*.36,-H*.026,H*.15,H*.052);c.strokeStyle=dk(m,.6);c.lineWidth=1;c.strokeRect(H*.36,-H*.026,H*.15,H*.052)}
 else if(w==='axejav'){limb(c,-H*.12,0,H*.3,0,H*.03,'#6a4524');c.fillStyle=lt(m,.15);c.beginPath();c.moveTo(H*.2,0);c.lineTo(H*.17,H*.18);c.quadraticCurveTo(H*.33,H*.26,H*.4,H*.12);c.lineTo(H*.33,0);c.fill();c.strokeStyle=dk(m,.5);c.lineWidth=1;c.stroke()}
 else if(w==='hammerjav'){
  const O=(col)=>{c.fillStyle=col;c.fill();c.strokeStyle=dk(m,.55);c.lineWidth=1;c.stroke()};
  limb(c,-H*.12,0,H*.32,0,H*.036,'#6a4524');
  c.beginPath();c.rect(H*.22,-H*.065,H*.12,H*.16);O(lt(m,.08));
  c.beginPath();c.rect(H*.205,H*.095,H*.15,H*.04);O(lt(m,.5));
  c.beginPath();c.moveTo(H*.23,-H*.065);c.lineTo(H*.33,-H*.065);c.lineTo(H*.28,-H*.15);c.closePath();O(dk(m,.15))}
 else if(w==='hammer'){ // v0.29: Kriegshammer: Kopf quer zum Stiel, Schlagflaeche vorn (+y), Dorn hinten (-y)
  const O=(col)=>{c.fillStyle=col;c.fill();c.strokeStyle=dk(m,.55);c.lineWidth=1;c.stroke()};
  limb(c,-H*.06,0,H*.46,0,H*.036,'#6a4524');limb(c,-H*.05,0,H*.05,0,H*.046,'#3a2412');
  c.beginPath();c.rect(H*.33,-H*.08,H*.15,H*.2);O(lt(m,.08));
  c.beginPath();c.rect(H*.31,H*.12,H*.19,H*.045);O(lt(m,.5));
  c.beginPath();c.moveTo(H*.34,-H*.08);c.lineTo(H*.47,-H*.08);c.lineTo(H*.405,-H*.2);c.closePath();O(dk(m,.15));
  c.fillStyle=dk(m,.35);c.fillRect(H*.33,-H*.012,H*.15,H*.03)}
 else if(w==='maul'){ // v0.29: Zweihandhammer: massiver Kopf quer zum Stiel, abgeschraegte Kanten, beide Seiten Schlagflaeche
  const O=(col)=>{c.fillStyle=col;c.fill();c.strokeStyle=dk(m,.55);c.lineWidth=1;c.stroke()};
  limb(c,-H*.2,0,H*.6,0,H*.045,'#6a4524');limb(c,-H*.05,0,H*.08,0,H*.055,'#3a2412');limb(c,H*.3,0,H*.34,0,H*.055,dk(m,.3));
  c.beginPath();c.moveTo(H*.46,-H*.17);c.lineTo(H*.7,-H*.17);c.lineTo(H*.75,-H*.12);c.lineTo(H*.75,H*.12);c.lineTo(H*.7,H*.17);c.lineTo(H*.46,H*.17);c.lineTo(H*.41,H*.12);c.lineTo(H*.41,-H*.12);c.closePath();O(lt(m,.05));
  c.fillStyle=lt(m,.5);c.fillRect(H*.46,H*.13,H*.24,H*.04);c.fillRect(H*.46,-H*.17,H*.24,H*.04);
  c.fillStyle=dk(m,.3);c.fillRect(H*.55,-H*.17,H*.07,H*.34);
  c.fillStyle='#d8b24a';c.beginPath();c.moveTo(H*.585,-H*.05);c.lineTo(H*.615,0);c.lineTo(H*.585,H*.05);c.lineTo(H*.555,0);c.closePath();c.fill()}
 else if(w==='spikemaul'){ // v0.29 Kriegsherr der Orks: Dornenkeule mit eisenbeschlagenem Kopf, Stacheln rundum und Schaedelknauf
  const O=(col)=>{c.fillStyle=col;c.fill();c.strokeStyle=dk(m,.55);c.lineWidth=1;c.stroke()};
  limb(c,-H*.2,0,H*.55,0,H*.05,'#5a3a1c');limb(c,-H*.05,0,H*.1,0,H*.06,'#2a1a0c');
  c.beginPath();c.moveTo(H*.44,-H*.1);c.quadraticCurveTo(H*.62,-H*.19,H*.8,-H*.12);c.lineTo(H*.8,H*.12);c.quadraticCurveTo(H*.62,H*.19,H*.44,H*.1);c.closePath();O(dk(m,.3));
  c.fillStyle=lt(m,.05);c.fillRect(H*.5,-H*.165,H*.045,H*.33);c.fillRect(H*.7,-H*.15,H*.045,H*.3);
  for(const x of [.5,.6,.7,.78]){for(const sg of [-1,1]){const y0=sg*H*(x>.65?.13:.15);c.beginPath();c.moveTo(H*(x-.035),y0);c.lineTo(H*x,sg*H*.285);c.lineTo(H*(x+.035),y0);c.closePath();O(lt(m,.55))}}
  c.beginPath();c.moveTo(H*.8,-H*.05);c.lineTo(H*.93,0);c.lineTo(H*.8,H*.05);c.closePath();O(lt(m,.55));
  c.fillStyle='#e8e0c0';c.beginPath();c.arc(H*.46,0,H*.045,0,7);c.fill();c.fillStyle='#222';c.fillRect(H*.44,-H*.015,H*.012,H*.012);c.fillRect(H*.462,-H*.015,H*.012,H*.012)}
 else if(w==='pick'){limb(c,-H*.06,0,H*.42,0,H*.03,'#6a4524');c.strokeStyle=lt(m,.2);c.lineWidth=H*.035;c.beginPath();c.moveTo(H*.28,-H*.1);c.quadraticCurveTo(H*.46,-H*.02,H*.34,H*.12);c.stroke()}
 else if(w==='claw'){ // v0.29: knorrige Hand mit kurzen, kraeftigen, gebogenen Krallen
  const sk='#8a9a7a',skd='#5a6a4e';
  c.fillStyle=skd;c.beginPath();c.ellipse(H*.02,0,H*.06,H*.05,0,0,7);c.fill();
  for(const f of [-1.5,-.5,.5,1.5]){const y=f*H*.03,y2=f*H*.042;
   limb(c,H*.04,y,H*.11,y2,H*.026,sk);limb(c,H*.04,y,H*.11,y2,H*.01,skd);
   c.fillStyle='#e6dfc0';c.beginPath();c.moveTo(H*.1,y2-H*.016);c.quadraticCurveTo(H*.2,y2-H*.012,H*.215,y2+H*.075);c.quadraticCurveTo(H*.16,y2+H*.025,H*.1,y2+H*.016);c.closePath();c.fill();c.strokeStyle='#7a7458';c.lineWidth=.8;c.stroke()}}
 else if(w==='mage'){const oc=(typeof FACTIONS!=='undefined'&&FACTIONS[fk])?FACTIONS[fk].orb:'#9cf';limb(c,-H*.25,0,H*.62,0,H*.03,'#5a3a1c');
  if(fk==='undead'){c.fillStyle='#d8d4c0';c.beginPath();c.arc(H*.66,0,H*.07,0,7);c.fill();c.fillStyle='#222';c.fillRect(H*.65,-H*.03,H*.02,H*.02);c.fillRect(H*.65,H*.01,H*.02,H*.02)}
  c.fillStyle=oc+'44';c.beginPath();c.arc(H*.66,0,H*.13,0,7);c.fill();c.fillStyle=oc;c.beginPath();c.arc(H*.7,0,H*.05,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(H*.69,-H*.015,H*.018,0,7);c.fill()}
 c.restore()}
/* ---------- Köpfe ---------- */
function headDraw(c,F,look,x,y,r,st,H){
 const fk=F.fk,hs=FPROP[fk].hs;r*=hs;c.save();c.translate(x,y);const h=look.h||'none',cl=F.cloth||st.cloth,metal=st.metal;
 const hoodCol=dk(look.t?mixc(cl,look.t,.6):cl,.15);
 if(h==='hood'||F.kind==='mage'&&h!=='hat'&&h!=='antler'&&h!=='skull'){c.fillStyle=hoodCol;c.beginPath();c.arc(-r*.3,r*.05,r*1.25,0,7);c.fill()}
 c.fillStyle=st.skin;c.beginPath();c.arc(0,0,r,0,7);c.fill();
 if(fk==='undead'&&!look.gh){
  c.fillStyle='#ebe6d2';c.beginPath();c.ellipse(0,-r*.1,r*1.0,r*1.08,0,0,7);c.fill();
  c.fillStyle='#d2ccb4';c.beginPath();c.moveTo(-r*.55,r*.5);c.lineTo(r*.7,r*.5);c.lineTo(r*.55,r*1.12);c.lineTo(-r*.4,r*1.12);c.fill();
  c.strokeStyle='#8a846e';c.lineWidth=Math.max(1,r*.07);c.beginPath();c.moveTo(-r*.55,r*.62);c.lineTo(r*.7,r*.62);for(let i=-2;i<=3;i++){c.moveTo(i*r*.2,r*.62);c.lineTo(i*r*.2,r*1.0)}c.stroke();
  c.fillStyle='#14101c';c.beginPath();c.ellipse(r*.38,-r*.12,r*.3,r*.34,0,0,7);c.ellipse(-r*.3,-r*.12,r*.28,r*.32,0,0,7);c.fill();
  c.beginPath();c.moveTo(r*.05,r*.18);c.lineTo(r*.22,r*.5);c.lineTo(-r*.1,r*.5);c.fill();
  c.fillStyle='#c58bff';c.beginPath();c.arc(r*.42,-r*.1,r*.1,0,7);c.arc(-r*.26,-r*.1,r*.09,0,7);c.fill()}
 else if(fk==='undead'){ // v0.29 Ghul: laenglicher Schaedel, hohle Wangen, leuchtende Augen, offenes Maul mit Fangzaehnen
  c.fillStyle=dk(st.skin,.12);c.beginPath();c.ellipse(r*.3,r*.55,r*.7,r*.55,0,0,7);c.fill();
  c.fillStyle='rgba(30,40,25,.4)';c.beginPath();c.ellipse(r*.1,r*.3,r*.5,r*.22,0,0,7);c.fill();
  c.fillStyle='#1c1a12';c.beginPath();c.ellipse(r*.42,-r*.1,r*.27,r*.21,0,0,7);c.ellipse(-r*.15,-r*.1,r*.22,r*.18,0,0,7);c.fill();
  c.fillStyle='#ffe34a';c.beginPath();c.arc(r*.46,-r*.1,r*.1,0,7);c.arc(-r*.12,-r*.1,r*.08,0,7);c.fill();
  c.fillStyle='#2a1410';c.beginPath();c.moveTo(r*.0,r*.32);c.lineTo(r*.95,r*.32);c.lineTo(r*.8,r*.85);c.quadraticCurveTo(r*.4,r*1.05,r*.05,r*.75);c.closePath();c.fill();
  c.fillStyle='#e6e1cc';for(let i=0;i<4;i++){c.beginPath();c.moveTo(r*(.12+i*.2),r*.32);c.lineTo(r*(.2+i*.2),r*.56);c.lineTo(r*(.28+i*.2),r*.32);c.fill()}
  for(let i=0;i<3;i++){c.beginPath();c.moveTo(r*(.22+i*.22),r*.8);c.lineTo(r*(.3+i*.22),r*.58);c.lineTo(r*(.38+i*.22),r*.82);c.fill()}
  c.fillStyle=st.skin;c.beginPath();c.moveTo(-r*.7,-r*.1);c.lineTo(-r*1.35,-r*.55);c.lineTo(-r*.85,r*.3);c.fill();
  c.strokeStyle='#3a3a2a';c.lineWidth=Math.max(1,r*.06);c.beginPath();c.moveTo(-r*.2,-r*.95);c.quadraticCurveTo(-r*.6,-r*1.3,-r*1.0,-r*.9);c.moveTo(0,-r*1.0);c.quadraticCurveTo(-r*.2,-r*1.45,-r*.6,-r*1.3);c.stroke()}
 else{c.fillStyle='#1a1a1a';c.beginPath();c.arc(r*.42,-r*.08,r*.12,0,7);c.fill()}
 if(fk==='orcs'){c.fillStyle='#f3eed8';c.beginPath();c.moveTo(r*.25,r*.45);c.lineTo(r*.38,r*.05);c.lineTo(r*.5,r*.45);c.fill()}
 if(fk==='dwarves'){c.fillStyle=st.hair;c.beginPath();c.moveTo(-r*.9,r*.0);c.quadraticCurveTo(0,r*2.9,r*.95,r*.0);c.quadraticCurveTo(r*.3,r*.5,-r*.9,r*.0);c.fill();c.strokeStyle=dk(st.hair,.4);c.lineWidth=1;c.beginPath();c.moveTo(0,r*.5);c.lineTo(0,r*1.7);c.moveTo(r*.4,r*.4);c.lineTo(r*.5,r*1.3);c.stroke()}
 const steel=lt(metal,.1),steelD=dk(metal,.5);
 const cap=(ext)=>{c.fillStyle=steel;c.beginPath();c.arc(0,-r*.1,r*1.1,3.2,6.2);c.lineTo(r*1.05,r*(ext||.1));c.lineTo(-r*1.05,r*(ext||.1));c.fill();c.strokeStyle=steelD;c.lineWidth=1;c.stroke()};
 if(h==='cap'){cap(-.1);c.fillStyle=steel;c.fillRect(r*.5,-r*.25,r*.2,r*.8)}
 else if(h==='plume'){cap(-.1);c.fillStyle=steel;c.fillRect(r*.5,-r*.25,r*.2,r*.8);c.fillStyle='#c0302a';c.beginPath();c.moveTo(-r*.1,-r*1.05);c.quadraticCurveTo(-r*1.2,-r*2.1,-r*1.5,-r*.8);c.quadraticCurveTo(-r*.6,-r*1.3,r*.2,-r*1.05);c.fill()}
 else if(h==='sallet'){c.fillStyle=steel;c.beginPath();c.arc(0,-r*.05,r*1.15,3.0,6.4);c.lineTo(r*1.1,r*.45);c.lineTo(-r*1.1,r*.7);c.fill();c.strokeStyle=steelD;c.lineWidth=1;c.stroke();c.fillStyle='#111';c.fillRect(r*.1,-r*.1,r*.9,r*.16)}
 else if(h==='plate'){c.fillStyle=steel;c.beginPath();c.arc(0,0,r*1.2,0,7);c.fill();c.strokeStyle=steelD;c.lineWidth=1.2;c.stroke();c.fillStyle='#111';c.fillRect(r*.05,-r*.18,r*1.1,r*.18);c.fillRect(r*.45,r*.1,r*.1,r*.5);c.fillStyle=look.cp||'#b33';c.beginPath();c.moveTo(-r*.2,-r*1.15);c.quadraticCurveTo(-r*1.3,-r*1.9,-r*1.6,-r*.5);c.quadraticCurveTo(-r*.7,-r*1.1,r*.2,-r*1.1);c.fill()}
 else if(h==='horned'||h==='pot'){cap(.05);if(h==='pot'){c.fillStyle=steelD;c.fillRect(-r*1.15,-r*.05,r*2.3,r*.14);c.fillStyle=steel;c.beginPath();c.moveTo(-r*.12,-r*1.1);c.lineTo(0,-r*1.5);c.lineTo(r*.12,-r*1.1);c.fill()}
  else{c.strokeStyle='#e8e0c0';c.lineWidth=r*.3;c.lineCap='round';c.beginPath();c.moveTo(-r*.7,-r*.7);c.quadraticCurveTo(-r*1.5,-r*1.1,-r*1.3,-r*1.9);c.moveTo(r*.5,-r*.8);c.quadraticCurveTo(r*1.4,-r*1.2,r*1.1,-r*1.9);c.stroke()}}
 else if(h==='hood'){c.strokeStyle=hoodCol;c.lineWidth=r*.55;c.lineCap='round';c.beginPath();c.arc(-r*.1,-r*.05,r*1.0,3.3,5.9);c.stroke();c.fillStyle=hoodCol;c.beginPath();c.moveTo(-r*1.2,-r*.2);c.lineTo(-r*1.9,r*.5);c.lineTo(-r*.8,r*.6);c.fill()}
 else if(h==='hat'){c.fillStyle=dk(cl,.1);c.beginPath();c.moveTo(-r*1.6,-r*.55);c.lineTo(-r*.2,-r*3.0);c.quadraticCurveTo(r*.3,-r*2.9,r*.8,-r*2.5);c.lineTo(r*1.5,-r*.55);c.fill();c.fillStyle=dk(cl,.35);c.beginPath();c.ellipse(0,-r*.55,r*1.9,r*.34,0,0,7);c.fill();c.fillStyle='#f2d36a';c.fillRect(-r*.9,-r*.95,r*1.8,r*.22)}
 else if(h==='circlet'){c.strokeStyle='#f2d36a';c.lineWidth=r*.2;c.beginPath();c.arc(0,-r*.05,r*1.02,3.5,5.9);c.stroke();c.fillStyle='#7fe8ff';c.beginPath();c.arc(r*.55,-r*.7,r*.18,0,7);c.fill()}
 else if(h==='antler'){c.strokeStyle='#8a6a40';c.lineWidth=r*.2;c.lineCap='round';for(const s of[-1,1]){const bx=s*r*.55-r*.1;c.beginPath();c.moveTo(bx,-r*.8);c.lineTo(bx+s*r*.4,-r*1.7);c.moveTo(bx+s*r*.15,-r*1.2);c.lineTo(bx+s*r*.8,-r*1.4);c.moveTo(bx+s*r*.3,-r*1.5);c.lineTo(bx-s*r*.1,-r*2.1);c.stroke()}
  c.strokeStyle='#3e8f48';c.lineWidth=r*.28;c.beginPath();c.arc(-r*.05,-r*.1,r*1.02,3.4,6.0);c.stroke()}
 else if(h==='skull'){c.fillStyle='#e6dfc6';c.beginPath();c.ellipse(-r*.1,-r*.9,r*.95,r*.7,0,0,7);c.fill();c.fillStyle='#222';c.beginPath();c.arc(r*.15,-r*.85,r*.2,0,7);c.arc(-r*.4,-r*.85,r*.2,0,7);c.fill();c.strokeStyle='#e6dfc6';c.lineWidth=r*.25;c.beginPath();c.moveTo(-r*.8,-r*1.2);c.quadraticCurveTo(-r*1.5,-r*1.6,-r*1.2,-r*2.2);c.moveTo(r*.5,-r*1.2);c.quadraticCurveTo(r*1.2,-r*1.6,r*.9,-r*2.2);c.stroke()}
 else if(h==='lamp'){c.fillStyle='#caa24a';c.beginPath();c.arc(0,-r*.1,r*1.1,3.2,6.2);c.fill();c.fillStyle='#fff6b0';c.beginPath();c.arc(r*.9,-r*.5,r*.28,0,7);c.fill();c.fillStyle='rgba(255,240,150,.25)';c.beginPath();c.arc(r*.9,-r*.5,r*.7,0,7);c.fill()}
 else if(h==='bandana'){c.fillStyle='#a02a22';c.fillRect(-r*1.05,-r*.7,r*2.1,r*.4);c.beginPath();c.moveTo(-r*1.0,-r*.5);c.lineTo(-r*1.8,-r*.2);c.lineTo(-r*1.1,-r*.1);c.fill()}
 else if(h==='feather'){c.fillStyle=hoodCol;c.beginPath();c.arc(0,-r*.1,r*1.08,3.2,6.2);c.lineTo(r*1.0,r*.05);c.lineTo(-r*1.0,r*.05);c.fill();c.strokeStyle='#d8503a';c.lineWidth=r*.2;c.lineCap='round';c.beginPath();c.moveTo(-r*.3,-r*.95);c.quadraticCurveTo(-r*1.3,-r*1.8,-r*1.9,-r*1.0);c.stroke();c.strokeStyle='#f2e4b0';c.lineWidth=r*.07;c.beginPath();c.moveTo(-r*.5,-r*1.15);c.quadraticCurveTo(-r*1.2,-r*1.6,-r*1.7,-r*1.05);c.stroke()}
 else if(h==='band'){c.fillStyle=look.t?dk(look.t,.1):'#6a4a2a';c.fillRect(-r*1.05,-r*.62,r*2.1,r*.32);c.fillStyle=lt(look.t||'#6a4a2a',.5);c.fillRect(r*.1,-r*.6,r*.35,r*.28);c.strokeStyle='#e8e0c0';c.lineWidth=r*.1;c.lineCap='round';c.beginPath();c.moveTo(-r*.6,-r*.62);c.lineTo(-r*.9,-r*1.35);c.stroke()}
 else if(h==='coif'){c.fillStyle=lt(metal,.15);c.beginPath();c.arc(-r*.05,-r*.05,r*1.2,2.6,6.5);c.lineTo(r*1.0,r*.55);c.lineTo(-r*1.2,r*.8);c.fill();c.strokeStyle=dk(metal,.35);c.lineWidth=1;for(let i=0;i<6;i++){c.beginPath();c.arc(-r*.05,-r*.05,r*(.5+i*.12),2.9,6.2);c.stroke()}c.fillStyle=st.skin;c.beginPath();c.ellipse(r*.35,r*.12,r*.7,r*.62,0,0,7);c.fill();c.fillStyle='#1a1a1a';c.beginPath();c.arc(r*.52,r*.0,r*.12,0,7);c.fill()}
 else if(h==='mohawk'){c.fillStyle='#1a1a1a';for(let i=0;i<6;i++){c.beginPath();c.moveTo(-r*.8+i*r*.28,-r*.8);c.lineTo(-r*.7+i*r*.28,-r*(1.7+(i%2)*.35));c.lineTo(-r*.55+i*r*.28,-r*.8);c.fill()}}
 else if(h==='fur'){c.fillStyle='#6a5030';c.beginPath();c.arc(0,-r*.2,r*1.25,3.1,6.3);c.fill();c.fillStyle='#8a6a40';for(let i=0;i<7;i++){c.beginPath();c.arc(-r*1.0+i*r*.33,-r*.55-(i%2)*r*.2,r*.28,0,7);c.fill()}c.fillStyle='#3a2a1a';c.fillRect(-r*1.1,-r*.45,r*2.2,r*.18)}
 else{ // keine Kopfbedeckung: Haare je Volk
  if(fk==='elves'){c.fillStyle=st.hair;c.beginPath();c.arc(-r*.1,-r*.1,r*1.1,2.2,5.9);c.fill();c.fillRect(-r*1.1,-r*.1,r*.7,r*1.7);c.fillStyle=st.skin;c.beginPath();c.moveTo(-r*.5,-r*.1);c.lineTo(-r*1.45,-r*.5);c.lineTo(-r*.6,r*.3);c.fill()}
  else if(fk==='orcs'){c.fillStyle='#222';c.beginPath();c.arc(-r*.1,-r*.95,r*.18,0,7);c.fill();c.fillRect(-r*.5,-r*1.1,r*.9,r*.28)}
  else if(fk==='humans'){c.fillStyle=st.hair;c.beginPath();c.arc(-r*.1,-r*.1,r*1.08,3.1,6.0);c.fill()}
  else if(fk==='undead'){c.fillStyle='#cfc9b2';c.fillRect(-r*.2,-r*1.15,r*.1,r*.3)}}
 if(fk==='elves'&&(h==='circlet'||h==='antler'||h==='hood'||h==='feather'||h==='band'||h==='coif')){c.fillStyle=st.skin;c.beginPath();c.moveTo(-r*.7,-r*.2);c.lineTo(-r*1.5,-r*.6);c.lineTo(-r*.8,r*.2);c.fill()}
 c.restore()}
/* ---------- Reittiere ---------- */
function drawMount(c,F,H,st,type,cloth){
 const M=MT[type],wt=F.wt,mv=F.mv&&F.fall<=0,Hh=H*1.2,col=M.col,t=F.t;
 const by=M.by*Hh,legTop=-(M.by-.06)*Hh,L=-legTop/2,small=(type==='boar'||type==='ram');
 const bob=mv?Math.abs(Math.sin(wt*.5+.4))*Hh*.05:Math.sin(t*1.6)*Hh*.006;
 const pitch=mv?Math.sin(wt*.5+1.2)*.05:0;
 // Galopp: Hinterbeine zuerst, dann Vorderbeine, Vorderbeine klappen beim Vorschwung stark ein
 const LG={hn:{x:-.3,off:0,fore:0},hf:{x:-.22,off:.12,fore:0},ff:{x:.22,off:.45,fore:1},fn:{x:.3,off:.57,fore:1}};
 const dkc=dk(col,.3);
 const dl=(g,near)=>{const l=LG[g],u=wt+l.off*6.283,A=l.fore?.85:.7,a=mv?Math.sin(u)*A:(l.fore?.03:-.03),fwd=mv?Math.max(0,Math.cos(u)):0,bd=mv?fwd*(l.fore?1.35:.9)+.08:.06;
  const hx=l.x*Hh*(M.rx/.44),hy=legTop,kx=hx+Math.sin(a)*L,ky=hy+Math.cos(a)*L,a2=l.fore?a-bd:a+bd*(.6),fx=kx+Math.sin(a2)*L,fy=ky+Math.cos(a2)*L;
  const lc=near?col:dkc,w1=Hh*(small?.1:.08),w2=Hh*(small?.075:.055);limb(c,hx,hy,kx,ky,w1,lc);limb(c,kx,ky,fx,fy,w2,lc);
  c.fillStyle=type==='skhorse'?'#8a846e':'#2a2a2a';c.beginPath();c.ellipse(fx+Hh*.02,fy,Hh*.045,Hh*.024,0,0,7);c.fill()};
 c.save();c.translate(0,-bob);
 dl('hf',false);dl('ff',false);
 c.save();c.translate(0,-by);c.rotate(pitch);c.translate(0,by);
 c.fillStyle=col;c.beginPath();c.ellipse(0,-by,Hh*M.rx,Hh*M.ry,0,0,7);c.fill();
 c.fillStyle=lt(col,.14);c.beginPath();c.ellipse(-Hh*.02,-by-Hh*M.ry*.4,Hh*M.rx*.78,Hh*M.ry*.35,0,0,7);c.fill();
 if(type==='skhorse'){c.strokeStyle='#8a846e';c.lineWidth=1.3;for(let i=-3;i<=3;i++){c.beginPath();c.arc(i*Hh*.09,-by,Hh*.14,.3,2.8);c.stroke()}}
 if(type==='ram'){c.fillStyle='#f4efe0';for(let i=0;i<9;i++){c.beginPath();c.arc(-Hh*.35+i*Hh*.09,-by+Math.sin(i*2)*Hh*.03+Hh*.12,Hh*.07,0,7);c.fill()}}
 if(type==='warhorse'){c.fillStyle=cloth;c.beginPath();c.moveTo(-Hh*.3,-by-Hh*M.ry*.2);c.lineTo(Hh*.3,-by-Hh*M.ry*.2);c.lineTo(Hh*.3+Math.sin(t*5)*2,-by+Hh*M.ry*1.1);c.lineTo(-Hh*.3,-by+Hh*M.ry*1.1);c.fill();c.fillStyle='#f2d36a';c.fillRect(-Hh*.3,-by+Hh*M.ry*1.05,Hh*.6,Hh*.03)}
 // Schweif weht im Lauf nach hinten
 const fl=mv?Hh*.18:Hh*.04;c.strokeStyle=dk(col,.25);c.lineWidth=Hh*(type==='wolf'?.06:.07);c.lineCap='round';c.beginPath();c.moveTo(-Hh*M.rx*.9,-by-Hh*.02);c.quadraticCurveTo(-Hh*(M.rx+.1)-fl*.5,-by+Math.sin(t*10)*Hh*.03,-Hh*(M.rx+.12)-fl,-by+Hh*(mv?.06:.22)+Math.sin(t*9)*Hh*.02);c.stroke();
 const hx=Hh*M.rx*.75,hy=-by-Hh*M.ry*.5,hb=mv?Math.sin(wt*.5+2.2)*Hh*.03:0;
 if(type==='wolf'||type==='boar'){
  const wolf=type==='wolf';c.save();c.translate(0,hb);c.fillStyle=col;c.beginPath();c.moveTo(hx-Hh*.1,hy-Hh*.05);c.lineTo(hx+Hh*.18,hy-Hh*.1);c.lineTo(hx+Hh*(wolf?.4:.34),hy+Hh*.02);c.lineTo(hx+Hh*(wolf?.36:.3),hy+Hh*.1);c.lineTo(hx+Hh*.12,hy+Hh*.12);c.lineTo(hx-Hh*.12,hy+Hh*.1);c.fill();
  c.fillStyle=wolf?'#f0d':'#f33';c.beginPath();c.arc(hx+Hh*.15,hy-Hh*.02,Hh*.016,0,7);c.fill();
  if(wolf){ // v0.22: Wolfskopf mit Maehne, Ohren, offenem Maul und Zaehnen
   c.fillStyle=dk(col,.35);for(let i=0;i<6;i++){c.beginPath();c.moveTo(hx-Hh*.16+i*Hh*.045,hy-Hh*.04);c.lineTo(hx-Hh*.13+i*Hh*.045,hy-Hh*(.17+(i%2)*.04));c.lineTo(hx-Hh*.1+i*Hh*.045,hy-Hh*.05);c.fill()}
   c.fillStyle=dk(col,.3);c.beginPath();c.moveTo(hx+Hh*.04,hy-Hh*.09);c.lineTo(hx+Hh*.07,hy-Hh*.24);c.lineTo(hx+Hh*.15,hy-Hh*.09);c.fill();c.fillStyle=dk(col,.5);c.beginPath();c.moveTo(hx-Hh*.02,hy-Hh*.08);c.lineTo(hx,hy-Hh*.2);c.lineTo(hx+Hh*.06,hy-Hh*.08);c.fill();
   c.fillStyle=dk(col,.2);c.beginPath();c.moveTo(hx+Hh*.12,hy+Hh*.1);c.lineTo(hx+Hh*.36,hy+Hh*.1);c.lineTo(hx+Hh*.3,hy+Hh*.2);c.lineTo(hx+Hh*.1,hy+Hh*.17);c.fill();c.fillStyle='#7a1a22';c.beginPath();c.moveTo(hx+Hh*.16,hy+Hh*.09);c.lineTo(hx+Hh*.36,hy+Hh*.08);c.lineTo(hx+Hh*.3,hy+Hh*.14);c.lineTo(hx+Hh*.16,hy+Hh*.13);c.fill();
   c.fillStyle='#fff';for(let i=0;i<4;i++){c.beginPath();c.moveTo(hx+Hh*(.18+i*.045),hy+Hh*.09);c.lineTo(hx+Hh*(.2+i*.045),hy+Hh*.14);c.lineTo(hx+Hh*(.22+i*.045),hy+Hh*.09);c.fill()}
   c.strokeStyle=dk(col,.45);c.lineWidth=Hh*.012;for(let i=0;i<7;i++){c.beginPath();c.moveTo(-Hh*M.rx*.7+i*Hh*.1,-by-Hh*M.ry*.9);c.lineTo(-Hh*M.rx*.72+i*Hh*.1,-by-Hh*M.ry*1.3);c.stroke()}}
  else{c.fillStyle='#f3eed8';c.beginPath();c.moveTo(hx+Hh*.28,hy+Hh*.08);c.quadraticCurveTo(hx+Hh*.4,hy-Hh*.04,hx+Hh*.38,hy-Hh*.1);c.lineTo(hx+Hh*.33,hy+Hh*.06);c.fill();c.fillStyle=dk(col,.3);for(let i=0;i<5;i++)c.fillRect(-Hh*.3+i*Hh*.14,-by-Hh*M.ry-Hh*.03,Hh*.05,Hh*.08)}c.restore()}
 else if(type==='ram'){c.save();c.translate(0,hb);c.fillStyle='#d8d0b8';c.beginPath();c.ellipse(hx+Hh*.12,hy+Hh*.02,Hh*.16,Hh*.11,.2,0,7);c.fill();c.strokeStyle='#cdbf9a';c.lineWidth=Hh*.05;c.beginPath();c.arc(hx+Hh*.08,hy-Hh*.02,Hh*.1,.5,5.2);c.stroke();c.fillStyle='#111';c.beginPath();c.arc(hx+Hh*.2,hy,Hh*.014,0,7);c.fill();c.restore()}
 else{ // Pferd / Hirsch / Skelettpferd
  c.save();c.translate(0,hb);c.fillStyle=col;c.beginPath();c.moveTo(hx-Hh*.12,hy+Hh*.02);c.lineTo(hx+Hh*.12,hy-Hh*.36);c.lineTo(hx+Hh*.26,hy-Hh*.33);c.lineTo(hx+Hh*.42,hy-Hh*.12);c.lineTo(hx+Hh*.34,hy-Hh*.06);c.lineTo(hx+Hh*.2,hy-Hh*.14);c.lineTo(hx+Hh*.02,hy+Hh*.14);c.fill();
  c.strokeStyle=type==='skhorse'?'#6a6452':dk(col,.4);c.lineWidth=Hh*.05;c.beginPath();c.moveTo(hx+Hh*.12,hy-Hh*.34);c.quadraticCurveTo(hx+Hh*.0,hy-Hh*.26+Math.sin(wt*.5)*Hh*.03,hx-Hh*.08-(mv?Hh*.05:0),hy-Hh*.04);c.stroke();
  c.fillStyle=type==='skhorse'?'#f25':'#111';c.beginPath();c.arc(hx+Hh*.24,hy-Hh*.24,Hh*.015,0,7);c.fill();
  if(type==='deer'){c.strokeStyle='#6a4a2a';c.lineWidth=Hh*.025;c.lineCap='round';c.beginPath();c.moveTo(hx+Hh*.15,hy-Hh*.34);c.lineTo(hx+Hh*.06,hy-Hh*.6);c.moveTo(hx+Hh*.1,hy-Hh*.46);c.lineTo(hx+Hh*.28,hy-Hh*.56);c.moveTo(hx+Hh*.09,hy-Hh*.55);c.lineTo(hx-Hh*.04,hy-Hh*.66);c.stroke()}
  if(type==='warhorse'){c.fillStyle='#aab';c.beginPath();c.moveTo(hx+Hh*.18,hy-Hh*.33);c.lineTo(hx+Hh*.4,hy-Hh*.12);c.lineTo(hx+Hh*.3,hy-Hh*.1);c.fill()}c.restore()}
 c.restore();
 dl('hn',true);dl('fn',true);
 c.restore()}
/* ---------- Figur ---------- */
const THR=['spear','halberd','glaive','claw','dagger','dagger2'],TWOH=['maul','spikemaul','greatsword','halberd','glaive','pick'];
function figure(c,F){
 const fpp=FPROP[F.fk],look=LOOK[F.fk+':'+F.name]||{},ghoul=!!look.gh,st=ghoul?Object.assign({},STY[F.fk],{skin:'#9bab8a'}):STY[F.fk],k=F.kind,big=!!F.big,t=F.t;
 const H=F.H*fpp.h,W=(big?1.35:1)*fpp.w*(ghoul?1.25:1);
 let cloth=F.cloth||st.cloth;if(look.t)cloth=mixc(cloth,look.t,F.cloth?.3:.6);
 const heavy=!!look.hv,metal=st.metal,undead=F.fk==='undead';
 const skel=undead&&!heavy&&k!=='mage'&&!ghoul,AW=skel?.55:1;
 const bodyCol=heavy?mixc(metal,cloth,.15):cloth,limbCol=undead&&!heavy?st.skin:heavy?dk(metal,.12):cloth;
 const mt=look.m,cav=!!mt||k==='cav';
 const wk=look.w||(k==='mage'?'mage':k==='bow'?'bow':k==='cav'?'spear':'sword');
 const ranged=(wk==='bow'||wk==='xbow'||wk==='gun'),p=F.p;
 c.save();c.translate(F.x,F.y);
 c.fillStyle='rgba(0,0,0,'+(.3*(F.alpha==null?1:F.alpha))+')';c.beginPath();c.ellipse(0,0,H*(cav?.55:.26*W),H*.065,0,0,7);c.fill();
 c.scale(F.dir,1);
 if(F.alpha!=null)c.globalAlpha=F.alpha;
 if(F.fall>0){c.translate(0,-H*.04*eo(F.fall));c.rotate(-eo(F.fall)*1.48)}
 if(F.hit>0&&F.fall<=0)c.translate(-H*.03*F.hit/.15,0);
 const mv=F.mv&&F.fall<=0,wt=F.wt;
 const seat=cav?MT[mt||'horse'].seat:.44,hipY=seat*H*(cav?1.2:1);
 if(cav)drawMount(c,F,H,st,mt||'horse',cloth);
 const bob=(mv&&!cav?Math.abs(Math.sin(wt))*H*.03:Math.sin(t*2+F.ph)*H*.006)+(cav&&mv?Math.abs(Math.sin(wt*.5+.4))*H*1.2*.05:0);
 const hy=-hipY-bob;
 const boot=dk(cloth,.55),pant=undead&&!heavy?st.skin:heavy?dk(metal,.25):dk(cloth,.35);
 if(!cav){
  const sA=mv?Math.sin(wt)*.65:(p>=0?.28:.1),sB=mv?-Math.sin(wt)*.65:(p>=0?-.2:-.08);
  const bA=mv?Math.max(0,Math.sin(wt+1.6))*.85:.05,bB=mv?Math.max(0,-Math.sin(wt+1.6))*.85:.05;
  leg(c,-H*.03,hy,H,sB,bB,dk(pant,.2),skel?'#b5b09a':boot,skel?W*.5:W);leg(c,H*.03,hy,H,sA,bA,pant,skel?'#b5b09a':boot,skel?W*.5:W);
 }else{ // Reiterbein mit Stiefel im Steigbügel
  const sw=mv?Math.sin(wt*2)*.05:0;
  const kx=H*.14,ky=hy+H*.17,fx=H*.05+sw*H,fy=hy+H*.38;
  limb(c,-H*.02,hy,kx,ky,H*.1*W,dk(pant,.1));limb(c,kx,ky,fx,fy,H*.08*W,pant);c.fillStyle=boot;c.beginPath();c.ellipse(fx+H*.035,fy+H*.01,H*.065,H*.032,.1,0,7);c.fill();
 }
 if(k==='mage'){const sw=mv?Math.sin(wt)*H*.04:0;c.fillStyle=dk(cloth,.15);c.beginPath();c.moveTo(-H*.1*W,hy);c.lineTo(H*.1*W,hy);c.lineTo(H*.17+sw,-H*.03);c.lineTo(-H*.17+sw,-H*.03);c.fill();c.fillStyle=dk(cloth,.4);c.fillRect(-H*.17+sw,-H*.05,H*.34,H*.03)}
 // Pose
 let lean=(mv?(cav?.13+Math.sin(wt*.5+1.2)*.04:.05):0)+(fpp.hunch||0)+(ghoul?.22:0),a=.5,ext=0,throwHide=false;
 const THRUST=THR.includes(wk);
 if(!ranged&&p>=0){
  if(THRUST){const e=p<.3?-(p/.3)*.3:p<.55?-.3+((p-.3)/.25)*1.3:1-(p-.55)/.45;ext=e*H*(wk==='spear'||wk==='halberd'||wk==='glaive'?.3:.2);a=wk==='spear'||wk==='halberd'||wk==='glaive'?1.3:1.2;lean+=e*.13}
  else if((wk==='jav'||wk==='axejav'||wk==='hammerjav')){if(p<.45)a=.5+2.7*eo(p/.45);else a=3.2-2.0*Math.min(1,ei((p-.45)/.3));lean+=p<.45?-.1:.15;throwHide=p>.72&&p<.97}
  else if(wk==='mage'){a=1.7+Math.sin(Math.min(1,p)*Math.PI)*.9;lean-=.04}
  else{const w=(wk==='sword'||wk==='dagger')?2.7:3.5;if(p<.35)a=.5+(w-.5)*eo(p/.35);else if(p<.62)a=w-(w-1)*ei((p-.35)/.27);else a=1+(.5-1)*((p-.62)/.38);lean+=p<.35?-.12*p/.35:.2}
 }else if(!ranged&&mv&&!cav)a=.35+Math.sin(wt)*.3;
 c.save();c.translate(0,hy);c.rotate(lean);
 const tw=H*.1*W,sy=-H*.3;
 // Umhang
 const capeCol=look.cp||((F.fk==='elves'||F.fk==='humans')&&!heavy?dk(cloth,.25):null);
 if(capeCol){const ln=look.cp?.46:.34;c.fillStyle=dk(capeCol,.1);c.beginPath();c.moveTo(-tw,sy);c.quadraticCurveTo(-tw-H*.16-(mv?H*.08:0),sy+H*.2,-tw-H*.05-(mv?H*.12:0)+Math.sin(t*4)*H*.012,sy+H*ln);c.lineTo(-tw*.3,sy+H*(ln-.1));c.lineTo(-tw*.2,sy+H*.05);c.fill()}
 const BIG2=TWOH.includes(wk);
 const shx=H*.04,shy=sy+H*.02;
 // hintere Hand
 const abAng=ranged?1.35:(mv?.4-Math.sin(wt)*.5:.25);
 let bhx=-H*.02+Math.sin(abAng)*H*.27,bhy=sy+Math.cos(abAng)*H*.27;
 limb(c,-H*.02,sy,bhx,bhy,H*.07*W*AW,dk(limbCol,.12));
 if(ghoul)weapon(c,'claw',F.fk,bhx,bhy,1.2+(mv?Math.sin(wt)*.35:Math.sin(t*2+F.ph)*.06),H,false,st);
 // Torso
 const tg=c.createLinearGradient(-tw,0,tw,0);tg.addColorStop(0,dk(bodyCol,.3));tg.addColorStop(.55,bodyCol);tg.addColorStop(1,lt(bodyCol,.14));
 if(skel){
  const bn='#e6e1cc',bd2='#a39d86';
  c.fillStyle='rgba(20,14,28,.55)';c.beginPath();c.moveTo(-tw*.85,sy+H*.02);c.lineTo(tw*.85,sy+H*.02);c.lineTo(tw*.5,-H*.02);c.lineTo(-tw*.5,-H*.02);c.fill();
  c.strokeStyle=bn;c.lineCap='round';c.lineWidth=H*.03;c.beginPath();c.moveTo(0,sy);c.lineTo(-H*.005,-H*.03);c.stroke();
  c.lineWidth=H*.028;c.beginPath();c.moveTo(-tw*1.05,sy+H*.012);c.lineTo(tw*1.05,sy+H*.012);c.stroke();
  c.lineWidth=H*.022;for(let i=0;i<5;i++){const y=sy+H*.045*(i+1),w=tw*(.98-i*.1);c.beginPath();c.moveTo(0,y);c.quadraticCurveTo(w*.9,y-H*.025,w,y+H*.018);c.moveTo(0,y);c.quadraticCurveTo(-w*.9,y-H*.025,-w,y+H*.018);c.stroke()}
  c.fillStyle=bn;c.beginPath();c.ellipse(0,-H*.035,tw*.75,H*.04,0,0,7);c.fill();c.strokeStyle=bd2;c.lineWidth=1;c.stroke();
  c.fillStyle='#3d2360';c.beginPath();c.moveTo(-tw*.7,-H*.04);c.lineTo(tw*.7,-H*.04);c.lineTo(tw*.5+Math.sin(t*3)*2,H*.06);c.lineTo(-tw*.4,H*.08);c.fill();
 }else{
  c.fillStyle=ghoul?'#8e9e80':tg;
  c.beginPath();c.moveTo(-tw*1.05,sy);c.lineTo(tw*1.05,sy);c.lineTo(tw*.8,0);c.lineTo(-tw*.8,0);c.closePath();c.fill();
  if(ghoul){c.strokeStyle='#5a6a4e';c.lineWidth=1.3;for(let i=0;i<4;i++){c.beginPath();c.moveTo(-tw*.7,sy+H*.06*(i+.6));c.lineTo(tw*.7,sy+H*.06*(i+.6));c.stroke()}c.fillStyle='#3d3a2a';c.fillRect(-tw*.9,-H*.05,tw*1.8,H*.06);
   c.fillStyle='#4a4536';c.beginPath();c.moveTo(-tw*.9,-H*.05);c.lineTo(tw*.9,-H*.05);c.lineTo(tw*.85,H*.1);c.lineTo(tw*.5,H*.05);c.lineTo(tw*.25,H*.14);c.lineTo(-tw*.1,H*.06);c.lineTo(-tw*.45,H*.13);c.lineTo(-tw*.9,H*.06);c.closePath();c.fill();
   c.fillStyle='rgba(70,25,25,.55)';c.beginPath();c.ellipse(tw*.35,sy+H*.07,H*.022,H*.03,.4,0,7);c.fill();c.beginPath();c.ellipse(-tw*.3,sy+H*.15,H*.018,H*.026,-.3,0,7);c.fill()}
 }
 if(skel||ghoul){}
 else{c.fillStyle='rgba(0,0,0,.35)';c.fillRect(-tw*.85,-H*.045,tw*1.7,H*.04);
  if(heavy){c.fillStyle=cloth;c.beginPath();c.moveTo(-tw*.5,sy+H*.02);c.lineTo(tw*.5,sy+H*.02);c.lineTo(tw*.45,H*.1);c.lineTo(-tw*.45,H*.1);c.fill();c.strokeStyle=dk(metal,.5);c.lineWidth=1;c.strokeRect(-tw*.9,sy,tw*1.8,H*.3);c.fillStyle=lt(metal,.5);c.fillRect(-tw*.12,sy+H*.02,tw*.24,H*.2)}
  else if(F.arm>=35){c.fillStyle=lt(metal,.05);c.beginPath();c.moveTo(-tw,sy);c.lineTo(tw,sy);c.lineTo(tw*.85,sy+H*.15);c.lineTo(-tw*.85,sy+H*.15);c.fill();c.strokeStyle=dk(metal,.5);c.lineWidth=1;c.stroke()}
  else if(F.arm<=15&&F.fk!=='undead'){c.strokeStyle=dk(cloth,.5);c.lineWidth=H*.025;c.beginPath();c.moveTo(-tw,sy);c.lineTo(tw*.9,-H*.02);c.stroke()}}
 if(heavy||F.arm>=50){c.fillStyle=lt(metal,.12);c.strokeStyle=dk(metal,.5);c.lineWidth=1;c.beginPath();c.arc(H*.02,sy,H*.075*W,3.2,6.3);c.fill();c.stroke();if(heavy){c.beginPath();c.arc(-tw*.9,sy+H*.01,H*.06*W,3.2,6.3);c.fill();c.stroke()}}
 headDraw(c,F,look,H*.03+(fpp.hunch?H*.03:0)+(ghoul?H*.025:0),sy-H*.115,H*.085*(F.fk==='orcs'?1.1:1)*(big?1.05:1)*(ghoul?1.3:1),st,H);
 if(!ranged&&!cav&&F.hasShield&&!BIG2&&wk!=='dagger2'&&wk!=='axe2'){const sx=H*.12,syy=sy+H*.17,sc=big?1.3:1,sh=F.fk==='dwarves'?'#8a6a2a':lt(cloth,.1);c.fillStyle=sh;c.strokeStyle=dk(metal,.4);c.lineWidth=H*.025;c.beginPath();c.ellipse(sx,syy,H*.1*sc,H*.15*sc,0,0,7);c.fill();c.stroke();c.fillStyle=lt(metal,.4);c.beginPath();c.arc(sx,syy,H*.035,0,7);c.fill()}
 // Vorderarm / Waffe
 if(ranged){
  let pull=0;if(p>=0)pull=p<.65?eo(p/.65):Math.max(0,1-(p-.65)/.08);
  const bx=shx+H*.28,by=shy+H*.07;
  if(wk==='bow'){limb(c,shx,shy,bx,by,H*.065,dk(limbCol,.05));
   const long=F.fk==='elves'&&look.h==='hood'&&F.name==='Falkenschütze';const bl=H*(long?.38:.3);
   c.strokeStyle=undead?'#c9c2a2':'#6a4524';c.lineWidth=H*.03;c.lineCap='round';c.beginPath();c.moveTo(bx,by-bl);c.quadraticCurveTo(bx+H*.15,by,bx,by+bl);c.stroke();
   const px=bx-pull*H*.2;c.strokeStyle='#e8e0c8';c.lineWidth=1;c.beginPath();c.moveTo(bx,by-bl);c.lineTo(px,by);c.lineTo(bx,by+bl);c.stroke();
   if(pull>.02&&!(p>.65)){limb(c,px,by,px+H*.5,by,H*.012,'#d8d0b0');c.fillStyle='#ccc';c.beginPath();c.moveTo(px+H*.5,by-H*.02);c.lineTo(px+H*.58,by);c.lineTo(px+H*.5,by+H*.02);c.fill();limb(c,shx,shy,px,by,H*.06,dk(limbCol,.1))}}
  else if(wk==='xbow'){const rec=p>=0&&p>.4&&p<.6?-H*.03:0;limb(c,shx,shy,shx+H*.3,shy+H*.1,H*.065,dk(limbCol,.05));limb(c,-H*.02,sy,shx+H*.12,shy+H*.12,H*.06,dk(limbCol,.15));
   c.save();c.translate(shx+H*.2+rec,shy+H*.1);c.fillStyle='#6a4524';c.fillRect(-H*.1,-H*.02,H*.42,H*.045);c.strokeStyle='#4a3420';c.lineWidth=H*.03;c.beginPath();c.moveTo(H*.28,-H*.17);c.quadraticCurveTo(H*.34,0,H*.28,H*.17);c.stroke();c.strokeStyle='#ddd';c.lineWidth=1;c.beginPath();c.moveTo(H*.28,-H*.17);c.lineTo(H*.14+(p>=0&&p<.5?-H*.03:0),0);c.lineTo(H*.28,H*.17);c.stroke();
   if(!(p>.45&&p<.9)){c.fillStyle='#ccc';c.fillRect(H*.14,-H*.008,H*.26,H*.016)}c.restore()}
  else if(wk==='gun'){const rec=p>=0&&p>.35&&p<.55?-H*.04:0;limb(c,shx,shy,shx+H*.32,shy+H*.1,H*.065,dk(limbCol,.05));limb(c,-H*.02,sy,shx+H*.1,shy+H*.12,H*.06,dk(limbCol,.15));
   c.save();c.translate(shx+rec,shy+H*.1);c.fillStyle='#5a3a1c';c.fillRect(-H*.08,-H*.025,H*.2,H*.06);c.fillStyle='#444';c.fillRect(H*.1,-H*.018,H*.5,H*.035);if(p>=.3&&p<.5){c.fillStyle='#ffd24a';c.beginPath();c.arc(H*.66,0,H*.07,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(H*.66,0,H*.035,0,7);c.fill()}c.restore()}
 }else{
  const L=H*.27,hx=shx+Math.sin(a)*L+ext,hy2=shy+Math.cos(a)*L;
  limb(c,shx,shy,hx,hy2,H*.075*W*AW,limbCol);
  let wa;if(p>=0)wa=THRUST&&wk!=='dagger2'?(wk==='claw'?1.4:1.5):THRUST?1.5:(wk==='jav'||wk==='axejav'||wk==='hammerjav')?a:wk==='mage'?a+.9:a+.05;
  else wa=(wk==='spear'||wk==='halberd'||wk==='glaive')?(mv?1.9:2.9):wk==='mage'?3.0:wk==='sword'||wk==='greatsword'?2.4:wk==='claw'?1.4:(wk==='jav'||wk==='axejav'||wk==='hammerjav')?(mv?1.6:2.6):2.2;
  // zweihändig: hintere Hand folgt
  if(BIG2){limb(c,-H*.02,sy,hx-Math.sin(wa)*H*.05,hy2-Math.cos(wa)*H*.05,H*.07*W*AW,dk(limbCol,.1))}
  if(wk==='dagger2'||wk==='axe2'){const a2=p>=0?a:(mv?.5-Math.sin(wt)*.4:.3),hx2=-H*.02+Math.sin(a2)*H*.27,hy3=sy+Math.cos(a2)*H*.27;weapon(c,wk==='axe2'?'axe':'dagger',F.fk,hx2,hy3,p>=0?a2+.3:2.0,H,big,st)}
  if(!throwHide)weapon(c,wk,F.fk,hx,hy2,wa,H,big,st);
  c.fillStyle=st.skin;c.beginPath();c.arc(hx,hy2,H*.035*W,0,7);c.fill();
 }
 c.restore();
 if(F.hit>0){c.globalAlpha=.4*F.hit/.15;c.fillStyle='#fff';c.fillRect(-H*.25,-H*1.05,H*.5,H*1.05);c.globalAlpha=1}
 c.restore()}

