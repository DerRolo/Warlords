/* Synth-Sound, Effekte, Viking-Schlachtlied, Fanfaren-Faerbung; Musik-Engine (Synth-Musik) */
/* ===== Synthetischer Sound: Effekte + epische Musik (WebAudio, ohne Dateien) ===== */
const AU={ctx:null,master:null,mus:null,sfx:null,wet:null,noise:null,opt:{music:.6,sfx:.8},last:{},musicMode:'off',next:0,step:0,timer:null};
/* v0.21 Handy-Stabilitaet: Auf Touch-Geraeten ('lite') groesserer Audio-Puffer, kuerzerer Hall, leichtere Synth-Stimmen und laengerer Planungsvorlauf. */
function audioLite(){try{return matchMedia('(pointer:coarse)').matches||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)}catch(e){return false}}
function audioResume(){const c=AU.ctx;if(c&&c.state!=='running'&&c.state!=='closed'){try{const p=c.resume();if(p&&p.catch)p.catch(()=>{})}catch(e){}}}
function audioWatch(){ // called every battle frame, throttled: wakes a context that the system suspended or interrupted (iOS 'interrupted')
 if(!AU.ctx)return;const n=performance.now();if(n-(AU.wd||0)<2000)return;AU.wd=n;if(!document.hidden)audioResume()}
['pointerdown','touchend'].forEach(ev=>document.addEventListener(ev,audioResume,{passive:true,capture:true}));
function auInit(){
 if(AU.ctx){audioResume();return}
 const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
 AU.lite=audioLite();
 try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){} // iOS: Musik (Audio-Element) und WebAudio in derselben Sitzung, kein Stummschalter-Wechsel
 let x;try{x=AU.ctx=AU.lite?new C({latencyHint:'playback'}):new C()}catch(e){x=AU.ctx=new C()}
 AU.master=x.createGain();AU.master.gain.value=.9;
 const comp=x.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=5;
 AU.master.connect(comp);comp.connect(x.destination);
 AU.musOut=x.createGain();AU.sfx=x.createGain();AU.musOut.connect(AU.master);AU.sfx.connect(AU.master);
 const len=x.sampleRate*1,buf=x.createBuffer(1,len,x.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;AU.noise=buf;
 // Hall
 const il=Math.floor(x.sampleRate*(AU.lite?1.1:2.2)),rc=AU.lite?1:2,ib=x.createBuffer(rc,il,x.sampleRate);for(let c=0;c<rc;c++){const dd=ib.getChannelData(c);for(let i=0;i<il;i++)dd[i]=(Math.random()*2-1)*Math.pow(1-i/il,2.6)}
 AU.ir=ib;newMusBus(true);
 auVol();smpLoad();fanLoad();
}
/* Jede Musik bekommt einen eigenen Kanal. Beim Wechsel wird der alte in 0,12 s ausgeblendet, der neue startet sofort. */
function newMusBus(first){const x=AU.ctx;if(AU.bus&&!first){const old=AU.bus,t=x.currentTime;try{old.g.gain.cancelScheduledValues(t);old.g.gain.setValueAtTime(old.g.gain.value,t);old.g.gain.linearRampToValueAtTime(0,t+.12)}catch(e){}setTimeout(()=>{try{old.g.disconnect();if(old.cv)old.cv.disconnect();old.wet.disconnect()}catch(e){}},600)}
 const g=x.createGain();g.connect(AU.musOut);const wet=x.createGain();wet.gain.value=.5;wet.connect(g);
 if(!first){g.gain.setValueAtTime(0,x.currentTime);g.gain.linearRampToValueAtTime(1,x.currentTime+.08)}AU.bus={g,cv:null,wet};AU.mus=g}
/* AU.rev: Hall-Faltung wird erst beim ersten Synth-Ton dieser Musik angelegt (bei Dateimusik nie) */
Object.defineProperty(AU,'rev',{configurable:true,get(){const b=AU.bus;if(!b)return null;if(!b.cv){const cv=AU.ctx.createConvolver();cv.buffer=AU.ir;cv.connect(b.wet);b.cv=cv}return b.cv}});
function auVol(){if(typeof fmVol==='function')fmVol();if(!AU.ctx)return;AU.musOut.gain.value=AU.opt.music*.55;AU.sfx.gain.value=AU.opt.sfx*.9}
function pan(x){if(!AU.ctx.createStereoPanner)return null;const p=AU.ctx.createStereoPanner();p.pan.value=Math.max(-.8,Math.min(.8,(x/(window.CURFW||FW)-.5)*1.4));return p}
function out(node,x,dest){let n=node;if(x!=null){const p=pan(x);if(p){n.connect(p);n=p}}n.connect(dest||AU.sfx)}
function tone(f,dur,type,vol,o){o=o||{};const x=AU.ctx,t=(o.at||x.currentTime),osc=x.createOscillator(),g=x.createGain();
 osc.type=type||'sine';osc.frequency.setValueAtTime(f,t);if(o.to)osc.frequency.exponentialRampToValueAtTime(Math.max(20,o.to),t+dur);
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+(o.att||.005));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 let n=osc;if(o.lp){const fl=x.createBiquadFilter();fl.type='lowpass';fl.frequency.value=o.lp;osc.connect(fl);n=fl}
 n.connect(g);osc.start(t);osc.stop(t+dur+.05);out(g,o.x,o.dest);return g}
function nz(dur,vol,type,f0,f1,o){o=o||{};const x=AU.ctx,t=(o.at||x.currentTime),s=x.createBufferSource();s.buffer=AU.noise;s.loop=true;
 const fl=x.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.setValueAtTime(f0,t);if(f1)fl.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur);fl.Q.value=o.q||1;
 const g=x.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+(o.att||.004));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 s.connect(fl);fl.connect(g);s.start(t,Math.random());s.stop(t+dur+.05);out(g,o.x,o.dest)}
function gate(key,ms){const n=performance.now();if(AU.last[key]&&n-AU.last[key]<ms)return false;AU.last[key]=n;return true}
/* ---- Samples (v0.14): echte Geraeusche aus dem Datenblock #snd. Fehlt eine Kategorie oder scheitert das Dekodieren,
   springt genau diese Kategorie auf die Synth-Sounds zurueck. ---- */
const SMP={bank:{},loading:false,active:0,amb:null};
function smpLoad(){ // decode once, after the first user gesture (auInit)
 if(SMP.loading||!AU.ctx)return;SMP.loading=true;
 let data;try{data=window.KH_SND}catch(e){return}
 for(const c in data){SMP.bank[c]=[];for(const b64 of data[c]){try{
  const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  new Promise((res,rej)=>{const r=AU.ctx.decodeAudioData(u.buffer,res,rej);if(r&&r.then)r.then(res,rej)}).then(buf=>{if(buf)SMP.bank[c].push(buf)}).catch(()=>{});
 }catch(e){}}}}
function smpHas(c){const a=SMP.bank[c];return !!(a&&a.length)}
function smp(cat,x,o){o=o||{};const a=SMP.bank[cat];if(!AU.ctx||!a||!a.length||SMP.active>=(AU.lite?12:22))return false;
 const t=AU.ctx.currentTime,s=AU.ctx.createBufferSource(),g=AU.ctx.createGain();s.buffer=a[Math.floor(Math.random()*a.length)];
 s.playbackRate.value=(o.rate||1)*(1+(Math.random()-.5)*.08);g.gain.value=o.g==null?1:o.g;s.connect(g);
 SMP.active++;s.onended=()=>{SMP.active--};
 out(g,x,o.dest);s.start(t);
 if(o.max){g.gain.setValueAtTime(g.gain.value,t+Math.max(0,o.max-.8));g.gain.linearRampToValueAtTime(.0001,t+o.max);s.stop(t+o.max+.05)}
 return true}
/* Stimmen (vox, nicht "voice": der Name ist im Musikteil schon belegt): Wahrscheinlichkeit p pro Ereignis, Mindestabstand gap in ms. Ohne Sample greift (falls vorhanden) ein kleiner Synth. */
const VFALL={
 orc_grunt(x){tone(95+Math.random()*30,.28,'sawtooth',.2,{x,to:62,lp:650});nz(.22,.12,'bandpass',900,450,{x,q:1.2})},
 orc_big(x){tone(60,.5,'sawtooth',.24,{x,to:42,lp:420});nz(.4,.14,'lowpass',700,200,{x})},
 orc_roar(x){tone(70+Math.random()*15,.9,'sawtooth',.22,{x,to:48,lp:520});nz(.8,.12,'bandpass',700,350,{x,q:.9})},
 ghoul(x){tone(520+Math.random()*80,.6,'sawtooth',.1,{x,to:300,lp:1800});nz(.5,.1,'bandpass',2200,900,{x,q:2})},
 skeleton_hit(x){for(let i=0;i<2;i++)nz(.03,.4,'bandpass',4200+Math.random()*1500,2500,{x,q:4,at:AU.ctx.currentTime+i*.035})},
 skeleton_rattle(x){for(let i=0;i<6;i++)nz(.03,.3,'bandpass',3800+Math.random()*2000,2200,{x,q:4,at:AU.ctx.currentTime+i*(.04+Math.random()*.03)})}
};
function vox(cat,x,p,gap,g){if(Math.random()>=p||!gate('v'+cat,gap))return false;
 if(smp(cat,x,{g:g==null?.8:g}))return true;const f=VFALL[cat];if(f){f(x);return true}return false}
const XBOW_N={'Armbrustschütze':1,'Büchsenschütze':1},THROW_N={'Speerwerfer':1,'Pestschleuder':1};
function swingSmp(k,x){ // weapon sound from samples; false = caller plays the synth instead
 if(k==='sword'){const r=Math.random();return smp(r<.62?'sword':r<.86?'sword_clang':'shield',x,{g:.9})}
 if(k==='spear')return smp('spear',x,{g:.95});
 if(k==='axe')return smp('axe',x,{g:.95});
 if(k==='club')return smp('club',x,{g:.95});
 if(k==='hammer')return smp('club',x,{g:1,rate:.82});
 if(k==='big')return smp('big',x,{g:.95});
 return false}
function swingVoices(e){const x=e.x,fk=e.fk;
 if(fk==='orcs'){if(e.big){if(!vox('orc_big',x,.3,1800,.9))vox('orc_roar',x,.1,4000,.85)}else vox('orc_grunt',x,.1,800,.75);
  vox('orc_talk',x,.0015,30000,.8);vox('orc_laugh',x,.0007,90000,.8)}
 else if(fk==='undead'){
  if(e.k==='claw')vox('ghoul',x,.28,900,.85);
  else if(e.k==='sword'){vox('skeleton_hit',x,.5,0,.7);vox('skeleton_rattle',x,.05,900,.65)}
  vox('undead_wail',x,.0008,60000,.7)}}
function hornFor(fk,start){ // horn 2 for humans and elves, battle horn for the others; extras only on a real charge
 const c=(fk==='orcs'||fk==='dwarves'||fk==='undead')?'horn_dark':'horn_human';
 if(!smp(c,null,start?{g:.95,max:3.6}:{g:.95})){SFX.horn();return}
 if(start)return;
 if(fk==='orcs'){setTimeout(()=>vox('orc_roar',null,1,0,.9),700);[1300,1700,2100].forEach(t=>setTimeout(()=>vox('orc_grunt',null,1,0,.8),t))}
 else if(fk==='undead')setTimeout(()=>vox('undead_wail',null,1,0,.7),1200)}
function ambStart(){if(!AU.ctx||SMP.amb||AU.opt.sfx<=0)return;const a=SMP.bank.amb_loop;if(!a||!a.length)return;
 const t=AU.ctx.currentTime,s=AU.ctx.createBufferSource(),g=AU.ctx.createGain();s.buffer=a[0];s.loop=true;
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.4,t+2.5);s.connect(g);g.connect(AU.sfx);s.start(t);SMP.amb={s,g}}
function ambStop(){const m=SMP.amb;if(!m)return;SMP.amb=null;try{const t=AU.ctx.currentTime;m.g.gain.cancelScheduledValues(t);m.g.gain.setValueAtTime(Math.max(.0001,m.g.gain.value),t);m.g.gain.linearRampToValueAtTime(.0001,t+1.2);m.s.stop(t+1.3)}catch(e){}}
function ambSync(){audioWatch();const on=cur==='sBattle'&&B&&!B.over&&!paused&&AU.opt.sfx>0;if(on&&!SMP.amb)ambStart();else if(!on&&SMP.amb)ambStop()}
const SFX={
 sword(x){nz(.09,.5,'bandpass',3500,1800,{x,q:2});tone(2100+Math.random()*500,.18,'sine',.12,{x});tone(3100,.12,'sine',.07,{x})},
 spear(x){nz(.14,.3,'highpass',1500,5000,{x});nz(.07,.4,'lowpass',700,200,{x,at:.09})},
 axe(x){nz(.1,.4,'highpass',2000,600,{x});tone(130,.16,'sine',.5,{x,to:55,at:AU.ctx.currentTime+.07});nz(.1,.35,'lowpass',900,200,{x,at:AU.ctx.currentTime+.07});tone(1700,.1,'sine',.07,{x,at:AU.ctx.currentTime+.07})},
 hammer(x){tone(100,.22,'sine',.7,{x,to:40});nz(.12,.5,'lowpass',700,150,{x});tone(900,.25,'triangle',.1,{x})},
 club(x){tone(120,.16,'sine',.55,{x,to:50});nz(.1,.4,'lowpass',800,200,{x})},
 claw(x){nz(.16,.35,'bandpass',4500,1500,{x,q:3});nz(.12,.25,'bandpass',3500,1200,{x,q:3,at:AU.ctx.currentTime+.05})},
 big(x){tone(70,.35,'sine',.9,{x,to:35});nz(.25,.6,'lowpass',500,100,{x});tone(150,.2,'sawtooth',.1,{x,to:60,lp:400})},
 smith(x){const t0=AU.ctx.currentTime;[0,.17,.36].forEach((d,i)=>{const at=t0+d,f=1180-i*70;tone(f,.55,'sine',.3,{x,at});tone(f*2.76,.32,'sine',.12,{x,at});tone(f*5.4,.17,'sine',.06,{x,at});nz(.05,.45,'highpass',2500,6000,{x,at});tone(110,.22,'sine',.45,{x,at,to:55})})},
 splat(x){nz(.14,.3,'lowpass',900,180,{x});tone(130,.11,'sine',.26,{x,to:55})},
 xbow(x){nz(.02,.7,'highpass',2500,4000,{x});tone(210,.14,'sine',.6,{x,to:70});tone(300,.1,'triangle',.3,{x,to:120,at:AU.ctx.currentTime+.012});nz(.2,.15,'bandpass',2500,1200,{x,at:AU.ctx.currentTime+.03,q:.7})},
 bow(x){tone(260,.09,'triangle',.45,{x,to:110});nz(.05,.35,'highpass',3000,5000,{x});nz(.28,.18,'bandpass',3500,1500,{x,at:AU.ctx.currentTime+.04,q:.7})},
 mage(x){tone(420,.5,'sine',.22,{x,to:1100,att:.2});tone(1300,.5,'triangle',.08,{x,to:2400,att:.2});nz(.45,.12,'highpass',3000,7000,{x,att:.2})},
 horse(x){for(let i=0;i<4;i++){const t=AU.ctx.currentTime+i*.09;nz(.06,.4,'lowpass',500,200,{x,at:t});tone(190,.05,'sine',.25,{x,at:t})}},
 hit(x){nz(.07,.35,'lowpass',1200,300,{x});tone(180,.07,'sine',.3,{x,to:90})},
 die(fk,x,big){const f={orcs:100,dwarves:130,humans:170,elves:260,undead:90}[fk]||150*(big?.6:1);if(fk==='undead'){for(let i=0;i<5;i++)nz(.05,.35,'bandpass',2500+Math.random()*2000,1500,{x,at:AU.ctx.currentTime+i*.035,q:4});tone(f,.35,'sawtooth',.1,{x,to:f*.5,lp:500})}
  else tone(f*(big?.6:1),.34,'sawtooth',.2,{x,to:f*(big?.6:1)*.45,lp:650,att:.03});nz(.12,.18,'lowpass',500,150,{x})},
 reach(side){const t=AU.ctx.currentTime;tone(196,1.6,'sine',.175,{to:190});tone(392,1.2,'sine',.09);tone(588,.9,'sine',.05);tone(side==='L'?523:330,.35,'triangle',.09,{at:t+.02})} /* v0.22: -6 dB */,
 spawn(){tone(110,.12,'sine',.35,{to:70});nz(.04,.15,'highpass',3000,5000)},
 click(){tone(700,.05,'square',.06)},
 horn(){const t=AU.ctx.currentTime;[[196,0],[294,.45],[392,.9]].forEach(([f,d],i)=>{for(const m of[1,2.01]){tone(f*m,i==2?1.3:.55,'sawtooth',.11/m,{at:t+d,lp:1100,att:.06})}});tone(65,2,'sine',.4,{to:60})},
 win(){const t=AU.ctx.currentTime;[[294,0,.3],[370,.28,.3],[440,.56,.3],[587,.84,1.4]].forEach(([f,d,l])=>{tone(f,l,'sawtooth',.13,{at:t+d,lp:1800,att:.03});tone(f/2,l,'triangle',.12,{at:t+d})});tone(70,1.5,'sine',.5,{at:t+.84})},
 lose(){const t=AU.ctx.currentTime;[[294,0],[262,.5],[233,1],[196,1.5]].forEach(([f,d])=>{tone(f,1.1,'sawtooth',.1,{at:t+d,lp:700,att:.1})});tone(55,2.5,'sine',.5,{at:t+1.5})}
};
function playEv(e){
 if(!AU.ctx||AU.opt.sfx<=0)return;
 try{
 if(e.e==='swing'){const k=e.k;if(!gate('sw'+k,e.big?90:70))return;const kk=SFX[k]?k:'sword';
  if(!swingSmp(kk,e.x)){SFX[kk](e.x);setTimeout(()=>{if(gate('h',45))SFX.hit(e.x)},110)}
  swingVoices(e)}
 else if(e.e==='shot'){if(!gate('sh'+e.k,80))return;
  if(e.k==='mage')SFX.mage(e.x);
  else{const xb=XBOW_N[e.n],cat=xb?'crossbow':THROW_N[e.n]?'spear_swipe':'bow';if(!smp(cat,e.x,{g:.9}))(xb?SFX.xbow:SFX.bow)(e.x);
   if(!e.miss)setTimeout(()=>{if(gate('ah',50)){const hx=e.x+100*(e.side==='L'?1:-1);if(!smp('arrow_hit',hx,{g:.8}))SFX.hit(hx)}},320)}}
 else if(e.e==='die'){if(gate('die',60)){
  if(e.fk==='undead'&&!e.big&&smpHas('skeleton_die')&&Math.random()<.5&&gate('sdie',700))smp('skeleton_die',e.x,{g:.85});
  else SFX.die(e.fk,e.x,e.big);
  if(e.fk==='orcs')vox('orc_grunt',e.x,.1,800,.7)}}
 else if(e.e==='reach'){SFX.reach(e.side)}
 else if(e.e==='spawn'){if(e.side==='L'){SFX.spawn();if(e.k==='cav')SFX.horse(40);if(e.fk==='undead'&&e.k==='sword'&&Math.random()<.6)smp('skeleton_rattle',40,{g:.7})}}
 else if(e.e==='charge'){hornFor(e.fk,false)}
 }catch(err){}
}
/* ---- Musik: pro Fraktion eigene Themen (Kampagne + Schlacht), Hauptmenue eigenes Stueck ---- */
const mf=m=>440*Math.pow(2,(m-69)/12);
const SC={dorian:[0,2,3,5,7,9,10],minor:[0,2,3,5,7,8,10],phryg:[0,1,3,5,7,8,10],major:[0,2,4,5,7,9,11],mixo:[0,2,4,5,7,9,10],locr:[0,1,3,5,6,8,10],dim:[0,2,3,5,6,8,9,11]};
const RHY={slow:[[2,1,1,2,2],[3,1,2,2],[1.5,.5,1,1,2,2],[4,2,2]],mid:[[1,1,1,1,2,2],[1.5,.5,1,1,1,1,2],[2,1,1,1,1,2],[1,.5,.5,1,1,1,1,1,1]],fast:[[.5,.5,1,.5,.5,1,1,1,2],[.5,.5,.5,.5,1,1,.5,.5,1,2],[1,.5,.5,1,.5,.5,1,1,2]]};
function degMidi(sc,tonic,d){const S=SC[sc],n=S.length;return tonic+12*Math.floor(d/n)+S[((d%n)+n)%n]}
function mkTrack(o){
 const S=SC[o.sc],n=S.length,r=mulberry(o.seed),chords=[],roots=[],mel=[];
 for(const d of o.prog){const base=d;chords.push([degMidi(o.sc,o.tonic,base),degMidi(o.sc,o.tonic,base+2),degMidi(o.sc,o.tonic,base+4),degMidi(o.sc,o.tonic,base+n)].map(x=>x));roots.push(degMidi(o.sc,o.tonic,base)-12)}
 const R=RHY[o.rhy],pat=[R[Math.floor(r()*R.length)],R[Math.floor(r()*R.length)]];
 const steps=[-2,-1,-1,0,1,1,2,-3,3];
 o.prog.forEach((d,ci)=>{const p=pat[ci%2];let deg=d+n+(r()<.5?0:2),t=0;const notes=[];
  p.forEach((dur,k)=>{if(k===p.length-1)deg=d+n+(r()<.5?0:4);else if(k>0)deg+=steps[Math.floor(r()*steps.length)];deg=Math.max(d+n-3,Math.min(d+n+6,deg));notes.push([t,degMidi(o.sc,o.tonic+(o.mo||0),deg),dur]);t+=dur});mel.push(notes)});
 return Object.assign({bars:2,pad:'strings',lead:'brass',ost:'none',drums:'none',padV:.05,melV:.1},o,{chords,roots,mel})}
const TR={menu:{bpm:92,bars:2,drums:'none',ost:'none',lead:'saw',pad:'strings',padV:.06,melV:.09,
  chords:[[50,57,62,65],[46,53,58,62],[53,57,60,65],[48,55,60,64]],roots:[38,34,41,36],
  mel:[[[0,69,1.5],[1.5,67,.5],[2,65,1],[3,62,1],[4,64,1],[5,65,1],[6,67,2]],[[0,70,1.5],[1.5,69,.5],[2,67,1],[3,65,1],[4,67,1],[5,69,1],[6,65,2]],[[0,72,1.5],[1.5,70,.5],[2,69,1],[3,65,1],[4,69,1],[5,72,1],[6,74,2]],[[0,72,1],[1,71,1],[2,67,1],[3,64,1],[4,69,1.5],[5.5,67,.5],[6,64,1],[7,62,1]]]}};
const TRF={
 humans:{camp:mkTrack({bpm:92,sc:'dorian',tonic:62,prog:[0,3,0,6],seed:11,rhy:'slow',lead:'flute',ost:'harp',drums:'hand',pad:'strings',padV:.035,melV:.09}),
  battle:[mkTrack({bpm:118,sc:'dorian',tonic:62,prog:[0,5,6,0],seed:21,rhy:'mid',lead:'brass',ost:'pulse8',drums:'march',stab:[0],pad:false}),
          mkTrack({bpm:132,sc:'mixo',tonic:67,prog:[0,3,4,0],seed:22,rhy:'fast',lead:'fife',ost:'gallop',drums:'march',stab:[0,4],pad:false})]},
 elves:{camp:mkTrack({bpm:76,sc:'minor',tonic:64,prog:[0,5,2,6],seed:31,rhy:'slow',lead:'flute',ost:'harp',drums:'none',pad:'air',bell:true,padV:.05,melV:.085}),
  battle:[mkTrack({bpm:120,sc:'dorian',tonic:69,prog:[0,3,6,0],seed:41,rhy:'mid',lead:'flute',ost:'harp16',drums:'hand',pad:false}),
          mkTrack({bpm:134,sc:'minor',tonic:62,prog:[0,6,5,6],seed:42,rhy:'fast',lead:'pluck',ost:'harp16',drums:'tribal',pad:false,stab:[0]})]},
 orcs:{camp:mkTrack({bpm:64,sc:'phryg',tonic:48,prog:[0,1,0,6],seed:51,rhy:'slow',lead:'horn',ost:'none',drums:'heart',pad:'drone',padV:.09,melV:.12}),
  battle:[mkTrack({bpm:128,sc:'phryg',tonic:52,prog:[0,1,0,6],seed:61,rhy:'fast',lead:'horn',ost:'gallop',drums:'tribal',stab:[0,3],pad:false}),
          mkTrack({bpm:116,sc:'minor',tonic:45,prog:[0,5,6,0],seed:62,rhy:'mid',lead:'horn',ost:'pulse8',drums:'tribal',stab:[0,4],pad:false})]},
 dwarves:{camp:mkTrack({bpm:84,sc:'major',tonic:53,prog:[0,3,4,0],seed:71,rhy:'slow',lead:'choir',ost:'none',drums:'anvil',pad:'choir',padV:.05,melV:.08}),
  battle:[mkTrack({bpm:108,sc:'minor',tonic:50,prog:[0,5,3,4],seed:81,rhy:'mid',lead:'brass',ost:'pulse8',drums:'stomp',stab:[0],pad:false}),
          mkTrack({bpm:122,sc:'dorian',tonic:55,prog:[0,3,0,6],seed:82,rhy:'mid',lead:'brass',ost:'gallop',drums:'stomp',stab:[0,4],pad:false})]},
 undead:{camp:mkTrack({bpm:60,sc:'dim',tonic:54,prog:[0,3,0,5],seed:91,rhy:'slow',lead:'organ',ost:'bell',drums:'heart',pad:'organ',padV:.05,melV:.07}),
  battle:[mkTrack({bpm:138,sc:'phryg',tonic:49,prog:[0,1,0,6],seed:101,rhy:'fast',lead:'organ',ost:'trem16',drums:'war',stab:[0,3],pad:false}),
          mkTrack({bpm:126,sc:'locr',tonic:47,prog:[0,1,4,0],seed:102,rhy:'mid',lead:'choir',ost:'gallop',drums:'tribal',stab:[0,4,6],pad:false})]}};
AU.trk=TR.menu;AU.cycles=0;AU.bi=0;AU.fk=null;
function vib(o,x,rate,cents,t0,t1){const l=x.createOscillator(),g=x.createGain();l.frequency.value=rate;g.gain.value=cents;l.connect(g);g.connect(o.detune);l.start(t0==null?x.currentTime:t0);l.stop(t1==null?x.currentTime+20:t1)}
function voice(m,t,d,vol,type,wet){const x=AU.ctx,f0=mf(m),LT=AU.lite;
 if(LT){const nw=x.currentTime;AU.live=(AU.live||[]).filter(e=>e>nw);if(AU.live.length>=26&&(type==='pluck'||type==='bell'||type==='fife'))return;AU.live.push(t+d+.5)} // Budget: Zierstimmen entfallen, wenn schon viele Noten klingen
 const out2=(g)=>{g.connect(AU.mus);if(wet)g.connect(AU.rev)};
 const env=(g,att,hold,rel)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+att);g.gain.setValueAtTime(vol,t+Math.max(att,hold));g.gain.exponentialRampToValueAtTime(.0001,t+hold+rel)};
 const osc=(ty,f,det)=>{const o=x.createOscillator();o.type=ty;o.frequency.value=f;if(det)o.detune.value=det;return o};
 const stop=(arr,end)=>arr.forEach(o=>{o.start(t);o.stop(end)});
 if(type==='flute'){const g=x.createGain(),a=osc('sine',f0),b=osc('triangle',f0*2);const gb=x.createGain();gb.gain.value=.25;a.connect(g);b.connect(gb);gb.connect(g);env(g,.07,Math.max(.1,d-.1),.25);vib(a,x,5.2,7,t,t+d+.6);out2(g);stop([a,b],t+d+.4)}
 else if(type==='fife'){const g=x.createGain(),f=x.createBiquadFilter();f.type='lowpass';f.frequency.value=3800;const a=osc('square',f0*2);a.connect(f);f.connect(g);env(g,.01,Math.max(.05,d*.8),.1);out2(g);stop([a],t+d+.2)}
 else if(type==='pluck'){const g=x.createGain(),a=osc('triangle',f0),b=osc('sine',f0*2);const gb=x.createGain();gb.gain.value=.4;a.connect(g);b.connect(gb);gb.connect(g);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+Math.min(1.1,Math.max(.35,d*1.3)));out2(g);stop([a,b],t+1.3)}
 else if(type==='organ'){const g=x.createGain(),f=x.createBiquadFilter();f.type='lowpass';f.frequency.value=1700;const a=osc('square',f0,-4),b=osc('square',f0,4),c=osc('sawtooth',f0*1.5);const gc=x.createGain();gc.gain.value=.3;a.connect(f);b.connect(f);c.connect(gc);gc.connect(f);f.connect(g);env(g,.04,Math.max(.08,d-.05),.2);vib(a,x,4.5,5,t,t+d+.6);out2(g);stop([a,b,c],t+d+.3)}
 else if(type==='choir'){const g=x.createGain(),f=x.createBiquadFilter();f.type='lowpass';f.frequency.value=950;f.Q.value=2;const os=[...(LT?[osc('sawtooth',f0,-7),osc('sawtooth',f0,7)]:[osc('sawtooth',f0,-9),osc('sawtooth',f0,0),osc('sawtooth',f0,9)])];os.forEach(o=>o.connect(f));f.connect(g);env(g,Math.min(.35,d*.4),Math.max(.1,d-.1),.35);vib(os[1],x,5,10,t,t+d+.7);out2(g);stop(os,t+d+.5)}
 else if(type==='horn'){const g=x.createGain(),f=x.createBiquadFilter();f.type='lowpass';f.frequency.value=760;const os=[...(LT?[osc('sawtooth',f0,0)]:[osc('sawtooth',f0,-5),osc('sawtooth',f0,5)])];os.forEach(o=>o.connect(f));f.connect(g);env(g,.08,Math.max(.1,d-.1),.25);out2(g);stop(os,t+d+.4)}
 else if(type==='bell'){for(const [k,v] of [[1,1],[2.76,.5],[5.4,.25]]){const g=x.createGain(),a=osc('sine',f0*k);a.connect(g);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol*v,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+2.2/k);out2(g);a.start(t);a.stop(t+2.4)}}
 else if(type==='air'){const g=x.createGain(),a=osc('sine',f0),b=osc('triangle',f0,6);const gb=x.createGain();gb.gain.value=.3;a.connect(g);b.connect(gb);gb.connect(g);env(g,Math.min(1.2,d*.5),Math.max(.2,d-.2),.8);out2(g);stop([a,b],t+d+1)}
 else if(type==='drone'){const g=x.createGain(),f=x.createBiquadFilter();f.type='lowpass';f.frequency.value=220;const os=[...(LT?[osc('sawtooth',f0,-8),osc('sawtooth',f0/2,6)]:[osc('sawtooth',f0,-8),osc('sawtooth',f0/2,6),osc('square',f0,0)])];os.forEach(o=>o.connect(f));f.connect(g);env(g,.8,Math.max(.2,d-.3),.6);out2(g);stop(os,t+d+.8)}
 else{const lp=type==='brass'?1700:type==='saw'?1200:type==='strings'?650:900,g=x.createGain(),f=x.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;const os=[...(LT?[osc('sawtooth',f0,0)]:[osc('sawtooth',f0,-6),osc('sawtooth',f0,6)])];os.forEach(o=>o.connect(f));f.connect(g);env(g,type==='strings'?.9:.04,Math.max(.1,d-.15),.25);out2(g);stop(os,t+d+.3)}}
function drum(t,kind,vol){const x=AU.ctx;
 if(kind==='tim'){const o=x.createOscillator(),g=x.createGain();o.frequency.setValueAtTime(95,t);o.frequency.exponentialRampToValueAtTime(42,t+.35);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+.6);o.connect(g);g.connect(AU.mus);g.connect(AU.rev);o.start(t);o.stop(t+.7);nz(.1,vol*.5,'lowpass',500,120,{at:t,dest:AU.mus})}
 else if(kind==='taiko'){const o=x.createOscillator(),g=x.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(55,t+.2);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(AU.mus);g.connect(AU.rev);o.start(t);o.stop(t+.4);nz(.06,vol*.6,'bandpass',900,300,{at:t,dest:AU.mus})}
 else if(kind==='tomL'||kind==='tomM'||kind==='tomH'){const f=kind==='tomL'?70:kind==='tomM'?105:150,o=x.createOscillator(),g=x.createGain();o.frequency.setValueAtTime(f*1.6,t);o.frequency.exponentialRampToValueAtTime(f,t+.12);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+.45);o.connect(g);g.connect(AU.mus);g.connect(AU.rev);o.start(t);o.stop(t+.5);nz(.05,vol*.4,'bandpass',500,250,{at:t,dest:AU.mus})}
 else if(kind==='hand'){nz(.14,vol,'bandpass',260,180,{at:t,dest:AU.mus,q:1.5});const o=x.createOscillator(),g=x.createGain();o.frequency.setValueAtTime(190,t);o.frequency.exponentialRampToValueAtTime(110,t+.1);g.gain.setValueAtTime(vol*.6,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g);g.connect(AU.mus);o.start(t);o.stop(t+.25)}
 else if(kind==='heart'){for(const [dt,v] of [[0,1],[.2,.6]]){const o=x.createOscillator(),g=x.createGain();o.frequency.setValueAtTime(70,t+dt);o.frequency.exponentialRampToValueAtTime(38,t+dt+.25);g.gain.setValueAtTime(vol*v,t+dt);g.gain.exponentialRampToValueAtTime(.001,t+dt+.4);o.connect(g);g.connect(AU.mus);g.connect(AU.rev);o.start(t+dt);o.stop(t+dt+.5)}}
 else if(kind==='anvil'){for(const f of[880,1320,2210,3100]){const o=x.createOscillator(),g=x.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(vol*.35,t);g.gain.exponentialRampToValueAtTime(.0001,t+(f>2000?.25:.7));o.connect(g);g.connect(AU.mus);g.connect(AU.rev);o.start(t);o.stop(t+.8)}nz(.04,vol*.5,'highpass',3000,6000,{at:t,dest:AU.mus})}
 else if(kind==='cym'){nz(1.4,vol,'highpass',3500,9000,{at:t,dest:AU.mus,att:.25})}
 else{nz(.12,vol*.4,'bandpass',1800,900,{at:t,dest:AU.mus,q:.8});nz(.04,vol*.3,'highpass',4000,6000,{at:t,dest:AU.mus})}}
function nextBattleTrack(){const L=TRF[AU.fk]?TRF[AU.fk].battle:[TRF.humans.battle[0]];AU.bi=(AU.bi+1)%L.length;AU.trk=L[AU.bi];AU.cycles=0;AU.step=0}
function musicTick(){
 if(!AU.ctx||AU.musicMode==='off'||AU.musicMode==='file'||AU.opt.music<=0)return;const x=AU.ctx;
 if(AU.next<x.currentTime)AU.next=x.currentTime+.03;
 const battle=AU.musicMode==='battle',T=AU.trk,SB=T.bars*8,S=T.chords.length*SB,spb=60/T.bpm;
 while(AU.next<x.currentTime+(AU.lite?1.2:.5)){
  const s=AU.step%S,ci=Math.floor(s/SB),si=s%SB,t=AU.next,s8=si%8,ch=T.chords[ci],root=T.roots[ci];
  if(si===0){
   if(T.pad)ch.forEach(m=>voice(m,t,spb*T.bars*4,T.padV,T.pad,true));
   voice(root,t,spb*T.bars*4,battle?.2:.14,battle?'saw':(T.pad==='drone'?'drone':'strings'),false);
   T.mel[ci].forEach(([b,m,d])=>voice(m,t+b*spb,d*spb*.95,T.melV,T.lead,true))}
  const o=T.ost;
  if(o==='harp')voice(ch[si%ch.length]+12,t,spb*.5,.05,'pluck',true);
  else if(o==='harp16'){voice(ch[si%ch.length]+12,t,spb*.3,.045,'pluck',true);voice(ch[(si+2)%ch.length]+24,t+spb*.25,spb*.3,.035,'pluck',true)}
  else if(o==='gallop'){const r=root+12,v=s8%4===0?.085:.055;voice(r,t,spb*.2,v,'brass',false);voice(r+(s8%8===6?7:0),t+spb*.25,spb*.2,.05,'brass',false)}
  else if(o==='pulse8')voice(root+(s8===4?7:0)+12,t,spb*.42,.05,'brass',false);
  else if(o==='trem16'){voice(ch[2],t,spb*.2,.04,'brass',true);voice(ch[3],t+spb*.25,spb*.2,.035,'brass',true)}
  else if(o==='bell'){if(si%16===0)voice(root+36,t,2,.06,'bell',true);if(si%16===9)voice(ch[2]+12,t,2,.04,'bell',true)}
  if(T.bell&&si%16===8)voice(ch[1]+24,t,2,.045,'bell',true);
  if(battle&&T.stab&&T.stab.includes(s8))ch.forEach(m=>voice(m+12,t,spb*.28,.07,'brass',true));
  const dr=T.drums;
  if(dr==='hand'){if(s8===0)drum(t,'hand',.3);if(s8===3||s8===6)drum(t,'hand',.2);if(s8===4)drum(t,'hand',.25)}
  else if(dr==='heart'){if(si%8===0)drum(t,'heart',.5)}
  else if(dr==='anvil'){if(s8===0)drum(t,'anvil',.5);if(s8===4)drum(t,'anvil',.3);if(si%16===0)drum(t,'tomL',.35)}
  else if(dr==='march'){if(s8===0)drum(t,'tim',.55);if(s8===4)drum(t,'tim',.4);if(s8===2||s8===6)drum(t,'sn',.3);if(s8===7)drum(t,'sn',.15);if(si===0&&ci===0)drum(t,'cym',.12)}
  else if(dr==='stomp'){if(s8%2===0)drum(t,'tomL',.7);if(s8===2||s8===6)drum(t,'anvil',.35);if(s8===4)drum(t,'sn',.3)}
  else if(dr==='tribal'){if(s8===0)drum(t,'tomL',.85);if(s8===1)drum(t,'tomM',.35);if(s8===3)drum(t,'tomH',.4);if(s8===4)drum(t,'tomL',.7);if(s8===5)drum(t,'tomM',.3);if(s8===6)drum(t,'tomM',.5);if(s8===7)drum(t,'tomH',.3)}
  else if(dr==='war'){if(s8===0){drum(t,'taiko',.95);drum(t,'tim',.6)}if(s8===2)drum(t,'taiko',.45);if(s8===4){drum(t,'taiko',.85);drum(t,'sn',.4)}if(s8===6)drum(t,'taiko',.5);if(s8===7)drum(t,'sn',.28);if(si===0&&ci%2===0)drum(t,'cym',.16)}
  if(battle&&AU.intense&&s8%2===1&&dr!=='none'&&dr!=='heart')drum(t,dr==='hand'?'hand':'sn',.12);
  AU.step++;
  if(AU.step%S===0&&battle){AU.cycles++;if(AU.cycles>=3){nextBattleTrack();drum(AU.next+spb/2,'cym',.2)}}
  AU.next+=spb/2}
}

/* ===== v0.22: Viking-Schlachtlied aus Stufen-Loops (Aufmarsch / Kampf / Durchbruch / Entscheidung) mit Tempostufen =====
   Je Stufe drei vorgerenderte Loops (100 %, 110 %, 120 %, Tonhoehe bleibt). Wechsel immer zum naechsten Taktanfang per Ueberblendung. */
var VK={on:false,d:null,b:{},p:{},n:{},all:[],out:null,cur:null,tm:null,gen:0,busy:0,s:'a',lv:0,tempo:100,brk:-99,contact:false,bars:{a:8,k:16,d:8,e:16}};
const VK_UP=new Float32Array(48).map((_,i)=>Math.sin(i/47*Math.PI/2)),VK_DN=new Float32Array(48).map((_,i)=>Math.cos(i/47*Math.PI/2));
function vkData(){if(!VK.d){try{VK.d=window.KH_VK}catch(e){VK.d={}}}return VK.d}
function vkBuf(s,r){
 const k=s+r;if(VK.p[k])return VK.p[k];
 const D=vkData(),e=D[s]&&D[s][r];if(!e||!AU.ctx)return Promise.reject(new Error('vk'));
 const bin=atob(e.b),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
 return VK.p[k]=new Promise((res,rej)=>{const q=AU.ctx.decodeAudioData(u.buffer,res,rej);if(q&&q.then)q.then(res,rej)}).then(buf=>{VK.b[k]=buf;VK.n[k]=e.n;return buf}).catch(err=>{delete VK.p[k];throw err})}
function vkMk(s,r,when,offBars,out){
 const k=s+r,buf=VK.b[k],D=VK.n[k]/44100,bd=D/VK.bars[s],x=AU.ctx,src=x.createBufferSource(),g=x.createGain();
 src.buffer=buf;src.loop=true;src.loopStart=0;src.loopEnd=Math.min(buf.duration,D);
 src.connect(g);g.connect(out);
 const off=(offBars%VK.bars[s])*bd;src.start(when,off);
 const p={src,g,s,r,bd,t0:when-off};VK.all.push(p);
 src.onended=()=>{try{g.disconnect()}catch(e){}const i=VK.all.indexOf(p);if(i>=0)VK.all.splice(i,1)};
 return p}
function vkLevel(){
 if(!VK.out||!AU.ctx)return;
 const v=(AU.opt.music>0&&!FM.hidden&&!FM.hold)?Math.min(1,AU.opt.music*FM.cfg.gain)*fmDk()*BATTLE_GAIN:0;
 if(Math.abs(VK.out.gain.value-v)>.002||v===0)VK.out.gain.setTargetAtTime(v,AU.ctx.currentTime,.03)}
function vkStart(){
 const x=AU.ctx;VK.on=true;const gen=++VK.gen;
 VK.s='a';VK.lv=0;VK.tempo=100;VK.brk=-99;VK.contact=false;VK.cur=null;VK.busy=1e9;
 VK.out=x.createGain();VK.out.gain.value=0;VK.out.connect(x.destination);const out=VK.out;vkLevel();
 vkBuf('a',100).then(()=>{
  if(gen!==VK.gen||!VK.on)return;
  const t=x.currentTime+.25,p=vkMk('a',100,t,0,out);
  p.g.gain.setValueAtTime(0,t);p.g.gain.linearRampToValueAtTime(1,t+.3);
  VK.cur=p;VK.busy=t+.35;vkLevel();
  if(!VK.tm)VK.tm=setInterval(vkTick,AU.lite?200:100);
  ['k','d','e'].forEach((s,i)=>setTimeout(()=>{if(gen===VK.gen)vkBuf(s,100).catch(()=>{})},700*(i+1)));
 }).catch(()=>{if(gen!==VK.gen)return;vkStop(true);if(FM.list&&FM.list[FM.idx]==='battle_viking')fmPlay(FM.idx,0,FM.cfg.inn,FM.cfg.out)}) // Fallback: ganzes Stueck als Datei
}
function vkStop(fast){
 if(!VK.on&&!VK.out)return;
 VK.on=false;VK.gen++;VK.cur=null;if(VK.tm){clearInterval(VK.tm);VK.tm=null}
 const x=AU.ctx,o=VK.out;VK.out=null;
 if(x&&o){const t=x.currentTime;try{o.gain.cancelScheduledValues(t);o.gain.setValueAtTime(o.gain.value,t);o.gain.linearRampToValueAtTime(0,t+(fast?.15:.2))}catch(e){}
  VK.all.slice().forEach(p=>{try{p.src.stop(t+.35)}catch(e){}});
  setTimeout(()=>{try{o.disconnect()}catch(e){}},600)}
 VK.b={};VK.p={};VK.n={}} // Speicher freigeben
function vkTick(){
 if(!VK.on||!AU.ctx||!VK.cur)return;
 const x=AU.ctx,now=x.currentTime,c=VK.cur;if(now<VK.busy)return;
 const ws=VK.s,wr=VK.tempo;if(c.s===ws&&c.r===wr)return;
 if(!VK.b[ws+wr]){vkBuf(ws,wr).catch(()=>{});return} // erst dekodieren, dann beim naechsten Takt wechseln
 const n=Math.ceil((now+(AU.lite?.35:.15)-c.t0)/c.bd-1e-6),tb=c.t0+n*c.bd,same=c.s===ws;
 const fade=same?.45:(c.r===wr?c.bd:.8),offBars=same?(n%VK.bars[ws]):0;
 const p=vkMk(ws,wr,tb,offBars,VK.out);
 p.g.gain.setValueAtTime(0,tb);p.g.gain.setValueCurveAtTime(VK_UP,tb,fade);
 c.g.gain.setValueCurveAtTime(VK_DN,tb,fade);
 try{c.src.stop(tb+fade+.05)}catch(e){}
 VK.cur=p;VK.busy=tb+fade+.02}
function vkLv(m,l){if(m<=11.1)return 2;if(l===2&&m<=16)return 2;if(m<=33.3)return 1;if(l>=1&&m<=38)return 1;return 0}
function vkDecide(b){
 const m=Math.min(b.bar,100-b.bar),rem=b.time-b.t,lb=vkLv(m,VK.lv);VK.lv=lb;
 const lv=Math.max(lb,rem<=30&&rem>0?1:0);
 VK.tempo=lv===2?120:lv===1?110:100;
 VK.s=(lb>=1||(rem<=30&&rem>0))?'e':(b.t<VK.brk?'d':VK.contact?'k':'a')}
function vkEv(e){
 if(!VK.on||!B)return;
 if(e.e==='swing'||e.e==='shot')VK.contact=true;
 else if(e.e==='reach'){VK.contact=true;VK.brk=B.t+16}}
const BATTLE_GAIN=.708; // Schlachtmusik -3 dB (Synth und Dateien)
function musicStart(mode,fk){auInit();if(!AU.ctx)return;
 const key=mode+(fk||'');
 if(AU.key!==key){newMusBus();AU.key=key;AU.musicMode=mode==='battle'?'battle':'menu';AU.fk=fk||null;AU.step=0;AU.next=0;AU.cycles=0;
  if(mode==='menu'||!fk||!TRF[fk])AU.trk=TR.menu;else if(mode==='camp')AU.trk=TRF[fk].camp;else{AU.bi=Math.floor(Math.random()*TRF[fk].battle.length);AU.trk=TRF[fk].battle[AU.bi]}
  if(mode==='battle'){const t=AU.ctx.currentTime,gn=AU.bus.g.gain;gn.cancelScheduledValues(t);gn.setValueAtTime(gn.value,t);gn.linearRampToValueAtTime(BATTLE_GAIN,t+.08)}
  fmSwitch(mode,fk)}
 if(!AU.timer)AU.timer=setInterval(musicTick,AU.lite?200:120);musicTick()}
function musicStop(){AU.musicMode='off';AU.key=null;if(typeof fmStop==='function')fmStop();
 if(AU.ctx&&AU.bus){try{const t=AU.ctx.currentTime,gn=AU.bus.g.gain;gn.cancelScheduledValues(t);gn.setValueAtTime(gn.value,t);gn.linearRampToValueAtTime(0,t+.15)}catch(e){}}} // vorausgeplante Noten klingen nicht nach
/* ===== Fanfaren-Faerbung (v0.17). Eigener Namensraum NM, weil voice/drum/nz im Spiel belegt sind. ===== */
const NM=(function(){
/* ===== Warlords Musik-Demo: Engine (WebAudio, ohne Dateien ausser den Fanfaren) =====
   Gleiche Bauweise wie im Spiel (voice/drum/nz aus v0.12), aber:
   - arbeitet mit beliebigem ctx (live oder OfflineAudioContext zum Testen)
   - Lieder sind handgeschriebene Noten (Melodie-Strings) + Begleit-Generatoren
   - Taktweise Planung: schedBar(E, trk, bar, t)  -> spaeter 1:1 in musicTick() einbaubar */

const mf=m=>440*Math.pow(2,(m-69)/12);
const PC={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function nm(s){const m=/^([A-G])([#b]?)(-?\d)$/.exec(s);if(!m)throw new Error('Note? '+s);return 12*(+m[3]+1)+PC[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0)}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* ---- Noten: Takte mit | getrennt, Token NOTE:Dauer (Beats), - = Pause, A4+C5 = Akkord ---- */
function parseMel(str,bpb,label){
 return str.split('|').map((b,i)=>{let t=0;const out=[];
  b.trim().split(/\s+/).forEach(tok=>{const [n,d]=tok.split(':'),dur=d?parseFloat(d):1;
   if(n!=='-'&&n!=='r')out.push([t,n.split('+').map(nm),dur]);t+=dur});
  if(Math.abs(t-bpb)>1e-6)console.warn('TAKTLAENGE',label,'Takt',i,'=',t,'statt',bpb);
  return out})}
function chord(name,oct){
 const m=/^([A-G][#b]?)(m7|maj7|dim|sus2|sus4|m|5|7)?$/.exec(name);if(!m)throw new Error('Akkord? '+name);
 const r=nm(m[1]+oct),iv={'':[0,4,7],m:[0,3,7],dim:[0,3,6],'5':[0,7,12],sus2:[0,2,7],sus4:[0,5,7],'7':[0,4,7,10],m7:[0,3,7,10],maj7:[0,4,7,11]}[m[2]||''];
 return{root:r,notes:iv.map(i=>r+i)}}
const CH=s=>s.trim().split(/\s+/);

/* ---- Engine ---- */
function mkFanEngine(ctx,o){
 o=o||{};const E={x:ctx,bus:{}};
 E.master=ctx.createGain();E.master.gain.value=.9;
 const comp=ctx.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=4;comp.attack.value=.012;comp.release.value=.3;
 E.mus=ctx.createGain();E.mus.gain.value=.55*(o.gain||1);if(o.dest)E.mus.connect(o.dest);else{E.master.connect(comp);comp.connect(ctx.destination);E.mus.connect(E.master)}
 const sr=ctx.sampleRate,r=mulberry(7);
 const nl=sr*3,nb=ctx.createBuffer(1,nl,sr),nd=nb.getChannelData(0);for(let i=0;i<nl;i++)nd[i]=r()*2-1;E.noise=nb;
 const L=Math.floor(sr*(o.rvLen||2.4)),ib=ctx.createBuffer(2,L,sr),dark=o.rvDark||.35;
 for(let c=0;c<2;c++){const d=ib.getChannelData(c);let lp=0;for(let i=0;i<L;i++){lp+=((r()*2-1)-lp)*dark;d[i]=lp*Math.pow(1-i/L,o.rvPow||2.4)*2.2}}
 const cv=ctx.createConvolver();cv.buffer=ib;E.rvIn=ctx.createGain();E.rvIn.connect(cv);
 const wg=ctx.createGain();wg.gain.value=o.rvWet==null?.5:o.rvWet;cv.connect(wg);wg.connect(E.mus);
 E.cur=E.mus;return E}
function layerBus(E,key,pan){
 if(E.bus[key])return E.bus[key];const x=E.x,g=x.createGain();let n=g;
 if(pan&&x.createStereoPanner){const p=x.createStereoPanner();p.pan.value=pan;g.connect(p);n=p}
 n.connect(E.mus);return E.bus[key]=g}

function nz(E,t,dur,vol,type,f0,f1,o){o=o||{};const x=E.x,s=x.createBufferSource();s.buffer=E.noise;s.loop=true;
 const fl=x.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.setValueAtTime(f0,t);if(f1)fl.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur);fl.Q.value=o.q||1;
 const g=x.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+(o.att||.004));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 s.connect(fl);fl.connect(g);g.connect(E.cur);if(o.wet)g.connect(E.rvIn);s.start(t,Math.random()*2);s.stop(t+dur+.05)}
function vib(E,o,t,dur,rate,cents){const x=E.x,l=x.createOscillator(),g=x.createGain();l.frequency.value=rate;g.gain.value=cents;l.connect(g);g.connect(o.detune);l.start(t);l.stop(t+dur)}

/* ---- Stimmen (aus v0.12 uebernommen + neu: lute harp cello choirM toll grunt spic) ---- */
function voice(E,m,t,d,vol,type,wet){const x=E.x,f0=mf(m);
 const out2=g=>{g.connect(E.cur);if(wet)g.connect(E.rvIn)};
 const env=(g,att,hold,rel)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+att);g.gain.setValueAtTime(vol,t+Math.max(att,hold));g.gain.exponentialRampToValueAtTime(.0001,t+hold+rel)};
 const osc=(ty,f,det)=>{const o=x.createOscillator();o.type=ty;o.frequency.value=f;if(det)o.detune.value=det;return o};
 const stop=(arr,end)=>arr.forEach(o=>{o.start(t);o.stop(end)});
 const lpf=(f,q)=>{const b=x.createBiquadFilter();b.type='lowpass';b.frequency.value=f;if(q)b.Q.value=q;return b};
 if(type==='flute'){const g=x.createGain(),a=osc('sine',f0),b=osc('triangle',f0*2);const gb=x.createGain();gb.gain.value=.25;a.connect(g);b.connect(gb);gb.connect(g);env(g,.07,Math.max(.1,d-.1),.25);vib(E,a,t,d+.5,5.2,7);out2(g);stop([a,b],t+d+.4)}
 else if(type==='fife'){const g=x.createGain(),f=lpf(3800),a=osc('square',f0*2);a.connect(f);f.connect(g);env(g,.01,Math.max(.05,d*.8),.1);out2(g);stop([a],t+d+.2)}
 else if(type==='pluck'){const g=x.createGain(),a=osc('triangle',f0),b=osc('sine',f0*2);const gb=x.createGain();gb.gain.value=.4;a.connect(g);b.connect(gb);gb.connect(g);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+Math.min(1.1,Math.max(.35,d*1.3)));out2(g);stop([a,b],t+1.3)}
 else if(type==='lute'){const g=x.createGain(),f=x.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(3400,t);f.frequency.exponentialRampToValueAtTime(800,t+.35);
  const a=osc('triangle',f0),b=osc('sawtooth',f0,3),gb=x.createGain();gb.gain.value=.22;a.connect(f);b.connect(gb);gb.connect(f);f.connect(g);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+Math.min(1.1,Math.max(.35,d*1.5)));out2(g);stop([a,b],t+1.3)}
 else if(type==='harp'){const g=x.createGain();const ps=[[1,1],[2,.35],[3,.12]];ps.forEach(([k,v])=>{const o=osc(k===1?'triangle':'sine',f0*k),gg=x.createGain();gg.gain.value=v;o.connect(gg);gg.connect(g);o.start(t);o.stop(t+2)});
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.003);g.gain.exponentialRampToValueAtTime(vol*.3,t+.25);g.gain.exponentialRampToValueAtTime(.0001,t+1.8);out2(g)}
 else if(type==='organ'){const g=x.createGain(),f=lpf(1700),a=osc('square',f0,-4),b=osc('square',f0,4),c=osc('sawtooth',f0*1.5);const gc=x.createGain();gc.gain.value=.3;a.connect(f);b.connect(f);c.connect(gc);gc.connect(f);f.connect(g);env(g,.04,Math.max(.08,d-.05),.2);vib(E,a,t,d+.4,4.5,5);out2(g);stop([a,b,c],t+d+.3)}
 else if(type==='choir'){const g=x.createGain(),f=lpf(950,2),os=[osc('sawtooth',f0,-9),osc('sawtooth',f0,0),osc('sawtooth',f0,9)];os.forEach(o=>o.connect(f));f.connect(g);env(g,Math.min(.35,d*.4),Math.max(.1,d-.1),.35);vib(E,os[1],t,d+.6,5,10);out2(g);stop(os,t+d+.5)}
 else if(type==='choirM'){ // Maennerchor: Saegezahn durch zwei Formanten (a)
  const g=x.createGain(),os=[osc('sawtooth',f0,-11),osc('sawtooth',f0,0),osc('sawtooth',f0,11),osc('sawtooth',f0*.5,4)];
  const mix=x.createGain();mix.gain.value=.5;os.forEach(o=>o.connect(mix));
  for(const [fc,q,gv] of [[640,5,1],[1080,6,.55],[2400,6,.2]]){const b=x.createBiquadFilter();b.type='bandpass';b.frequency.value=fc;b.Q.value=q;const gg=x.createGain();gg.gain.value=gv;mix.connect(b);b.connect(gg);gg.connect(g)}
  env(g,Math.min(.4,d*.4),Math.max(.12,d-.12),.4);vib(E,os[1],t,d+.7,5.1,9);out2(g);stop(os,t+d+.6)}
 else if(type==='horn'){const g=x.createGain(),f=lpf(760),os=[osc('sawtooth',f0,-5),osc('sawtooth',f0,5)];os.forEach(o=>o.connect(f));f.connect(g);env(g,.08,Math.max(.1,d-.1),.25);out2(g);stop(os,t+d+.4)}
 else if(type==='cello'){const g=x.createGain(),f=lpf(560),os=[osc('sawtooth',f0,-6),osc('sawtooth',f0,6),osc('triangle',f0*.5)];os.forEach(o=>o.connect(f));f.connect(g);env(g,.18,Math.max(.2,d-.2),.3);vib(E,os[0],t,d+.5,4.6,8);out2(g);stop(os,t+d+.5)}
 else if(type==='spic'){const g=x.createGain(),f=lpf(1500),os=[osc('sawtooth',f0,-6),osc('sawtooth',f0,6)];os.forEach(o=>o.connect(f));f.connect(g);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(.08,d*.8));out2(g);stop(os,t+d+.2)}
 else if(type==='bell'){for(const [k,v] of [[1,1],[2.76,.5],[5.4,.25]]){const g=x.createGain(),a=osc('sine',f0*k);a.connect(g);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol*v,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+2.2/k);out2(g);a.start(t);a.stop(t+2.4)}}
 else if(type==='toll'){for(const [k,v,dc] of [[.5,.7,4.5],[1,1,5],[1.19,.55,3.6],[1.56,.4,3],[2,.45,2.4],[2.5,.25,1.8],[3.4,.15,1.2]]){const g=x.createGain(),a=osc('sine',f0*k);a.connect(g);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol*v,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+dc);out2(g);a.start(t);a.stop(t+dc+.1)}
  nz(E,t,.06,vol*.5,'bandpass',900,500,{wet:true})}
 else if(type==='air'){const g=x.createGain(),a=osc('sine',f0),b=osc('triangle',f0,6);const gb=x.createGain();gb.gain.value=.3;a.connect(g);b.connect(gb);gb.connect(g);env(g,Math.min(1.2,d*.5),Math.max(.2,d-.2),.8);out2(g);stop([a,b],t+d+1)}
 else if(type==='drone'){const g=x.createGain(),f=lpf(220),os=[osc('sawtooth',f0,-8),osc('sawtooth',f0/2,6),osc('square',f0,0)];os.forEach(o=>o.connect(f));f.connect(g);env(g,.8,Math.max(.2,d-.3),.6);out2(g);stop(os,t+d+.8)}
 else if(type==='grunt'){const g=x.createGain(),os=[osc('sawtooth',f0,-15),osc('sawtooth',f0*1.5,9),osc('square',f0*.5,0)],mix=x.createGain();mix.gain.value=.6;os.forEach(o=>o.connect(mix));
  for(const [fc,q,gv] of [[420,3,1],[760,4,.5]]){const b=x.createBiquadFilter();b.type='bandpass';b.frequency.setValueAtTime(fc*1.3,t);b.frequency.exponentialRampToValueAtTime(fc*.8,t+d);b.Q.value=q;const gg=x.createGain();gg.gain.value=gv;mix.connect(b);b.connect(gg);gg.connect(g)}
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+d);out2(g);stop(os,t+d+.1);nz(E,t,d*.8,vol*.35,'bandpass',500,250,{q:1.2})}
 else{const lp=type==='brass'?1700:type==='saw'?1200:type==='strings'?650:900,g=x.createGain(),f=lpf(lp),os=[osc('sawtooth',f0,-6),osc('sawtooth',f0,6)];os.forEach(o=>o.connect(f));f.connect(g);env(g,type==='strings'?.9:.04,Math.max(.1,d-.15),.25);out2(g);stop(os,t+d+.3)}}

function drum(E,t,kind,vol){const x=E.x,O=(f0,f1,tt,v,rv)=>{const o=x.createOscillator(),g=x.createGain();o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+tt*.6);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+tt);o.connect(g);g.connect(E.cur);if(rv)g.connect(E.rvIn);o.start(t);o.stop(t+tt+.1)};
 if(kind==='tim'){O(95,42,.6,vol,1);nz(E,t,.1,vol*.5,'lowpass',500,120)}
 else if(kind==='taiko'){O(130,55,.35,vol,1);nz(E,t,.06,vol*.6,'bandpass',900,300)}
 else if(kind==='tomL'||kind==='tomM'||kind==='tomH'){const f=kind==='tomL'?70:kind==='tomM'?105:150;O(f*1.6,f,.45,vol,1);nz(E,t,.05,vol*.4,'bandpass',500,250)}
 else if(kind==='hand'){nz(E,t,.14,vol,'bandpass',260,180,{q:1.5});O(190,110,.2,vol*.6)}
 else if(kind==='heart'){for(const [dt,v] of [[0,1],[.2,.6]]){const o=x.createOscillator(),g=x.createGain();o.frequency.setValueAtTime(70,t+dt);o.frequency.exponentialRampToValueAtTime(38,t+dt+.25);g.gain.setValueAtTime(vol*v,t+dt);g.gain.exponentialRampToValueAtTime(.001,t+dt+.4);o.connect(g);g.connect(E.cur);g.connect(E.rvIn);o.start(t+dt);o.stop(t+dt+.5)}}
 else if(kind==='anvil'){for(const f of[880,1320,2210,3100]){const o=x.createOscillator(),g=x.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(vol*.35,t);g.gain.exponentialRampToValueAtTime(.0001,t+(f>2000?.25:.7));o.connect(g);g.connect(E.cur);g.connect(E.rvIn);o.start(t);o.stop(t+.8)}nz(E,t,.04,vol*.5,'highpass',3000,6000)}
 else if(kind==='cym'){nz(E,t,1.6,vol,'highpass',3500,9000,{att:.25,wet:true})}
 else if(kind==='rattle'){for(let i=0;i<5;i++)nz(E,t+i*.045+Math.random()*.02,.03,vol*(.5+Math.random()*.5),'bandpass',3000+Math.random()*3000,2500,{q:6})}
 else{nz(E,t,.12,vol*.4,'bandpass',1800,900,{q:.8});nz(E,t,.04,vol*.3,'highpass',4000,6000)}}

function chirp(E,t,vol){const x=E.x,f=2600+Math.random()*1800,n=2+Math.floor(Math.random()*3);for(let i=0;i<n;i++){const o=x.createOscillator(),g=x.createGain(),tt=t+i*.09;o.frequency.setValueAtTime(f*(1+i*.06),tt);o.frequency.exponentialRampToValueAtTime(f*(1.35+i*.05),tt+.06);g.gain.setValueAtTime(.0001,tt);g.gain.exponentialRampToValueAtTime(vol,tt+.01);g.gain.exponentialRampToValueAtTime(.0001,tt+.07);o.connect(g);g.connect(E.cur);g.connect(E.rvIn);o.start(tt);o.stop(tt+.1)}}
function windBed(E,t,dur,vol,f0){const x=E.x,s=x.createBufferSource();s.buffer=E.noise;s.loop=true;const f=x.createBiquadFilter();f.type='bandpass';f.frequency.value=f0;f.Q.value=.9;
 const g=x.createGain(),ramp=Math.min(4,dur/3);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+ramp);g.gain.setValueAtTime(vol,Math.max(t+ramp,t+dur-ramp));g.gain.linearRampToValueAtTime(.0001,t+dur);
 const l=x.createOscillator(),lg=x.createGain();l.frequency.value=.11;lg.gain.value=f0*.45;l.connect(lg);lg.connect(f.frequency);l.start(t);l.stop(t+dur+.1);
 const l2=x.createOscillator(),lg2=x.createGain();l2.frequency.value=.07;lg2.gain.value=vol*.5;l2.connect(lg2);lg2.connect(g.gain);l2.start(t);l2.stop(t+dur+.1);
 s.connect(f);f.connect(g);g.connect(E.cur);g.connect(E.rvIn);s.start(t);s.stop(t+dur+.1)}

/* ---- Track-Aufbau + Taktplanung ---- */
function prepTrack(T){
 T.chordsP=T.chords.map(n=>n);if(T.chords.length!==T.bars)console.warn('AKKORDE',T.id,T.chords.length,'statt',T.bars);
 T.layers.forEach(L=>{if(L.k==='mel'){L.p=parseMel(L.bars.join('|'),T.bpb,T.id+':'+L.inst+'@'+L.at);L.from=L.at;L.to=L.at+L.p.length}});
 return T}
const ARP={alb8:[0,2,1,2,0,2,1,2],up6:[0,1,2,3,2,1],ud8:[0,1,2,3,2,1,2,1],roll:[0,1,2,0,1,2,0,1],oom:[0,-1,-1]};
function schedBar(E,T,bar,t){
 const spb=60/T.bpm,bd=spb*T.bpb,rng=mulberry(T.seed*131+bar*17),ch=T.chords[bar];
 T.layers.forEach((L,li)=>{
  const from=L.from==null?0:L.from,to=L.to==null?T.bars:L.to;
  if(bar<from||bar>=to)return;if(L.only&&!L.only.includes(bar))return;
  E.cur=layerBus(E,T.id+li,L.pan||0);const v=(L.vol||.05);
  if(L.k==='mel'){L.p[bar-L.at].forEach(([b,ms,d])=>ms.forEach(m=>voice(E,m+(L.tr||0),t+b*spb,d*spb*(L.art||.96),v,L.inst,L.wet!==0)))}
  else if(L.k==='pad'){const c=chord(ch,L.oct||3);let ns=c.notes.slice(0,3);if(L.add)L.add.forEach(a=>ns.push(c.root+a));ns.forEach(m=>voice(E,m,t,bd*1.02,v,L.inst,true))}
  else if(L.k==='bass'){const c=chord(ch,L.oct||2),r=c.root,f5=r+7,st=L.style||'long',w=L.wet?true:false;
   if(st==='long')voice(E,r,t,bd*.98,v,L.inst,w);
   else if(st==='rf'){voice(E,r,t,spb*(T.bpb>3?2:1.5),v,L.inst,w);voice(E,T.bpb>3?f5:r,t+spb*(T.bpb>3?2:1.5),spb*(T.bpb>3?1.9:1.4),v*.8,L.inst,w)}
   else if(st==='march'){for(let b=0;b<T.bpb;b+=2){voice(E,r,t+b*spb,spb*1.6,v,L.inst,w)}}
   else if(st==='pulse8'){for(let s=0;s<T.bpb*2;s++)voice(E,r+(s%8===4?7:0),t+s*spb/2,spb*.42,v*(s%2?.7:1),L.inst,w)}
   else if(st==='gallop'){for(let b=0;b<T.bpb;b++){voice(E,r,t+b*spb,spb*.2,v*(b%2?.7:1),L.inst,w);voice(E,r,t+(b+.25)*spb,spb*.2,v*.55,L.inst,w);voice(E,r+(b===T.bpb-1?7:0),t+(b+.5)*spb,spb*.2,v*.6,L.inst,w)}}
   else if(st==='waltz'){voice(E,r,t,spb*2.6,v,L.inst,w)}}
  else if(L.k==='arp'){const c=chord(ch,L.oct||4),ns=[c.notes[0],c.notes[1],c.notes[2],c.notes[0]+12],pat=L.pat||ARP.alb8,step=L.step||.5,n=Math.round(T.bpb/step);
   for(let s=0;s<n;s++){const i=pat[s%pat.length];if(i<0)continue;voice(E,ns[i],t+s*step*spb,step*spb*1.3,v*((s*step)%1===0?1:.75),L.inst,L.wet!==0)}}
  else if(L.k==='drum'){const hits=(L.hits2&&bar%2===1)?L.hits2:L.hits;hits.forEach(([b,k,hv])=>drum(E,t+b*spb,k,hv*(L.vol||1)))}
  else if(L.k==='fx'){
   if(L.style==='toll'){if((bar-from)%(L.every||2)===0)voice(E,nm(L.note),t+(L.beat||0)*spb,4,v,'toll',true)}
   else if(L.style==='birds'){if(rng()<(L.p||.3))chirp(E,t+Math.floor(rng()*T.bpb*2)/2*spb,v)}
   else if(L.style==='sparkle'){const c=chord(ch,L.oct||6),n=L.n||2;for(let i=0;i<n;i++){const ms=c.notes[Math.floor(rng()*3)],b=Math.floor(rng()*T.bpb*2)/2;voice(E,ms,t+b*spb,2,v,'bell',true)}}
   else if(L.style==='wind'){if(bar===from)windBed(E,t,(to-from)*bd,v,L.f||600)}
   else if(L.style==='rattle'){if(rng()<(L.p||.3))drum(E,t+Math.floor(rng()*T.bpb*2)/2*spb,'rattle',v)}
   else if(L.style==='grunt'){const c=chord(ch,L.oct||2);(L.beats||[0]).forEach(b=>voice(E,c.root+(L.shift||0),t+b*spb,spb*.7,v,'grunt',true))}}
 })}

/* ---- Fanfaren: Sample + Fraktions-Faerbung ---- */
const FLAV={
 neutral:{n:'Neutral (Original)',r:1,lp:18000,hp:30,wet:.2,hit:null},
 humans:{n:'Menschen',r:1,lp:16000,hp:40,wet:.25,hit:'tim'},
 elves:{n:'Elfen',r:1.122,lp:15000,hp:260,wet:.45,hit:'bell'},
 orcs:{n:'Orks',r:.84,lp:4200,hp:30,wet:.3,hit:'tom',drive:1},
 dwarves:{n:'Zwerge',r:.89,lp:7000,hp:40,wet:.35,hit:'anvil'},
 undead:{n:'Untote',r:.79,lp:3000,hp:30,wet:.6,hit:'toll'}};
function driveCurve(a){const n=1024,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=Math.tanh(x*(1+a*2.5))/Math.tanh(1+a*2.5)}return c}
/* gibt Dauer in Sekunden zurueck */
function playFanfare(ctx,buf,flav,kind,t0,dest){
 const F=FLAV[flav]||FLAV.neutral,lose=kind==='lose',E=mkFanEngine(ctx,{gain:1.5,rvLen:2.8,rvWet:lose?.7:.45,rvDark:lose?.25:.4,dest:dest});E.cur=E.mus;
 const r=F.r*(lose?.86:1),lp=F.lp*(lose?.5:1),wet=Math.min(.9,F.wet+(lose?.25:0));
 const src=ctx.createBufferSource();src.buffer=buf;src.playbackRate.setValueAtTime(r,t0);
 const dur0=buf.duration/r;let dur=dur0;
 if(lose){const rs=t0+dur0*.62,rl=dur0*.34;src.playbackRate.setValueAtTime(r,rs);src.playbackRate.exponentialRampToValueAtTime(r*.55,rs+rl);dur=dur0*.62+(buf.duration*.38)/(r*.74)}
 const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=F.hp;
 const l=ctx.createBiquadFilter();l.type='lowpass';l.frequency.value=Math.max(800,lp);if(lose)l.Q.value=.9;
 const g=ctx.createGain();g.gain.setValueAtTime(1,t0);g.gain.setValueAtTime(1,t0+dur-.8);g.gain.linearRampToValueAtTime(0,t0+dur+.2);
 src.connect(hp);hp.connect(l);let n=l;
 if(F.drive&&!lose){const ws=ctx.createWaveShaper();ws.curve=driveCurve(F.drive);ws.oversample='2x';n.connect(ws);n=ws}
 n.connect(g);g.connect(E.mus);const send=ctx.createGain();send.gain.value=wet;g.connect(send);send.connect(E.rvIn);
 src.start(t0);src.stop(t0+dur+.3);
 // Faerbung durch Zusatz-Schlaege
 const H=F.hit;
 if(!lose){
  if(H==='tim'){drum(E,t0,'tim',.7);drum(E,t0+.01,'cym',.1)}
  else if(H==='bell'){[84,88,91,96].forEach((m,i)=>voice(E,m,t0+i*.07,2,.05,'bell',true))}
  else if(H==='tom'){drum(E,t0,'tomL',.9);drum(E,t0+.28,'tomM',.6);drum(E,t0+.5,'tomL',.9)}
  else if(H==='anvil'){drum(E,t0,'anvil',.6);drum(E,t0+dur*.5,'anvil',.4)}
  else if(H==='toll'){voice(E,nm('F#3'),t0,4,.12,'toll',true);voice(E,nm('F#3'),t0+dur*.7,4,.1,'toll',true)}
 }else{
  voice(E,nm('F#3'),t0+.05,5,.16,'toll',true);voice(E,nm('D3'),t0+dur*.55,5,.14,'toll',true);voice(E,nm('A2'),t0+dur*.85,6,.16,'toll',true);
  if(H==='tom')drum(E,t0+dur*.8,'tomL',.7);if(H==='anvil')drum(E,t0+dur*.8,'anvil',.4);
  for(let i=0;i<3;i++)drum(E,t0+dur*.86+i*.9,'heart',.35/(1+i*.4))}
 return dur+.4}

return{playFanfare:playFanfare,FLAV:FLAV}})();

/* ---- Fanfaren: A = Schlacht-Sieg, B/C wechseln bei Schlacht-Niederlage, D = Kampagne (Sieg und Niederlage). Faerbung nach Fraktion des Spielers. Waehrend der Fanfare wird die Musik (Datei und Synth) kurz auf etwa 30 % gesenkt. ---- */
const FAN={bufs:{},loading:false,lastLose:'C'};
function fanLoad(){
 if(FAN.loading||!AU.ctx)return;FAN.loading=true;let d;try{d=window.KH_FAN}catch(e){return}
 for(const k in d){try{const bin=atob(d[k]),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  new Promise((res,rej)=>{const r=AU.ctx.decodeAudioData(u.buffer,res,rej);if(r&&r.then)r.then(res,rej)}).then(buf=>{if(buf)FAN.bufs[k]=buf}).catch(()=>{})}catch(e){}}}
function fmDk(){const a=FM.dkA;if(!a)return 1;const t=(performance.now()-a.t)/1000,d=a.d;if(t<.25)return 1-.7*t/.25;if(t<d-.5)return .3;if(t<d+.8)return .3+.7*(t-(d-.5))/1.3;FM.dkA=null;return 1}
function fanPlay(id,win,fk){
 const buf=FAN.bufs[id];if(!buf||!AU.ctx||AU.opt.sfx<=0)return false;
 try{const x=AU.ctx,d=NM.playFanfare(x,buf,NM.FLAV[fk]?fk:'neutral',win?'win':'lose',x.currentTime+.05,AU.sfx);
  const g=AU.musOut.gain,v=AU.opt.music*.55,t=x.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(v*.3,t+.25);g.setValueAtTime(v*.3,t+Math.max(.3,d-.5));g.linearRampToValueAtTime(v,t+d+.8);
  FM.dkA={t:performance.now(),d:d};
  return true}catch(e){return false}}
function fanBattle(win,fk){
 if(!AU.ctx||AU.opt.sfx<=0)return;let id='A';if(!win){id=FAN.lastLose==='B'?'C':FAN.lastLose==='C'?'B':(Math.random()<.5?'B':'C');FAN.lastLose=id}
 if(!fanPlay(id,win,fk)){if(win)SFX.win();else SFX.lose()}}
function fanCamp(win,fk){
 if(!AU.ctx||AU.opt.sfx<=0)return;if(!fanPlay('D',win,fk)){if(win)SFX.win();else SFX.lose()}}
