// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
if(navToggle){
  navToggle.addEventListener('click', ()=>{
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Close menu on link click (mobile)
siteNav?.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click', ()=>{
    if(siteNav.classList.contains('open')){
      siteNav.classList.remove('open');
      navToggle?.setAttribute('aria-expanded','false');
    }
  })
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
