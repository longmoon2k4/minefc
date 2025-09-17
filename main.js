// Main interactions, preload, scroll effects, nav, background particles
(function(){
  const $ = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));

  // Year
  const y = $('#year'); if(y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = $('.nav-toggle');
  const navLinks = $('.nav-links');
  if(navToggle){
    navToggle.addEventListener('click', ()=>{
      navLinks.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });
  }
  // close nav when clicking outside (mobile)
  document.addEventListener('click', (e)=>{
    if(!navLinks) return;
    const inside = navLinks.contains(e.target) || (navToggle && navToggle.contains(e.target));
    if(!inside) navLinks.classList.remove('open');
  });

  // Copy IP buttons
  function copyIP(btn){
    const ip = btn.getAttribute('data-ip');
    navigator.clipboard.writeText(ip).then(()=>{
      btn.textContent = 'Đã sao chép!';
      setTimeout(()=>btn.textContent='Sao chép IP', 1500);
    }).catch(()=>{
      // fallback
      const ta = document.createElement('textarea'); ta.value = ip; document.body.appendChild(ta); ta.select();
      try{ document.execCommand('copy'); btn.textContent='Đã sao chép!'; setTimeout(()=>btn.textContent='Sao chép IP',1500);}catch(e){}
      document.body.removeChild(ta);
    });
  }
  ['#copy-ip','#copy-ip-2'].forEach(id=>{ const b=$(id); if(b){ b.addEventListener('click',()=>copyIP(b)); }});

  // Intersection reveal
  const revealEls = $$('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  revealEls.forEach(el=>io.observe(el));

  // Active nav on scroll
  const sections = ['hero','about','features','showcase','gallery','join'].map(id=>$('#'+id));
  const links = $$('.nav-links a');
  function syncActive(){
    let current = 'hero';
    for(const sec of sections){
      if(!sec) continue;
      const rect = sec.getBoundingClientRect();
      if(rect.top <= 120 && rect.bottom >= 200){ current = sec.id; }
    }
    links.forEach(a=>{ a.classList.toggle('active', a.getAttribute('href')==='#'+current);});
  }
  window.addEventListener('scroll', syncActive, {passive:true}); syncActive();

  // VanillaTilt on interactive cards
  if(window.VanillaTilt){
    $$('.interactive').forEach(card=>{
      window.VanillaTilt.init(card, { max:8, speed:400, glare:true, 'max-glare': .2, scale:1.02 });
    });
  }

  // GSAP scroll effects if available
  function initGSAP(){
    if(!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.card.glass').forEach((el,i)=>{
      gsap.fromTo(el,{y:20,opacity:0},{y:0,opacity:1,duration:.6,delay: i*0.06, scrollTrigger:{trigger:el,start:'top 85%'}});
    });
    gsap.to('.hero .title',{ y:0, opacity:1, duration:.8, ease:'power3.out'});
  }
  window.addEventListener('load', initGSAP);

  // Preloader simulate progress while assets load
  const preloader = $('#preloader');
  const bar = $('#preloader .bar span');
  let prog = 0; const ti = setInterval(()=>{ prog = Math.min(100, prog + Math.random()*12+6); bar.style.width = prog+'%'; if(prog>=100){ clearInterval(ti); setTimeout(hidePre, 250);} }, 260);
  function hidePre(){ preloader.style.opacity='0'; setTimeout(()=> preloader.remove(), 400); }

  // Background particles on canvas
  const bgc = $('#bg-canvas');
  if(bgc){
    const ctx = bgc.getContext('2d');
    let w,h; const DPR = Math.min(2, window.devicePixelRatio || 1);
    const parts = Array.from({length:110}, ()=>({ x:Math.random(), y:Math.random(), r:Math.random()*2+0.4, vx:(Math.random()-.5)*0.0006, vy:(Math.random()-.5)*0.0006 }));
    function resize(){ w = bgc.clientWidth; h = bgc.clientHeight; bgc.width = w*DPR; bgc.height = h*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
    function step(t){ ctx.clearRect(0,0,w,h); ctx.globalAlpha=.8; for(const p of parts){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>1) p.vx*=-1; if(p.y<0||p.y>1) p.vy*=-1; const gx = p.x*w, gy=p.y*h; const grd = ctx.createRadialGradient(gx,gy,0,gx,gy,p.r*10); grd.addColorStop(0,'rgba(36,211,154,.35)'); grd.addColorStop(1,'rgba(36,211,154,0)'); ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(gx,gy,p.r*3,0,Math.PI*2); ctx.fill(); }
      requestAnimationFrame(step); }
    resize(); step();
    window.addEventListener('resize', resize);
  }

  // Smooth anchors
  $$('.nav-links a').forEach(a=>a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if(href && href.startsWith('#')){ e.preventDefault(); document.querySelector(href).scrollIntoView({behavior:'smooth'}); navLinks.classList.remove('open'); document.body.classList.remove('nav-open'); }
  }));

  // Cursor glow follow
  const dot = $('#cursor-dot');
  if(dot){
    window.addEventListener('pointermove', (e)=>{
      dot.style.transform = `translate(${e.clientX-11}px, ${e.clientY-11}px)`;
    }, {passive:true});
  }
})();
