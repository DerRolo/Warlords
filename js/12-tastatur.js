/* Tastatursteuerung */
/* ===== v0.25: Tastatursteuerung in allen Bildschirmen (W A S D / Pfeile, Leertaste, Esc) ===== */
(function(){
 const $q=s=>document.querySelector(s);
 const vis=el=>{if(!el||el.disabled)return false;const r=el.getBoundingClientRect();return r.width>2&&r.height>2&&getComputedStyle(el).visibility!=='hidden'};
 const dirOf=k=>{k=k.length===1?k.toLowerCase():k;return k==='a'||k==='ArrowLeft'?'l':k==='d'||k==='ArrowRight'?'r':k==='w'||k==='ArrowUp'?'u':k==='s'||k==='ArrowDown'?'d':null};
 function best(from,list,dir){const c=r=>[r.left+r.width/2,r.top+r.height/2],a=c(from.getBoundingClientRect());let b=null,bs=1e18;
  for(const e of list){if(e===from)continue;const q=c(e.getBoundingClientRect()),dx=q[0]-a[0],dy=q[1]-a[1];let p,o;
   if(dir==='l'){p=-dx;o=dy}else if(dir==='r'){p=dx;o=dy}else if(dir==='u'){p=-dy;o=dx}else{p=dy;o=dx}
   if(p<=2)continue;const s=p*p+4*o*o;if(s<bs){bs=s;b=e}}
  return b}
 const BACK={sCM:'#cmBack',sPick:'#pBack',sOpt:'#oBack',sMus:'#muBack',sHow:'#hBack'};
 function moveFocus(root,dir){
  const all=[...root.querySelectorAll('button,input,select')].filter(vis);if(!all.length)return;
  let a=document.activeElement;if(!all.includes(a)){all[0].focus();all[0].scrollIntoView({block:'nearest'});return}
  const n=best(a,all,dir);if(n){n.focus();n.scrollIntoView({block:'nearest',inline:'nearest'})}}
 function activate(){const a=document.activeElement;if(!a||a===document.body)return false;
  if(a.tagName==='BUTTON'||(a.tagName==='INPUT'&&a.type==='checkbox')){a.click();return true}return false}
 function adjust(a,dir){ // links/rechts auf Reglern und Auswahlfeldern
  if(a&&a.tagName==='INPUT'&&a.type==='range'){const st=+a.step||1,m=Math.max(1,Math.round((+a.max-+a.min)/20));a.value=+a.value+(dir==='r'?m:-m);a.dispatchEvent(new Event('input',{bubbles:true}));return true}
  if(a&&a.tagName==='SELECT'){a.selectedIndex=Math.max(0,Math.min(a.options.length-1,a.selectedIndex+(dir==='r'?1:-1)));a.dispatchEvent(new Event('change',{bubbles:true}));return true}
  return false}
 function mapNav(dir){
  const D=genMapData();let from=selNode;if(from<0){from=capIdx();selNode=from;tintDirty=true;renderSel();closeCapital();return}
  const c=D.cent,a=c[from];let b=-1,bs=1e18;
  for(let i=0;i<D.NS;i++){if(i===from)continue;const dx=c[i][0]-a[0],dy=c[i][1]-a[1];let p,o;
   if(dir==='l'){p=-dx;o=dy}else if(dir==='r'){p=dx;o=dy}else if(dir==='u'){p=-dy;o=dx}else{p=dy;o=dx}
   if(p<=1)continue;const s=p*p+3*o*o;if(s<bs){bs=s;b=i}}
  if(b<0)return;selNode=b;tintDirty=true;renderSel();closeCapital();
  const sc=$q('#mapScroll'),r=mapBaseW*zoom/MW,x=c[b][0]*r,y=c[b][1]*r,m=70;
  if(x<sc.scrollLeft+m||x>sc.scrollLeft+sc.clientWidth-m||y<sc.scrollTop+m||y>sc.scrollTop+sc.clientHeight-m)sc.scrollTo({left:x-sc.clientWidth/2,top:y-sc.clientHeight/2,behavior:'smooth'})}
 function capNav(dir){
  const tiles=[...document.querySelectorAll('#capTiles .tile,#capTiles .ftab')].filter(vis);if(!tiles.length)return;
  const cur=document.activeElement&&document.activeElement.classList&&document.activeElement.classList.contains('ftab')&&dir!=='l'&&dir!=='r'?document.activeElement:(document.querySelector('#capTiles .tile.sel')||tiles[0]),n=best(cur,tiles,dir);
  if(n){n.click();const s=document.querySelector('#capTiles .tile.sel');if(s)s.scrollIntoView({block:'nearest',inline:'nearest'})}}
 function onKey(e){
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key,dir=dirOf(k),go=(k===' '||k==='Enter'),esc=k==='Escape';
  if(!(dir||go||esc))return;
  const done=()=>{e.preventDefault();e.stopImmediatePropagation()};
  if(cur==='sBattle'){ // Ergebnis: Leertaste geht weiter
   if($q('#res').classList.contains('on')&&go){done();$q('#resB').click()}
   return}
  if(cur==='sCamp'){
   if($q('#modal').classList.contains('on')){
    const A=$q('#mdA'),Bb=$q('#mdB'),hasB=Bb.style.display!=='none';
    if(dir==='l'||dir==='r'||dir==='u'||dir==='d'){done();if(hasB)(document.activeElement===A?Bb:A).focus();else A.focus()}
    else if(go){done();(document.activeElement===Bb&&hasB?Bb:A).click()}
    else if(esc&&hasB){done();Bb.click()}
    return}
   if($q('#capPanel').classList.contains('on')){
    if(esc){done();closeCapital();return}
    if(dir){done();capNav(dir);return}
    if(go){done();const b=$q('#capInfo .iact button:not([disabled])');if(b)b.click();return}
    return}
   if(esc){done();$q('#cBack').click();return}
   if(dir){done();mapNav(dir);return}
   if(go){done();if(selNode<0)return;if(selNode===capIdx())openCapital();else{const b=$q('#atkTab');if(b&&b.style.display!=='none')b.click()}return}
   return}
  if(cur==='sMenu'){if(dir||go){const root=$q('#sMenu');if(dir){done();moveFocus(root,dir)}else if(activate())done();else{done();moveFocus(root,'d')}}return}
  const root=document.getElementById(cur);if(!root)return;
  if(esc){const b=BACK[cur]&&$q(BACK[cur]);if(b){done();b.click()}return}
  if(cur==='sPick'){
   const a=document.activeElement,inRow=a&&a.closest&&a.closest('#pModeRow,#pDiff');
   if((dir==='l'||dir==='r')&&!inRow){done();$q(dir==='l'?'#pPrev':'#pNext').click();return}
   if(dir){done();moveFocus(root,dir);return}
   if(go){done();if(a&&a.tagName==='BUTTON'&&root.contains(a)&&a.id!=='pPrev'&&a.id!=='pNext')a.click();else $q('#pGo').click();return}
   return}
  if(dir){const a=document.activeElement;if((dir==='l'||dir==='r')&&adjust(a,dir)){done();return}done();moveFocus(root,dir);return}
  if(go){if(activate())done();else{done();moveFocus(root,'d')}}}
 window.addEventListener('keydown',onKey,true);
 window.addEventListener('keyup',e=>{if(e.key===' '&&cur!=='sBattle')e.preventDefault()},true);
})();
