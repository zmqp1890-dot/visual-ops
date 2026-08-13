const tabs=[...document.querySelectorAll('.tabs button')];
const panels=[...document.querySelectorAll('.panel')];
const nav=document.getElementById('mainNav');
function activate(id,push=true){
  if(!document.getElementById(id)) id='overview';
  tabs.forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  panels.forEach(p=>p.classList.toggle('active',p.id===id));
  document.title=`${document.getElementById(id).dataset.title} — VISUAL OPS`;
  nav.classList.remove('open');document.getElementById('menuBtn').setAttribute('aria-expanded','false');
  if(push) history.pushState(null,'',`#${id}`);
  window.scrollTo({top:0,behavior:'smooth'});
}
tabs.forEach(b=>b.addEventListener('click',()=>activate(b.dataset.tab)));
document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>activate(b.dataset.jump)));
window.addEventListener('popstate',()=>activate(location.hash.slice(1)||'overview',false));
document.getElementById('menuBtn').addEventListener('click',e=>{nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',nav.classList.contains('open'))});
activate(location.hash.slice(1)||'overview',false);

const promptButtons=[...document.querySelectorAll('.prompt-tabs button')];
promptButtons.forEach(btn=>btn.addEventListener('click',()=>{
  promptButtons.forEach(b=>b.classList.toggle('active',b===btn));
  document.querySelectorAll('.prompt').forEach(p=>p.classList.toggle('active',p.id===`prompt-${btn.dataset.prompt}`));
}));
const toast=document.getElementById('toast');
document.querySelectorAll('.copy').forEach(btn=>btn.addEventListener('click',async()=>{
  const value=btn.parentElement.querySelector('pre').innerText;
  try{await navigator.clipboard.writeText(value)}catch{const ta=document.createElement('textarea');ta.value=value;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}
  toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1200);
}));
const checklist=[...document.querySelectorAll('#quickChecklist input')];
checklist.forEach((box,i)=>{box.checked=localStorage.getItem(`visualOpsCheck${i}`)==='1';box.addEventListener('change',()=>localStorage.setItem(`visualOpsCheck${i}`,box.checked?'1':'0'))});
function tick(){document.getElementById('clock').textContent=new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}).replace(/^24/,'00')}tick();setInterval(tick,30000);

const canvas=document.getElementById('particles'),ctx=canvas.getContext('2d');let points=[],pointer={x:-999,y:-999};
function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0);points=Array.from({length:Math.min(70,Math.floor(innerWidth/18))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18}))}resize();addEventListener('resize',resize);addEventListener('pointermove',e=>pointer={x:e.clientX,y:e.clientY});
function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);ctx.fillStyle='#ff4d2e';for(const p of points){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;const dx=p.x-pointer.x,dy=p.y-pointer.y,dist=Math.hypot(dx,dy);if(dist<110){p.x+=dx/dist*.6;p.y+=dy/dist*.6}ctx.globalAlpha=.18;ctx.fillRect(p.x,p.y,2,2)}ctx.globalAlpha=1;requestAnimationFrame(draw)}if(!matchMedia('(prefers-reduced-motion: reduce)').matches)draw();
