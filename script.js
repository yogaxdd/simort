// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
let siteNav = document.querySelector('.site-nav');
// Remember original placement to restore on desktop
const originalParent = siteNav?.parentElement || null;
const originalNext = siteNav ? siteNav.nextSibling : null;

function moveNavToBody(){
  if(!siteNav) return;
  if(siteNav.parentElement !== document.body){
    document.body.appendChild(siteNav);
  }
}

function restoreNavToHeader(){
  if(!siteNav || !originalParent) return;
  if(siteNav.parentElement === document.body){
    if(originalNext && originalNext.parentNode === originalParent){
      originalParent.insertBefore(siteNav, originalNext);
    }else{
      originalParent.appendChild(siteNav);
    }
  }
}

// Place nav based on current viewport: body on mobile for overlay, header on desktop
if(window.innerWidth <= 960){
  moveNavToBody();
}else{
  restoreNavToHeader();
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
      // Ensure on mobile the overlay sits on body
      if(window.innerWidth <= 960){
        moveNavToBody();
      }
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
    // Restore nav position back into header on desktop
    restoreNavToHeader();
  }else{
    // On mobile ensure nav is attached to body for overlay
    moveNavToBody();
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

// Scroll-triggered animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      // Add staggered delay for grid items
      if (entry.target.parentElement.classList.contains('features-grid') ||
          entry.target.parentElement.classList.contains('benefits-grid') ||
          entry.target.parentElement.classList.contains('testimonials')) {
        const siblings = Array.from(entry.target.parentElement.children);
        const index = siblings.indexOf(entry.target);
        entry.target.style.animationDelay = `${index * 0.1}s`;
      }
    }
  });
}, observerOptions);

// Observe all animatable elements
function observeElements() {
  const elementsToAnimate = [
    '.feature-card',
    '.product-card', 
    '.testimonial',
    '.benefits-grid article',
    '.steps li',
    '.faq details',
    '.section h2',
    '.hero-gallery img'
  ];
  
  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });
  });
}

// Initialize animations when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeElements);
} else {
  observeElements();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Enhanced button interactions
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-3px) scale(1.02)';
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
  
  btn.addEventListener('mousedown', () => {
    btn.style.transform = 'translateY(-1px) scale(0.98)';
  });
  
  btn.addEventListener('mouseup', () => {
    btn.style.transform = 'translateY(-3px) scale(1.02)';
  });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero-media');
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.1}px)`;
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
