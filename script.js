// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
let siteNav = document.querySelector('.site-nav');

// Move overlay to <body> to avoid clipping by transformed/sticky parents
if(siteNav && siteNav.parentElement !== document.body){
  document.body.appendChild(siteNav);
  // Re-query to ensure reference stays valid
  siteNav = document.querySelector('.site-nav');
}
// Overlay helpers must be global so all handlers can call them
function applyOverlaySize(){
  const h = window.innerHeight;
  siteNav.style.position = 'fixed';
  siteNav.style.top = '0';
  siteNav.style.left = '0';
  siteNav.style.right = '0';
  siteNav.style.bottom = '0';
  siteNav.style.minHeight = h + 'px';
  siteNav.style.height = h + 'px';
}
function clearOverlaySize(){
  siteNav.style.position = '';
  siteNav.style.top = '';
  siteNav.style.left = '';
  siteNav.style.right = '';
  siteNav.style.bottom = '';
  siteNav.style.minHeight = '';
  siteNav.style.height = '';
}
function onViewportChange(){
  if(siteNav.classList.contains('open')) applyOverlaySize();
}
if(navToggle){
  navToggle.addEventListener('click', ()=>{
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    // Force display so overlay always shows despite any CSS conflicts
    siteNav.style.display = open ? 'flex' : '';
    // Keep toggle above everything
    navToggle.style.zIndex = '4000';
    if(open){
      applyOverlaySize();
      window.addEventListener('resize', onViewportChange);
      window.addEventListener('orientationchange', onViewportChange);
      window.addEventListener('scroll', onViewportChange, { passive:true });
      const y = window.scrollY || window.pageYOffset || 0;
      document.body.dataset.scrollY = String(y);
      document.body.style.top = `-${y}px`;
      document.body.classList.add('no-scroll');
    }else{
      clearOverlaySize();
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('orientationchange', onViewportChange);
      window.removeEventListener('scroll', onViewportChange, { passive:true });
      const y = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.classList.remove('no-scroll');
      document.body.style.top = '';
      window.scrollTo(0, y);
    }
  });
}

// Close menu on link click (mobile)
let closingByAnchor = false;
siteNav?.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click', ()=>{
    closingByAnchor = true;
    if(siteNav.classList.contains('open')){
      siteNav.classList.remove('open');
      siteNav.style.display = '';
      clearOverlaySize();
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('orientationchange', onViewportChange);
      window.removeEventListener('scroll', onViewportChange, { passive:true });
      navToggle?.setAttribute('aria-expanded','false');
      navToggle?.setAttribute('aria-label','Buka menu');
      const y = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.classList.remove('no-scroll');
      document.body.style.top = '';
      // Jangan scrollTo jika close karena klik anchor
      // window.scrollTo(0, y);
      document.body.classList.remove('no-scroll');
      document.body.style.top = '';
      setTimeout(()=>{ closingByAnchor = false; }, 500);
    }
  })
});


// Ensure nav resets when switching to desktop
window.addEventListener('resize', ()=>{
  if(window.innerWidth > 960){
    siteNav?.classList.remove('open');
    if(siteNav) siteNav.style.display = '';
    clearOverlaySize();
    window.removeEventListener('resize', onViewportChange);
    window.removeEventListener('orientationchange', onViewportChange);
    window.removeEventListener('scroll', onViewportChange, { passive:true });
    navToggle?.setAttribute('aria-expanded','false');
    navToggle?.setAttribute('aria-label','Buka menu');
    const y = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    if(Number.isFinite(y)) window.scrollTo(0, y);
  }
});

// Close when clicking outside menu items (on the overlay background)
siteNav?.addEventListener('click', (e)=>{
  if(e.target === siteNav && siteNav.classList.contains('open')){
    siteNav.classList.remove('open');
    siteNav.style.display = '';
    clearOverlaySize();
    window.removeEventListener('resize', onViewportChange);
    window.removeEventListener('orientationchange', onViewportChange);
    window.removeEventListener('scroll', onViewportChange, { passive:true });
    navToggle?.setAttribute('aria-expanded','false');
    navToggle?.setAttribute('aria-label','Buka menu');
    const y = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    if(Number.isFinite(y)) window.scrollTo(0, y);
  }
});

// Close with Escape key
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && siteNav?.classList.contains('open')){
    siteNav.classList.remove('open');
    if(siteNav) siteNav.style.display = '';
    clearOverlaySize();
    window.removeEventListener('resize', onViewportChange);
    window.removeEventListener('orientationchange', onViewportChange);
    window.removeEventListener('scroll', onViewportChange, { passive:true });
    navToggle?.setAttribute('aria-expanded','false');
    navToggle?.setAttribute('aria-label','Buka menu');
    const y = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    if(Number.isFinite(y)) window.scrollTo(0, y);
  }
});

// Enhance details for FAQ: close others when one opens
const details = Array.from(document.querySelectorAll('#faq details'));
for(const d of details){
  d.addEventListener('toggle', ()=>{
    if(d.open){
      details.filter(x=>x!==d).forEach(x=>x.open=false);
    }
  })
}
