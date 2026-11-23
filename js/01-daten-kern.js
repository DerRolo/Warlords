/* Konstanten, Fraktionen, Einheiten, Upgrades, KI-Strategien (Kern) */
//CORE_START
const LANES=7,FW=1000,BX=30,GAIN=4,MAXATT=3;
const FACTIONS={"humans": {"name": "Menschenbund", "color": "#3b82f6", "power": 1, "pas": "human", "desc": "Ausgewogenes Heer ohne Schwächen. Die Reiterei bricht mit einem gewaltigen ersten Schlag durch jede Linie.", "passive": "Reiterstoß: Der erste Hieb eines Reiters richtet doppelten Schaden an.", "units": [{"n": "Speerträger", "k": "spear", "hp": 58, "dmg": 7.9, "rng": 40, "spd": 56, "cd": 0.8, "sp": 2.0, "arm": 20, "tag": "pike", "info": "Billig, stark gegen Reiter.", "cost": 0, "t": 0.173, "i": 0}, {"n": "Schwertkämpfer", "k": "sword", "hp": 73, "dmg": 8.9, "rng": 28, "spd": 40, "cd": 0.7, "sp": 2.4, "arm": 35, "info": "Solide Frontlinie.", "cost": 0, "t": 0.458, "i": 1}, {"n": "Bogenschütze", "k": "bow", "hp": 35, "dmg": 10.1, "rng": 440, "spd": 38, "cd": 1.49, "sp": 2.8, "arm": 5, "info": "Schießt über die Linie hinweg.", "cost": 0, "t": 0.1, "acc": 0.8, "i": 2}, {"n": "Reiter", "k": "cav", "hp": 122, "dmg": 15.3, "rng": 30, "spd": 102, "cd": 0.9, "sp": 4.6, "arm": 30, "tag": "cav", "info": "Schnell, doppelter Erstschlag.", "cost": 600, "t": 0.599, "i": 3}, {"n": "Hellebardier", "k": "spear", "hp": 77, "dmg": 16.3, "rng": 55, "spd": 36, "cd": 1.0, "arm": 25, "tag": "pike", "info": "Lange Hellebarde, bricht Reiterangriffe.", "cost": 400, "sp": 4.2, "t": 0.354, "i": 4}, {"n": "Armbrustschütze", "k": "bow", "hp": 40, "dmg": 20.9, "rng": 520, "spd": 34, "cd": 2.56, "arm": 20, "info": "Wenige, aber harte Bolzen.", "cost": 500, "sp": 3.6, "t": 0.379, "acc": 0.9, "i": 5}, {"n": "Gardist", "k": "sword", "hp": 173, "dmg": 16.1, "rng": 30, "spd": 30, "cd": 0.9, "arm": 75, "info": "Schwer gepanzerte Leibwache.", "cost": 700, "sp": 6.91, "t": 0.747, "i": 6}, {"n": "Hofmagier", "k": "mage", "hp": 30, "dmg": 23.0, "rng": 300, "spd": 34, "cd": 2.2, "arm": 0, "info": "Feuerbälle aus der zweiten Reihe.", "cost": 800, "sp": 4.65, "t": 0.308, "i": 7}, {"n": "Ritter", "k": "cav", "hp": 184, "dmg": 18.4, "rng": 30, "spd": 76, "cd": 1.0, "arm": 70, "tag": "cav", "info": "Gepanzerte Reiter mit Wucht.", "cost": 1100, "sp": 8.2, "t": 0.852, "i": 8}, {"n": "Paladin", "k": "big", "hp": 264, "dmg": 24.4, "rng": 34, "spd": 26, "cd": 1.2, "arm": 80, "info": "Heiliger Kämpfer, kaum zu stoppen.", "cost": 1200, "sp": 10.0, "t": 1.0, "i": 9}], "orb": "#6fb3ff", "sm": 1}, "elves": {"name": "Waldelfen", "color": "#22a05a", "power": 0.95, "pas": "elf", "desc": "Zerbrechlich, schnell und tödlich auf Distanz. Wer sie in den Nahkampf zwingt, gewinnt.", "passive": "Naturjäger: Fernkämpfer richten 6% mehr Schaden an.", "units": [{"n": "Späher", "k": "scout", "hp": 32, "dmg": 4.7, "rng": 25, "spd": 125, "cd": 0.6, "sp": 2.0, "arm": 0, "info": "Sehr schnell, schlüpft durch Lücken.", "cost": 0, "t": 0.0, "i": 0}, {"n": "Waldläufer", "k": "bow", "hp": 45, "dmg": 12.8, "rng": 540, "spd": 45, "cd": 1.22, "sp": 2.4, "arm": 0, "info": "Große Reichweite, kaum Rüstung.", "cost": 0, "t": 0.671, "acc": 0.85, "i": 1}, {"n": "Speerelf", "k": "spear", "hp": 81, "dmg": 11.5, "rng": 45, "spd": 55, "cd": 0.8, "sp": 2.8, "arm": 15, "tag": "pike", "info": "Flink, gut gegen Reiter.", "cost": 0, "t": 0.401, "i": 2}, {"n": "Hainwächter", "k": "big", "hp": 236, "dmg": 14.7, "rng": 32, "spd": 28, "cd": 1, "sp": 8.24, "arm": 50, "info": "Schwer gepanzerter Elfenwächter mit Glefe.", "cost": 800, "t": 0.865, "i": 3}, {"n": "Dolchtänzer", "k": "sword", "hp": 68, "dmg": 11.6, "rng": 26, "spd": 85, "cd": 0.4, "arm": 5, "info": "Blitzschnelle Klingen.", "cost": 400, "sp": 4.2, "t": 0.202, "i": 4}, {"n": "Dornenwächter", "k": "spear", "hp": 115, "dmg": 12.4, "rng": 60, "spd": 40, "cd": 0.9, "arm": 40, "tag": "pike", "info": "Wehrhafter Speerträger.", "cost": 500, "sp": 5.9, "t": 0.644, "i": 5}, {"n": "Falkenschütze", "k": "bow", "hp": 39, "dmg": 10.8, "rng": 640, "spd": 44, "cd": 0.94, "arm": 0, "info": "Extreme Reichweite.", "cost": 600, "sp": 5.85, "t": 0.638, "acc": 0.85, "i": 6}, {"n": "Druide", "k": "mage", "hp": 49, "dmg": 16.8, "rng": 240, "spd": 40, "cd": 1.6, "arm": 0, "info": "Naturmagie aus der Ferne.", "cost": 700, "sp": 4.72, "t": 0.496, "i": 7}, {"n": "Hirschreiter", "k": "cav", "hp": 129, "dmg": 15.0, "rng": 30, "spd": 110, "cd": 0.9, "arm": 25, "tag": "cav", "info": "Sehr schnelle Reiter.", "cost": 800, "sp": 5.67, "t": 0.617, "i": 8}, {"n": "Mondklinge", "k": "big", "hp": 392, "dmg": 20.2, "rng": 36, "spd": 24, "cd": 1.2, "arm": 60, "info": "Elfenchampion mit Mondsilber-Großschwert.", "cost": 1200, "sp": 10.0, "t": 1.0, "i": 9}], "orb": "#9fff7a", "sm": 1}, "orcs": {"name": "Orks des Nordens", "color": "#c0392b", "power": 1.05, "pas": "orc", "desc": "Rohe Gewalt ohne Fernkampf. Verwundete Orks kämpfen noch wütender.", "passive": "Berserker: Unter 50% Leben +40% Schaden.", "units": [{"n": "Grunzer", "k": "club", "hp": 49, "dmg": 9.2, "rng": 28, "spd": 42, "cd": 0.8, "sp": 2.0, "arm": 15, "info": "Billige Masse.", "cost": 0, "t": 0.25, "i": 0}, {"n": "Axtschwinger", "k": "axe", "hp": 64, "dmg": 13.2, "rng": 32, "spd": 40, "cd": 1, "sp": 2.4, "arm": 20, "info": "Hoher Schaden.", "cost": 0, "t": 0.493, "i": 1}, {"n": "Wolfsreiter", "k": "cav", "hp": 91, "dmg": 14.0, "rng": 28, "spd": 114, "cd": 0.8, "sp": 2.8, "arm": 17, "tag": "cav", "info": "Sehr schneller Durchbruch, jetzt zäher.", "cost": 0, "t": 0.406, "i": 2}, {"n": "Troll", "k": "big", "hp": 269, "dmg": 23.5, "rng": 36, "spd": 25, "cd": 1.4, "sp": 8.39, "arm": 40, "info": "Walze, aber langsam.", "cost": 900, "t": 0.877, "i": 3}, {"n": "Plünderer", "k": "scout", "hp": 42, "dmg": 7.6, "rng": 26, "spd": 100, "cd": 0.6, "arm": 5, "info": "Schnell und gierig.", "cost": 300, "sp": 4.2, "t": 0.0, "i": 4}, {"n": "Speerwerfer", "k": "bow", "hp": 47, "dmg": 11.4, "rng": 320, "spd": 38, "cd": 1.89, "arm": 10, "info": "Wirft Speere auf kurze Distanz.", "cost": 500, "sp": 4.35, "t": 0.285, "acc": 0.75, "i": 5}, {"n": "Schwarzork", "k": "axe", "hp": 142, "dmg": 20.8, "rng": 32, "spd": 36, "cd": 1.0, "arm": 40, "info": "Elitekrieger mit Doppelaxt.", "cost": 700, "sp": 6.37, "t": 0.694, "i": 6}, {"n": "Schamane", "k": "mage", "hp": 42, "dmg": 17.4, "rng": 260, "spd": 36, "cd": 2.0, "arm": 0, "info": "Feuer und Blitz.", "cost": 800, "sp": 4.65, "t": 0.424, "i": 7}, {"n": "Eberreiter", "k": "cav", "hp": 159, "dmg": 19.1, "rng": 30, "spd": 85, "cd": 1.0, "arm": 35, "tag": "cav", "info": "Rammt alles nieder.", "cost": 900, "sp": 6.72, "t": 0.729, "i": 8}, {"n": "Kriegsherr", "k": "big", "hp": 316, "dmg": 26.9, "rng": 38, "spd": 24, "cd": 1.4, "arm": 50, "info": "Anführer der Horde.", "cost": 1300, "sp": 10.0, "t": 1.0, "i": 9}, {"n": "Axtwerfer", "k": "bow", "hp": 58, "dmg": 14.6, "rng": 300, "spd": 36, "cd": 1.9, "sp": 3.6, "arm": 12, "tag": null, "info": "Wirft schwere Äxte über die Front.", "cost": 450, "t": 0.4, "i": 10}], "orb": "#ff7a3a", "sm": 1}, "dwarves": {"name": "Zwergenclans", "color": "#d9a21b", "power": 1.1, "pas": "dwarf", "desc": "Langsam, aber fast unzerstörbar. Sie brauchen Zeit, um anzukommen, und das Zeitlimit ist ihr Feind.", "passive": "Steinhaut: 10% weniger erlittener Schaden.", "units": [{"n": "Hammerträger", "k": "hammer", "hp": 57, "dmg": 6.3, "rng": 28, "spd": 28, "cd": 0.9, "sp": 2.0, "arm": 60, "info": "Schwer gepanzert.", "cost": 0, "t": 0.408, "i": 0}, {"n": "Armbrustschütze", "k": "bow", "hp": 26, "dmg": 12.1, "rng": 400, "spd": 28, "cd": 2.43, "sp": 2.4, "arm": 40, "info": "Seltene, harte Schüsse.", "cost": 0, "t": 0.105, "acc": 0.9, "i": 1}, {"n": "Axtkämpfer", "k": "axe", "hp": 66, "dmg": 11.2, "rng": 30, "spd": 30, "cd": 0.9, "sp": 2.8, "arm": 50, "info": "Allrounder.", "cost": 0, "t": 0.403, "i": 2}, {"n": "Eisenwächter", "k": "big", "hp": 209, "dmg": 9.1, "rng": 30, "spd": 20, "cd": 1.1, "sp": 5.97, "arm": 90, "info": "Fast unverwundbar, sehr langsam.", "cost": 900, "t": 0.651, "i": 3}, {"n": "Minenarbeiter", "k": "axe", "hp": 62, "dmg": 9.8, "rng": 28, "spd": 45, "cd": 0.8, "arm": 30, "info": "Billig und flink für Zwerge.", "cost": 300, "sp": 4.2, "t": 0.055, "i": 4}, {"n": "Thane", "k": "hammer", "hp": 156, "dmg": 19.6, "rng": 30, "spd": 28, "cd": 0.9, "arm": 75, "info": "Clanführer mit Kriegshammer.", "cost": 700, "sp": 6.83, "t": 0.739, "i": 5}, {"n": "Büchsenschütze", "k": "bow", "hp": 31, "dmg": 18.6, "rng": 600, "spd": 26, "cd": 4.32, "arm": 30, "info": "Langsam, aber verheerend.", "cost": 800, "sp": 4.5, "t": 0.1, "acc": 0.9, "i": 6}, {"n": "Runenschmied", "k": "mage", "hp": 46, "dmg": 13.0, "rng": 220, "spd": 30, "cd": 2.0, "arm": 30, "info": "Runenmagie, robust.", "cost": 800, "sp": 4.65, "t": 0.323, "i": 7}, {"n": "Widderreiter", "k": "cav", "hp": 198, "dmg": 16.3, "rng": 30, "spd": 60, "cd": 1.0, "arm": 65, "tag": "cav", "info": "Schwere Rammbock-Reiter.", "cost": 1000, "sp": 7.41, "t": 0.794, "i": 8}, {"n": "Eisenbrecher", "k": "big", "hp": 295, "dmg": 26.8, "rng": 34, "spd": 22, "cd": 1.3, "arm": 85, "info": "Gepanzerter Koloss.", "cost": 1200, "sp": 10.0, "t": 1.0, "i": 9}, {"n": "Axtwerfer", "k": "bow", "hp": 38, "dmg": 12.6, "rng": 320, "spd": 28, "cd": 2.0, "sp": 3.4, "arm": 35, "tag": null, "info": "Wirft Wurfäxte, zäh für einen Fernkämpfer.", "cost": 400, "t": 0.4, "i": 10}, {"n": "Hammerwerfer", "k": "bow", "hp": 44, "dmg": 15.8, "rng": 280, "spd": 26, "cd": 2.4, "sp": 5.1, "arm": 45, "tag": null, "info": "Schleudert Wurfhämmer mit hohem Schaden.", "cost": 650, "t": 0.55, "i": 11}], "orb": "#ffcf4a", "sm": 1}, "undead": {"name": "Untote Legion", "color": "#8e5bd1", "power": 0.9, "pas": "undead", "desc": "Schwärme billiger Knochen. Gefallene stehen manchmal wieder auf.", "passive": "Totenerweckung: 25% der Gefallenen kehren als Skelett zurück.", "units": [{"n": "Skelette", "k": "sword", "hp": 33, "dmg": 6.7, "rng": 26, "spd": 42, "cd": 0.7, "sp": 2.0, "arm": 0, "cnt": 2, "info": "Zwei pro Ruf.", "cost": 0, "t": 0.0, "i": 0}, {"n": "Knochenbogen", "k": "bow", "hp": 28, "dmg": 8.2, "rng": 420, "spd": 38, "cd": 1.35, "sp": 2.4, "arm": 0, "info": "Schwacher Fernkampf.", "cost": 0, "t": 0.137, "acc": 0.7, "i": 1}, {"n": "Ghul", "k": "claw", "hp": 105, "dmg": 12.6, "rng": 26, "spd": 58, "cd": 0.7, "sp": 2.8, "arm": 9, "info": "Schneller Nahkämpfer.", "cost": 0, "t": 0.405, "i": 2}, {"n": "Knochenriese", "k": "big", "hp": 286, "dmg": 25.4, "rng": 40, "spd": 30, "cd": 1.3, "sp": 7.67, "arm": 30, "info": "Schwerer Brecher.", "cost": 850, "t": 0.816, "i": 3}, {"n": "Wiedergänger", "k": "sword", "hp": 183, "dmg": 15.7, "rng": 28, "spd": 34, "cd": 0.8, "arm": 40, "info": "Zäher Untoter.", "cost": 500, "sp": 6.06, "t": 0.661, "i": 4}, {"n": "Pestschleuder", "k": "bow", "hp": 34, "dmg": 12.3, "rng": 480, "spd": 36, "cd": 1.62, "arm": 0, "info": "Fernkampf mit Fäulnis.", "cost": 500, "sp": 4.35, "t": 0.395, "acc": 0.75, "i": 5}, {"n": "Schädelbrecher", "k": "axe", "hp": 119, "dmg": 22.3, "rng": 30, "spd": 45, "cd": 0.9, "arm": 15, "info": "Brutaler Schläger.", "cost": 500, "sp": 4.7, "t": 0.493, "i": 6}, {"n": "Nekromant", "k": "mage", "hp": 41, "dmg": 15.3, "rng": 280, "spd": 34, "cd": 1.8, "arm": 0, "info": "Dunkle Magie auf Distanz.", "cost": 800, "sp": 4.65, "t": 0.382, "i": 7}, {"n": "Gruftreiter", "k": "cav", "hp": 143, "dmg": 16.1, "rng": 30, "spd": 100, "cd": 0.8, "arm": 20, "tag": "cav", "info": "Spektrale Reiter.", "cost": 700, "sp": 5.28, "t": 0.571, "i": 8}, {"n": "Todesritter", "k": "big", "hp": 369, "dmg": 30.2, "rng": 36, "spd": 26, "cd": 1.3, "arm": 60, "info": "Gefallener Held in Eisen.", "cost": 1300, "sp": 10.0, "t": 1.0, "i": 9}], "orb": "#c58bff", "sm": 1}};
const FKEYS=Object.keys(FACTIONS);
const NU=10,CHARGE_AT=15,AURA=160,PEST_R=110;
function magR(b,a){const m=b.m[a.side];return a.d.rng*(a.d.rng>100?b.rm:1)*((m.ur&&m.ur[a.cls])||1)}
function chAt(b,s){return Math.max(8,CHARGE_AT-((b.m[s]&&b.m[s].cn)||0))}
function defMods(){return {a:1,r:0,c:1,h:1,s:1}}
function uclass(d){const k=d.k;return k==='bow'?'bow':k==='mage'?'mage':k==='cav'?'cav':k==='big'?'big':k==='spear'?'pole':(k==='axe'||k==='hammer'||k==='club')?'blunt':'blade'}
function newBattle(o){
 const FWb=o.fw||FW;const b={FW:FWb,mm:o.mm||1,mem:o.mem||null,rm:o.rm!=null?o.rm:Math.max(1,Math.min(4,1+((o.mm||1)-1)*1.5)),t:0,time:o.time||Math.round(150*Math.pow(FWb/1000,.4)),units:[],fx:[],bar:50,over:false,winner:null,reason:'',id:1,
  f:{L:o.L,R:o.R},m:{L:o.mL||defMods(),R:o.mR||defMods()},
  use:{L:o.useL||[0,1,2],R:o.useR||[0,1,2]},
  clock:{L:0,R:0},ch:{L:0,R:0},
  ai:{L:o.aiL==null?null:{d:o.aiL,t:.4+(1-o.aiL)*1.2,want:null},R:o.aiR==null?null:{d:o.aiR,t:.4+(1-o.aiR)*1.2,want:null}},kills:{L:0,R:0}};
 if(o.ev)b.ev=[];
 return b}
function evt(b,e){if(b.ev&&b.ev.length<80)b.ev.push(e)}
function addUnit(b,side,d,lane,k,x,hpf,rez){
 const m=b.m[side],cls=uclass(d),hp=d.hp*(d.i<3?(FACTIONS[b.f[side]].pw||1):(FACTIONS[b.f[side]].pwx||1))*(m.h||1)*((m.uh&&m.uh[cls])||1)*(hpf||1),dir=side==='L'?1:-1;
 const sx=x!=null?x:(side==='L'?BX:b.FW-BX)-dir*14*(k||0);
 const fk=b.f[side],sh=fk!=='undead'&&d.arm>=30&&(d.k==='sword'||d.k==='spear'||d.k==='hammer'||d.k==='big'||(d.k==='axe'&&fk==='dwarves'));
 b.units.push({id:b.id++,sh,cls,side,lane,x:sx,yo:(Math.random()-.5)*.55,hp,mhp:hp,d,cd:Math.random()*.3,first:true,att:0,anim:0,hit:0,ph:Math.random()*6,wt:Math.random()*6,mv:false,am:.3,rez:!!rez})}
/* WARTEZEIT: Eine Uhr pro Seite startet bei Kampfbeginn und nach JEDER gerufenen Einheit wieder bei 0.
   Jede Einheit hat eine feste Zeit T (schwaechste zuerst, staerkste zuletzt). Eine Einheit ist bereit, sobald die Uhr ihre Zeit erreicht hat.
   Wer wartet, kann also staerkere Einheiten rufen; wer schnell ruft, bekommt nur die schnellen. */
function Tof(b,side,i){const d=FACTIONS[b.f[side]].units[i];return d.sp*(b.m[side].c||1)*(FACTIONS[b.f[side]].sm||1)}
function canSpawn(b,side,i){return !b.over&&b.clock[side]>=Tof(b,side,i)}
function spawn(b,side,i,lane){
 if(!canSpawn(b,side,i))return false;
 const d=FACTIONS[b.f[side]].units[i];if(!d)return false;
 for(let k=0;k<(d.cnt||1);k++)addUnit(b,side,d,lane,k);
 b.clock[side]=0;
 evt(b,{e:'spawn',side,k:d.k,n:d.n,fk:b.f[side],lane});return true}
function charge(b,side,ui){
 if(b.over||b.ch[side]<chAt(b,side))return false;if(ui==null)ui=b.use[side][0];if(!canSpawn(b,side,ui))return false;
 const d=FACTIONS[b.f[side]].units[ui];if(!d)return false;b.ch[side]=0;b.clock[side]=0;b.bw=b.bw||{L:0,R:0};b.bw[side]=10;
 for(let l=0;l<LANES;l++)for(let k=0;k<(d.cnt||1);k++)addUnit(b,side,d,l,k);
 evt(b,{e:'charge',side,fk:b.f[side]});return true}
/* v0.24: Fernkaempfer reichen jetzt proportional zur Feldlaenge (am PC 4x, am Handy unveraendert: die Reichweite folgt dem Lauftempo, damit PC und Handy gleich spielen). Damit sie dadurch nicht uebermaechtig werden, sinkt ihr Schaden mit der Reichweite. */
const RDK=0.12;
function dmgOf(b,u,t){
 const d=u.d,m=b.m[u.side],tm=b.m[t.side];
 if(tm.dg&&Math.random()<tm.dg)return 0;
 let dm=d.dmg*Math.sqrt(d.i<3?(FACTIONS[b.f[u.side]].pw||1):(FACTIONS[b.f[u.side]].pwx||1))*(m.a||1)*((m.ua&&m.ua[u.cls])||1)*(u.rez?(m.rsd||1):1)*((m.un&&m.un[d.n])||1)*(.9+Math.random()*.2);
  if(m.br)dm*=1+Math.min(.25,m.br*b.kills[u.side]);
  if(u.wbf&&m.wb)dm*=1+m.wb;if(u.bnf&&m.bn)dm*=1+m.bn;
  if(b.bw&&m.bw&&b.bw[u.side]>0)dm*=1+m.bw;
 const fp=FACTIONS[b.f[u.side]].pas,tp=FACTIONS[b.f[t.side]].pas;
 if(fp==='orc'&&u.hp<u.mhp*.5)dm*=1.4;
 if(fp==='elf'&&d.rng>100)dm*=1.06;
 if(t.d.tag==='cav'){if(d.tag==='pike')dm*=1.35*(m.pk||1);else if(d.k==='sword')dm*=.9}
 if(d.tag==='cav'&&u.first)dm*=(fp==='human'?2:1.8)*(m.fs||1);
 if(tp==='dwarf')dm*=.9;
 if(d.rng>100&&d.k!=='mage'){if(t.sh)dm*=.7*(tm.sh||1);else if(t.d.arm<=10){dm*=1.15;if(Math.random()<.08)dm*=1.8}}
 if(d.rng>100&&b.rm>1)dm*=1/(1+(b.rm-1)*RDK);
 if(m.cr&&d.rng<=100&&Math.random()<m.cr)dm*=2;
 if(b.bw&&tm.bwd&&b.bw[t.side]>0)dm*=1-tm.bwd;
 return dm*100/(100+Math.max(0,t.d.arm*(1-(m.ap||0)))+(tm.r||0)+((tm.ra&&tm.ra[t.cls])||0)+(t.mv?0:(tm.fo||0)))}
/* KI: Schwierigkeit aendert NICHT die Einheitenwerte, nur wie klug/aufmerksam gespielt wird. */
function pickLane(b,side,sk,info){
 let lane=Math.floor(Math.random()*LANES);
 if(Math.random()<sk*.8){const mx=Math.max(...info.map(x=>x.thr));
  if(mx>.45&&Math.random()<.7)lane=info.findIndex(x=>x.thr===mx);
  else{let best=-1e9;for(let l=0;l<LANES;l++){const s=info[l].mine*.5-info[l].e*.7+Math.random()*1.2;if(s>best){best=s;lane=l}}}}
 return lane}
function uscore(d,I){let s=0;
 if(I.cav>0&&d.tag==='pike')s+=2.2;
 if(I.rng>0&&(d.spd>=80||d.k==='cav'))s+=1.4;
 if(I.hv>0&&d.rng>100)s+=1.2;
 if(I.e===0&&d.spd>=80)s+=.8;
 if(I.mine>=2&&d.rng>100)s+=1.0;
 if(I.mine===0&&I.e>0&&d.rng<=100&&d.arm>=30)s+=1.0;
 return s}
/* ---------- v0.39: KI-Strategien ----------
   Jede KI waehlt zu Beginn eine Strategie (Masse, Elite, Fernkampf, Reiter, Konter, Ausgewogen), liest die Armee des Gegners
   und wechselt, wenn sie zurueckliegt oder zufaellig. In der Kampagne merkt sie sich pro Volk, was zuletzt funktioniert hat. */
function aiRole(d){return{fast:d.sp<=3.2,elite:d.sp>=5.5,rng:d.rng>100&&d.k!=='mage',mage:d.k==='mage',tank:d.arm>=40||d.hp>=120,cav:d.k==='cav'||d.k==='scout'||d.spd>=80}}
function aiPow(d){return d.hp*(1+d.arm/100)*d.dmg/Math.max(.3,d.cd)}
function aiCtx(b,side){const c={foeN:0,foeRng:0,foeHeavy:0,foeCav:0,mineN:0,mineRng:0,mineTank:0,mineFast:0};
 for(const u of b.units){if(u.hp<=0)continue;const d=u.d,r=aiRole(d);
  if(u.side!==side){c.foeN++;if(d.rng>100)c.foeRng++;if(d.hp>=200||d.arm>=70)c.foeHeavy++;if(r.cav)c.foeCav++}
  else{c.mineN++;if(r.rng)c.mineRng++;if(r.tank&&!r.rng)c.mineTank++;if(r.fast)c.mineFast++}}
 return c}
function aiPick(a,use,f,excl,boost){const R=use.map(i=>aiRole(f.units[i])),has=k=>R.some(r=>r[k]);
 const W={Masse:1,Elite:.9,Fernkampf:has('rng')?.9:0,Reiter:has('cav')?.7:0,Konter:.5+a.d,Ausgewogen:1};
 for(const e of excl||[])if(W[e])W[e]*=.12;if(boost)for(const k in boost)if(W[k])W[k]*=boost[k];
 const ks=Object.keys(W),tot=ks.reduce((x,k)=>x+W[k],0);let r0=Math.random()*tot;for(const k of ks){r0-=W[k];if(r0<=0)return k}return 'Ausgewogen'}
function aiInit(b,side,a,use,f){let excl=[],boost=null;const m=b.mem;
 if(m&&m.last&&m.last.length){if(m.aiWon){boost={};boost[m.last[m.last.length-1]]=1.6}else{excl=m.last.slice(-2);boost={Konter:1.7,Elite:1.3}}}
 const n=aiPick(a,use,f,excl,boost);a.S={n,rev:b.t+9+Math.random()*8,hist:[n]}}
function aiReview(b,side,a,use,f){const S=a.S,share=side==='L'?b.bar:100-b.bar;S.rev=b.t+9+Math.random()*9;
 const losing=share<45,vary=Math.random()<.12*(.3+a.d);
 if((losing&&Math.random()<.75)||vary){const n=aiPick(a,use,f,[S.n],losing?{Konter:2,Elite:1.4}:null);if(n!==S.n){S.n=n;S.hist.push(n);a.want=null}}}
function aiStratScore(a,d,ctx,t){const r=aiRole(d),n=a.S.n,ramp=Math.min(1,t/18);let s=0;
 if(n==='Masse'){if(r.fast)s+=1.6;if(r.elite)s-=.8}
 else if(n==='Elite'){if(r.elite)s+=.4+2*ramp;if(r.fast)s-=ramp}
 else if(n==='Fernkampf'){if(r.rng||r.mage)s+=1.8;if(r.tank&&!r.rng)s+=.7;if(r.fast&&!r.tank)s-=.4;if(ctx.mineTank<ctx.mineRng*1.2&&r.tank&&!r.rng)s+=1}
 else if(n==='Reiter'){if(r.cav)s+=2;if(r.elite&&!r.cav)s-=.3}
 else if(n==='Konter'){s+=aiReact(a,d,ctx,2)}
 else{if(r.rng&&ctx.mineRng<ctx.mineN*.25)s+=1;if(r.tank&&ctx.mineTank<ctx.mineN*.3)s+=.8;if(r.fast&&ctx.mineFast>ctx.mineN*.5)s-=.8;if(r.elite)s+=.4}
 if(n!=='Konter')s+=aiReact(a,d,ctx,1);return s}
function aiReact(a,d,ctx,k){const g=(.3+a.d)*k;let s=0; // reaction to the opponent's army
 if(ctx.foeN>=3&&ctx.foeRng/ctx.foeN>.45){if(d.spd>=80||d.k==='cav')s+=1.5*g;if(d.arm>=40)s+=1*g}
 if(ctx.foeN>=2&&ctx.foeHeavy/ctx.foeN>.3){if(d.dmg>=18||d.rng>100)s+=1*g}
 if(ctx.foeN>=2&&ctx.foeCav/ctx.foeN>.35&&d.tag==='pike')s+=1.8*g;
 return s}
function runAI(b,side,dt){
 const a=b.ai[side];if(!a)return;a.t-=dt;if(a.t>0)return;
 const sk=a.d,use=b.use[side],f=FACTIONS[b.f[side]];
 const info=[];for(let l=0;l<LANES;l++)info.push({thr:0,e:0,cav:0,rng:0,hv:0,mine:0,eW:0,mW:0});
 for(const u of b.units){if(u.hp<=0)continue;const I=info[u.lane],w=u.d.hp*(u.d.dmg+3)/600;
  if(u.side!==side){const prog=side==='L'?u.x/b.FW:1-u.x/b.FW;I.thr+=(.35+.65*Math.pow(1-prog,1.5))*(1+u.d.dmg/15);I.e++;I.eW+=w;if(u.d.k==='cav'||u.d.tag==='cav')I.cav++;if(u.d.rng>100)I.rng++;if(u.d.hp>=200||u.d.arm>=70)I.hv++}
  else{I.mine++;I.mW+=w}}
 // Bedarf: Bahn, in der der Gegner staerker ist als wir (jeder Gegner in einer Bahn zaehlt)
 let need=-1e9,nl=0;for(let l=0;l<LANES;l++){const n=info[l].eW-info[l].mW*.8+info[l].thr*.15;if(n>need){need=n;nl=l}}
 const threatened=need>.8;
 if(!a.S)aiInit(b,side,a,use,f);else if(b.t>=a.S.rev)aiReview(b,side,a,use,f);
 const ctx=aiCtx(b,side);
 const rdy=use.filter(i=>canSpawn(b,side,i)),S=a.S,share0=side==='L'?b.bar:100-b.bar;
 if(b.ch[side]>=chAt(b,side)&&rdy.length&&Math.random()<.25+.5*sk){
  const press=threatened||share0<42,pw=i=>aiPow(f.units[i]),by=(arr,fn)=>arr.reduce((x,y)=>fn(y)>fn(x)?y:x,arr[0]);let pick=-1;
  if(S.n==='Reiter'){const fu=rdy.filter(i=>aiRole(f.units[i]).cav);pick=fu.length?by(fu,i=>f.units[i].spd*(1+f.units[i].hp/300)):(press?by(rdy,pw):-1)} // tempo charge
  else if(S.n==='Masse'||S.n==='Ausgewogen'){pick=(press||Math.random()<.5)?by(rdy,pw):-1}
  else{const tgt=by(use,pw);if(rdy.includes(tgt))pick=tgt;else if(press||b.t-(a.chW||(a.chW=b.t))>22)pick=by(rdy,pw)} // power charge: wait for the strongest unit
  if(pick>=0&&charge(b,side,pick)){a.chW=null;a.t=.2;return}}
 // v0.24 Verteidigung: wer bedroht wird oder zurueckliegt, wartet nicht auf eine langsame Einheit, sondern ruft die beste, die (fast) bereit ist
 if(a.want!=null&&use.includes(a.want)){const rem=Tof(b,side,a.want)-b.clock[side],share=side==='L'?b.bar:100-b.bar;
  if((threatened||share<42)&&rem>1.1&&Math.random()<.4+.5*sk){const near=use.filter(i=>Tof(b,side,i)-b.clock[side]<=.35);
   if(near.length){const I0=info[nl];let bi=near[0],bs=-1e9;for(const i of near){const sc=uscore(f.units[i],I0)+Math.random()*.6;if(sc>bs){bs=sc;bi=i}}a.want=bi}}}
 // Plan: Einheit waehlen und warten, bis ihre Zeit erreicht ist (die Uhr laeuft fuer die KI genauso)
 if(a.want==null||!use.includes(a.want)){
  const lane=(threatened&&Math.random()<.3+.5*sk)?nl:pickLane(b,side,sk,info),I=info[lane];
  const w=use.map(i=>{const d=f.units[i];let s=uscore(d,I);if(need>1.2&&d.t>.5)s+=.8;s+=(3.4-Math.min(9,d.sp))*.28*(.4+sk);return Math.exp(s*(.4+sk)*1.3+aiStratScore(a,d,ctx,b.t)*(.3+.8*sk)+(Math.random()-.5)*(1-sk))});
  const tot=w.reduce((x,y)=>x+y,0);let r0=Math.random()*tot;a.want=use[0];
  for(let q=0;q<use.length;q++){r0-=w[q];if(r0<=0){a.want=use[q];break}}}
 if(!canSpawn(b,side,a.want)){a.t=.12;return}
 if(!a.hes){a.hes=true;a.t=1.1*Math.pow(1-sk,1.5)*(.4+Math.random()*1.2);if(a.t>.05)return}
 a.hes=false;spawn(b,side,a.want,(threatened&&Math.random()<.4+.4*sk)?nl:pickLane(b,side,sk,info));a.want=null;a.t=.1}
function advance(b,u,dt){const dir=u.side==='L'?1:-1,d=u.d,m=b.m[u.side];
 u.x+=dir*d.spd*dt*b.mm*(m.s||1)*((m.us&&m.us[u.cls])||1);u.mv=true;u.wt+=dt*d.spd*b.mm*.11;
 if((u.side==='L'&&u.x>=b.FW-BX)||(u.side==='R'&&u.x<=BX)){
  b.bar+=(u.side==='L'?GAIN:-GAIN);u.hp=-999;u.reached=true;
  b.fx.push({k:'r',x:u.side==='L'?b.FW-BX:BX,lane:u.lane,t:.5,max:.5,side:u.side});
  evt(b,{e:'reach',side:u.side})}}
function step(b,dt){
 for(const f of b.fx)f.t-=dt;b.fx=b.fx.filter(f=>f.t>0);
 if(b.over)return;
 b.t+=dt;b.clock.L+=dt;b.clock.R+=dt;if(b.bw){b.bw.L-=dt;b.bw.R-=dt}
 runAI(b,'L',dt);runAI(b,'R',dt);
 for(const s of ['L','R']){const m=b.m[s];if(!(m.wb||m.bn))continue;
  for(const u of b.units){if(u.side!==s)continue;u.wbf=0;u.bnf=0;
   for(const a of b.units){if(a.side!==s||a.hp<=0||a.lane!==u.lane||Math.abs(a.x-u.x)>=(a.cls==='mage'?magR(b,a):AURA))continue;
    if(m.wb&&a.cls==='mage')u.wbf=1;if(m.bn&&(a.d.n==='Ritter'||a.d.n==='Paladin'))u.bnf=1}}}
  for(const s of ['L','R']){const m=b.m[s];if(!m.pt)continue;const o=s==='L'?'R':'L';
   for(const e of b.units){if(e.side!==o||e.hp<=0)continue;for(const a of b.units){if(a.side===s&&a.hp>0&&a.lane===e.lane&&Math.abs(a.x-e.x)<PEST_R){e.hp-=m.pt*e.mhp*dt;e.lk=GORE_PEST;break}}}}
  for(const s of ['L','R']){const m=b.m[s];if(!(m.hl||m.rg||m.bg))continue;for(const u of b.units){if(u.side!==s||u.hp<=0||u.hp>=u.mhp)continue;let g=m.rg||0;if(m.bg&&u.cls==='big')g+=m.bg;if(m.hl){for(const mg of b.units){if(mg.side===s&&mg.cls==='mage'&&mg.hp>0&&mg.lane===u.lane&&Math.abs(mg.x-u.x)<magR(b,mg)){g+=m.hl;break}}}if(g)u.hp=Math.min(u.mhp,u.hp+g*u.mhp*dt)}}
 const by=[];for(let l=0;l<LANES;l++)by.push({L:[],R:[]});
 for(const u of b.units){u.att=0;by[u.lane][u.side].push(u)}
 for(const u of b.units){
  if(u.hp<=0)continue;
  u.cd-=dt;u.hit-=dt;u.anim-=dt;u.mv=false;
  const d=u.d,m=b.m[u.side],R=d.rng*(d.rng>100?b.rm:1)*((m.ur&&m.ur[u.cls])||1),foes=by[u.lane][u.side==='L'?'R':'L'];
  const ranged=d.rng>100;let tgt=null,best=1e9,near=1e9;
  for(const e of foes){if(e.hp<=0)continue;const dist=Math.abs(e.x-u.x);if(dist<near)near=dist;
   if(dist<=R&&dist<best&&(ranged||e.att<MAXATT)){best=dist;tgt=e}}
  if(tgt){
   if(!ranged)tgt.att++;
   if(u.cd<=0){
    let hit=true;if(d.k==='bow'){const dist=Math.abs(tgt.x-u.x);hit=Math.random()<Math.max(.35,Math.min(.97,(d.acc||.8)+(m.hk||0)-.12*dist/R))}
    if(hit){tgt.hp-=dmgOf(b,u,tgt);tgt.hit=.15;tgt.lk={w:goreWeapon(b.f[u.side],d),th:!!d._gth,dx:u.side==='L'?1:-1,ov:-tgt.hp/tgt.mhp,ox:d.k==='mage'?FACTIONS[b.f[u.side]].orb:null}}
    u.cd=d.cd*((m.cdm&&m.cdm[u.cls])||1);u.am=ranged?.5:.32;u.anim=u.am;u.first=false;
    const tx=hit?tgt.x:tgt.x+(Math.random()<.5?-1:1)*(25+Math.random()*55);
    if(ranged){if(b.fx.length<200)b.fx.push({k:'a',x1:u.x,x2:tx,lane:u.lane,yo:u.yo,t:.48,max:.48,dly:.3,side:u.side,orb:d.k==='mage'?1:0,thr:d.n==='Axtwerfer'?'axe':d.n==='Hammerwerfer'?'hammer':d.n==='Speerwerfer'?'spear':'',fk:b.f[u.side]});
     evt(b,{e:'shot',k:d.k,n:d.n,fk:b.f[u.side],x:u.x,side:u.side,miss:!hit})}
    else evt(b,{e:'swing',k:d.k,n:d.n,fk:b.f[u.side],x:u.x,side:u.side,big:d.k==='big'||d.k==='ent'});
   }
   else if(d.k==='bow'&&u.anim<=0&&u.cd>.12&&near>R*.35)advance(b,u,dt);
  }else if(near>R)advance(b,u,dt);
 }
 for(const u of b.units){
  if(u.hp<=0&&!u.reached){
   const ks=u.side==='L'?'R':'L';b.kills[ks]++;b.ch[ks]=Math.min(chAt(b,ks),b.ch[ks]+(u.d.k==='big'?2:1));
   if(!goreSpawn(b,u))b.fx.push({k:'c',x:u.x,lane:u.lane,yo:u.yo,side:u.side,d:u.d,ph:u.ph,t:4,max:4});
   evt(b,{e:'die',n:u.d.n,fk:b.f[u.side],x:u.x,side:u.side,big:u.d.k==='big'||u.d.k==='ent'});
   if(FACTIONS[b.f[u.side]].pas==='undead'&&!u.rez&&Math.random()<.25+(b.m[u.side].rz||0)){
    addUnit(b,u.side,FACTIONS.undead.units[0],u.lane,0,u.x,.5*(b.m[u.side].rsh||1),true)}
  }}
 b.units=b.units.filter(u=>u.hp>0);
 if(b.bar>=100){b.bar=100;b.over=true;b.winner='L';b.reason='bar'}
 else if(b.bar<=0){b.bar=0;b.over=true;b.winner='R';b.reason='bar'}
 else if(b.t>=b.time){b.over=true;b.reason='time';b.winner=b.bar>50?'L':b.bar<50?'R':'draw'}
}
//CORE_END

const STY={
humans:{skin:'#e3b48c',cloth:'#3b82f6',metal:'#c3ccd6',hair:'#6b4a2b'},
elves:{skin:'#f0cca8',cloth:'#2f9e5b',metal:'#9db39a',hair:'#ead67c'},
orcs:{skin:'#7aa648',cloth:'#a33326',metal:'#6e6e74',hair:'#1c1c1c'},
dwarves:{skin:'#d9a07c',cloth:'#c58b17',metal:'#9aa3ae',hair:'#b4601f'},
undead:{skin:'#e3dfcb',cloth:'#4f2f78',metal:'#585866',hair:'#000'}};
const FPROP={humans:{h:1,w:1,hs:1},elves:{h:1.08,w:.8,hs:.95},orcs:{h:1.1,w:1.3,hs:1.12,hunch:.15},dwarves:{h:.8,w:1.32,hs:1.18},undead:{h:1,w:.78,hs:1}};
const LOOK={
'humans:Speerträger':{w:'spear',h:'cap'},'humans:Schwertkämpfer':{w:'sword',h:'plume',cp:'#9b2d2d'},'humans:Bogenschütze':{w:'bow',h:'hood',t:'#6a7f3a'},'humans:Reiter':{w:'spear',h:'plume',m:'horse'},
'humans:Hellebardier':{w:'halberd',h:'sallet',t:'#7a8fb0'},'humans:Armbrustschütze':{w:'xbow',h:'coif',t:'#8a6a3a'},'humans:Gardist':{w:'sword',h:'plate',hv:1,cp:'#9b2d2d'},
'humans:Hofmagier':{w:'mage',h:'hat',t:'#5a3aa8'},'humans:Ritter':{w:'spear',h:'plate',hv:1,m:'warhorse',cp:'#9b2d2d'},'humans:Paladin':{w:'maul',h:'plate',hv:1,t:'#e8dca8',cp:'#f2f2f2'},
'elves:Späher':{w:'dagger',h:'hood',t:'#2a5a3a'},'elves:Waldläufer':{w:'bow',h:'feather',t:'#3a6a2a'},'elves:Speerelf':{w:'spear',h:'circlet'},'elves:Hainwächter':{w:'glaive',h:'antler',hv:1,t:'#4a8a4a'},
'elves:Dolchtänzer':{w:'dagger2',h:'none',t:'#6aa86a'},'elves:Dornenwächter':{w:'spear',h:'coif',t:'#3a7a5a'},'elves:Falkenschütze':{w:'bow',h:'band',t:'#9a7a3a'},
'elves:Druide':{w:'mage',h:'antler',t:'#3a7a4a'},'elves:Hirschreiter':{w:'spear',h:'circlet',m:'deer'},'elves:Mondklinge':{w:'greatsword',h:'antler',hv:1,t:'#bcd6e8',cp:'#7ab0d8'},
'orcs:Grunzer':{w:'club',h:'mohawk'},'orcs:Axtschwinger':{w:'axe',h:'horned'},'orcs:Wolfsreiter':{w:'axe',h:'none',m:'wolf'},'orcs:Troll':{w:'club',h:'none'},
'orcs:Plünderer':{w:'dagger2',h:'bandana',t:'#6a3a2a'},'orcs:Speerwerfer':{w:'jav',h:'fur',t:'#8a6a3a'},'orcs:Schwarzork':{w:'axe2',h:'plate',hv:1,t:'#3a2a2a',cp:'#2a0a0a'},
'orcs:Schamane':{w:'mage',h:'skull',t:'#7a2f1a'},'orcs:Eberreiter':{w:'axe',h:'horned',m:'boar'},'orcs:Kriegsherr':{w:'spikemaul',h:'horned',hv:1,cp:'#5a1a1a'},
'dwarves:Hammerträger':{w:'hammer',h:'sallet'},'dwarves:Armbrustschütze':{w:'xbow',h:'coif',t:'#8a5a2a'},'dwarves:Axtkämpfer':{w:'axe',h:'pot'},'dwarves:Eisenwächter':{w:'axe2',h:'plate',hv:1},
'dwarves:Minenarbeiter':{w:'pick',h:'lamp',t:'#7a5a2a'},'dwarves:Thane':{w:'hammer',h:'horned',hv:1,cp:'#7a1a1a'},'dwarves:Büchsenschütze':{w:'gun',h:'cap',t:'#5a4a3a'},
'dwarves:Runenschmied':{w:'mage',h:'hood',t:'#a86a1a'},'dwarves:Widderreiter':{w:'hammer',h:'horned',m:'ram',hv:1},'dwarves:Eisenbrecher':{w:'maul',h:'horned',hv:1,cp:'#3a3a4a'},
'undead:Skelette':{w:'sword',h:'cap',t:'#6a6a60'},'undead:Knochenbogen':{w:'bow',h:'band'},'undead:Ghul':{w:'claw',h:'none',gh:1},'undead:Knochenriese':{w:'club',h:'none'},
'undead:Wiedergänger':{w:'sword',h:'pot',t:'#5a5a4a'},'undead:Pestschleuder':{w:'jav',h:'hood',t:'#4a6a3a'},'undead:Schädelbrecher':{w:'axe',h:'horned'},
'undead:Nekromant':{w:'mage',h:'hood',t:'#2a1a3a'},'undead:Gruftreiter':{w:'sword',h:'none',m:'skhorse'},'undead:Todesritter':{w:'greatsword',h:'plate',hv:1,cp:'#2a1a3a'},
'orcs:Axtwerfer':{w:'axejav',h:'band',t:'#7a2a1a'},'dwarves:Axtwerfer':{w:'axejav',h:'fur',t:'#6a4a2a'},'dwarves:Hammerwerfer':{w:'hammerjav',h:'lamp',t:'#7a3a1a'}};
const MT={horse:{seat:.64,by:.46,rx:.44,ry:.17,col:'#e9e5da'},warhorse:{seat:.66,by:.47,rx:.46,ry:.18,col:'#cfd3d8'},deer:{seat:.68,by:.5,rx:.4,ry:.14,col:'#a8754a'},
 wolf:{seat:.5,by:.34,rx:.4,ry:.14,col:'#6d6d78'},boar:{seat:.5,by:.31,rx:.4,ry:.19,col:'#4a3426'},ram:{seat:.52,by:.34,rx:.38,ry:.19,col:'#e2dccb'},skhorse:{seat:.64,by:.46,rx:.44,ry:.15,col:'#cfc9b2'}};
function mixc(a,b,t){const pa=parseInt(a.slice(1),16),pb=parseInt(b.slice(1),16);const f=(i)=>Math.max(0,Math.min(255,Math.round(((pa>>i)&255)*(1-t)+((pb>>i)&255)*t)));return '#'+((1<<24)|(f(16)<<16)|(f(8)<<8)|f(0)).toString(16).slice(1)}
const dk=(c,t)=>mixc(c,'#000000',t),lt=(c,t)=>mixc(c,'#ffffff',t);
const eo=x=>1-Math.pow(1-x,2),ei=x=>x*x;
function limb(c,x1,y1,x2,y2,w,col){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()}
function leg(c,hx,hy,H,a,bend,col,boot,W){const t=H*.22,kx=hx+Math.sin(a)*t,ky=hy+Math.cos(a)*t,a2=a-bend,fx=kx+Math.sin(a2)*t,fy=ky+Math.cos(a2)*t;
 limb(c,hx,hy,kx,ky,H*.095*W,col);limb(c,kx,ky,fx,fy,H*.075*W,col);c.fillStyle=boot;c.beginPath();c.ellipse(fx+H*.03,fy,H*.06,H*.03,0,0,7);c.fill()}
