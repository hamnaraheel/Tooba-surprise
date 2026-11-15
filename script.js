(function(){
const NAME='Bc';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const steps=$$('.step'); let cur=0, maxSeen=0;

/* stepper */
const stepper=$('#stepper');
steps.forEach((_,i)=>{const b=document.createElement('button');b.textContent=String(i).padStart(2,'0');b.setAttribute('aria-label','Go to step '+i);b.onclick=()=>{if(i<=maxSeen)go(i)};stepper.appendChild(b)});
function go(i){
  cur=i;maxSeen=Math.max(maxSeen,i);
  steps.forEach((s,k)=>s.classList.toggle('on',k===i));
  $$('button',stepper).forEach((b,k)=>{b.classList.toggle('on',k===i);b.classList.toggle('done',k<i||(k<=maxSeen&&k!==i))});
  document.body.classList.toggle('dark',i===6);
  if(i===3)typeLetter(); if(i===5)startHeart(); if(i===6)burst();
  steps[i].scrollTop=0;
}
$$('[data-next]').forEach(b=>b.addEventListener('click',()=>{startMusic();go(Math.min(cur+1,6))}));

/* calendar Nov 2013: Nov 1 = Friday, 16 = Saturday */
const cal=$('#cal');
'SMTWTFS'.split('').forEach(d=>{const b=document.createElement('b');b.textContent=d;cal.appendChild(b)});
for(let i=0;i<5;i++)cal.appendChild(document.createElement('span'));
for(let d=1;d<=30;d++){const s=document.createElement('span');s.textContent=d;if(d===16){s.className='hit';s.innerHTML='16<i>Your Day</i>'}cal.appendChild(s)}

/* letter */
const LETTER=`Dear ${NAME},\n\nMay every single day of your life bring you immense joy, success, and endless reasons to smile.\n\nWishing you a lifetime of love and beautiful memories.`;
let typed=false,typer;
function typeLetter(){
  const el=$('#letter');
  if(typed){return}
  typed=true;el.textContent='';el.classList.add('caret');let i=0;
  typer=setInterval(()=>{el.textContent=LETTER.slice(0,++i);if(i>=LETTER.length){clearInterval(typer);el.classList.remove('caret');$('#letterNext').classList.add('show')}},38);
}

/* balloons */
const WISHES=['May you always have a reason to smile. ❤️','May your dreams become beautiful realities. ✨','May happiness follow you everywhere. 🤍','May every year make your life even more beautiful. 🌸','May you always be surrounded by love. ❤️','May this birthday be your happiest chapter. 🎂'];
const COL=[['#f06a8a','#c2294f'],['#ffb3c4','#e0587a'],['#d6304f','#8c1230'],['#f27a96','#b81f45'],['#a3122f','#5a0a1e'],['#f8a6ba','#d4456a']];
let popped=0;
function buildBalloons(){
  const box=$('#balloons');box.innerHTML='';popped=0;$('#afterB').classList.remove('show');
  WISHES.forEach((w,i)=>{
    const slot=document.createElement('div');slot.className='slot';
    slot.innerHTML=`<div class="card">${w}</div><button class="balloon" aria-label="Pop balloon ${i+1}" style="--c:${COL[i][0]};--d:${COL[i][1]};--t:${i*.35}s"></button>`;
    const b=$('.balloon',slot),c=$('.card',slot);
    b.onclick=()=>{b.classList.add('pop');setTimeout(()=>{b.remove();c.classList.add('show')},250);if(++popped===6)setTimeout(()=>$('#afterB').classList.add('show'),700)};
    box.appendChild(slot);
  });
}
buildBalloons();

/* falling petals */
const pc=$('#petals'),px=pc.getContext('2d');let W,H,P=[];
function size(){const r=devicePixelRatio||1;W=pc.width=innerWidth*r;H=pc.height=innerHeight*r;px.setTransform(1,0,0,1,0,0)}
addEventListener('resize',size);size();
for(let i=0;i<26;i++)P.push({x:Math.random(),y:Math.random(),r:2+Math.random()*4,v:.0006+Math.random()*.0012,s:Math.random()*6});
(function loop(t){px.clearRect(0,0,W,H);const dk=document.body.classList.contains('dark');
  P.forEach(p=>{p.y+=p.v;if(p.y>1.05){p.y=-.05;p.x=Math.random()}const x=(p.x+Math.sin(t/1800+p.s)*.02)*W,y=p.y*H;px.fillStyle=dk?'rgba(255,140,170,.35)':'rgba(214,60,100,.5)';px.beginPath();px.ellipse(x,y,p.r*(devicePixelRatio||1),p.r*.6*(devicePixelRatio||1),p.s+t/1500,0,6.3);px.fill()});
  requestAnimationFrame(loop)})(0);

/* constellation heart */
const hc=$('#heart'),hx=hc.getContext('2d');let HP=[],hrun=false,off={x:0,y:0},tgt={x:0,y:0},hw,hh;
function heartSetup(){const r=hc.getBoundingClientRect(),d=devicePixelRatio||1;hw=hc.width=Math.max(10,r.width*d);hh=hc.height=Math.max(10,r.height*d);
  if(!HP.length){for(let i=0;i<520;i++){const t=Math.random()*Math.PI*2,k=Math.random();const hxp=16*Math.pow(Math.sin(t),3),hyp=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));const sc=.6+k*.5; HP.push({tx:hxp*sc,ty:hyp*sc,x:Math.random()*hw,y:Math.random()*hh,s:.6+Math.random()*1.6,j:Math.random()*6})}}}
function startHeart(){heartSetup();HP.forEach(p=>{p.x=Math.random()*hw;p.y=Math.random()*hh});off={x:0,y:0};tgt={x:0,y:0};if(!hrun){hrun=true;heartLoop()}}
function heartLoop(){
  if(cur!==5){hrun=false;return}
  hx.clearRect(0,0,hw,hh);const u=Math.min(hw,hh*.9)/38,cx=hw/2+off.x,cy=hh*.48+off.y;
  off.x+=(tgt.x-off.x)*.08;off.y+=(tgt.y-off.y)*.08;const t=performance.now()/1000;
  HP.forEach(p=>{const gx=cx+p.tx*u+Math.sin(t*1.4+p.j)*1.5,gy=cy+p.ty*u+Math.cos(t*1.2+p.j)*1.5;p.x+=(gx-p.x)*.035;p.y+=(gy-p.y)*.035;hx.fillStyle='rgba(205,40,85,.85)';hx.beginPath();hx.arc(p.x,p.y,p.s*(devicePixelRatio||1),0,6.3);hx.fill()});
  requestAnimationFrame(heartLoop);
}
function hmove(e){const r=hc.getBoundingClientRect(),d=devicePixelRatio||1;tgt.x=((e.clientX-r.left)-r.width/2)*d*.6;tgt.y=((e.clientY-r.top)-r.height*.48)*d*.6}
hc.addEventListener('pointermove',hmove);hc.addEventListener('pointerdown',hmove);
addEventListener('resize',()=>{if(cur===5){HP=[];heartSetup()}});

/* fireworks */
const fc=$('#fw'),fx=fc.getContext('2d');let FW=[],frun=false;
function fsize(){const r=devicePixelRatio||1;fc.width=innerWidth*r;fc.height=innerHeight*r}fsize();addEventListener('resize',fsize);
function burst(){
  if(frun)return;frun=true;let n=0;
  const launch=()=>{if(cur!==6)return;const x=Math.random()*fc.width,y=Math.random()*fc.height*.5+fc.height*.08,hue=330+Math.random()*40;
    for(let i=0;i<46;i++){const a=i/46*6.283,s=1.5+Math.random()*3.2;FW.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,h:hue})}
    setTimeout(launch,700+Math.random()*900)};
  launch();
  (function tick(){if(cur!==6){frun=false;FW=[];fx.clearRect(0,0,fc.width,fc.height);return}
    fx.clearRect(0,0,fc.width,fc.height);
    FW.forEach(p=>{p.x+=p.vx*(devicePixelRatio||1);p.y+=p.vy*(devicePixelRatio||1);p.vy+=.03;p.vx*=.985;p.l-=.011;fx.fillStyle=`hsla(${p.h},90%,72%,${Math.max(p.l,0)})`;fx.beginPath();fx.arc(p.x,p.y,2*(devicePixelRatio||1),0,6.3);fx.fill()});
    FW=FW.filter(p=>p.l>0);requestAnimationFrame(tick)})();
}
$('#replay').onclick=()=>{typed=false;$('#letterNext').classList.remove('show');buildBalloons();maxSeen=0;go(0)};

/* music: soft looping lullaby via WebAudio, starts from first tap */
let ac,on=false,timer;const mb=$('#music');
const SEQ=[392,392,440,392,523,494,0,392,392,440,392,587,523,0,392,392,784,659,523,494,440,0,698,698,659,523,587,523,0];
function note(f,t){if(!f)return;const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.06,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+.55);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+.6)}
function play(){if(!on)return;const t=ac.currentTime+.05;SEQ.forEach((f,i)=>note(f,t+i*.5));timer=setTimeout(play,SEQ.length*500+800)}
function setMusic(v){on=v;mb.classList.toggle('off',!v);clearTimeout(timer);if(v){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();play()}catch(e){on=false;mb.classList.add('off')}}}
let asked=false;function startMusic(){if(!asked){asked=true;setMusic(true)}}
mb.onclick=()=>{asked=true;setMusic(!on)};

/* lock screen: code is 8 0 4 then a heart */
const CODE=['8','0','4','❤'];let entry=[];
const keys=$('#keys'),dots=$('#dots');
['1','2','3','4','5','6','7','8','9','❤','0','⌫'].forEach(k=>{
  const b=document.createElement('button');b.textContent=k==='❤'?'❤️':k;
  if(k==='❤')b.classList.add('heart');if(k==='⌫')b.classList.add('del');
  b.setAttribute('aria-label',k==='❤'?'Heart':k==='⌫'?'Delete':k);
  b.onclick=()=>press(k);keys.appendChild(b)});
function draw(){$$('i',dots).forEach((d,i)=>d.classList.toggle('f',i<entry.length))}
function press(k){
  if(k==='⌫'){entry.pop();draw();return}
  if(entry.length>=4)return;
  entry.push(k);draw();
  if(entry.length===4){
    if(entry.every((v,i)=>v===CODE[i])){$('#msg').textContent='Welcome ❤️';setTimeout(()=>{$('#lock').classList.add('gone');startMusic();go(0)},350)}
    else{dots.classList.add('shake');$('#msg').textContent='Wrong code, try again';setTimeout(()=>{dots.classList.remove('shake');entry=[];draw()},450)}
  }
}
addEventListener('keydown',e=>{if($('#lock').classList.contains('gone'))return;if(/^[0-9]$/.test(e.key))press(e.key);else if(e.key==='Backspace')press('⌫')});

go(0);
})();
