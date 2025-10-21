// YEAR
document.getElementById('year').textContent = new Date().getFullYear();

// DONATE WIDGET
function waitForModalAndOpen(timeoutMs = 5000){
  const start = Date.now();
  (function tryOpen(){
    if (typeof window.openModal === 'function'){
      try { window.openModal(); } catch(e){ console.error(e); }
    } else if (Date.now() - start < timeoutMs){
      setTimeout(tryOpen, 250);
    } else {
      alert('Donation widget is still loading. Please try again in a moment.');
    }
  })();
}
function handleDonate(ev){ ev?.preventDefault(); waitForModalAndOpen(); }

document.querySelectorAll('.donateBtn').forEach(b => b.addEventListener('click', handleDonate));
document.getElementById('donateBtnTop')?.addEventListener('click', handleDonate);
document.getElementById('donateNav')?.addEventListener('click', handleDonate);

// SCROLL-IN ANIMATIONS
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
},{threshold:0.15});
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// STATS COUNTER
function counter(el){
  const to = Number(el.dataset.to || 0);
  const start = 0;
  const dur = 1200;
  const t0 = performance.now();
  function tick(now){
    const p = Math.min(1, (now - t0)/dur);
    el.textContent = Math.round(start + (to-start)*p);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statObs = new IntersectionObserver((entries)=>{
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.querySelectorAll('.num').forEach(counter);
      statObs.unobserve(e.target);
    }
  });
},{threshold:0.4});
document.querySelectorAll('.stat-card').forEach(s => statObs.observe(s));

// GALLERY SLIDER
(function initGallery(){
  const track = document.getElementById('galleryTrack');
  if (!track) return;

  // List your filenames here (add more as you upload to assets/gallery/)
  const files = [
    // put your real filenames (case-sensitive):
    // Example placeholders:
    'DSC04198.JPG','DSC04152.JPG','DSC04150.JPG','DSC04148.JPG',
    'DSC04229.JPG','DSC04223.JPG','DSC04222.JPG','DSC04219.JPG'
  ];

  // Build slides
  files.forEach(name => {
    const img = document.createElement('img');
    img.alt = 'Shelter photo';
    img.loading = 'lazy';
    img.src = `assets/gallery/${name}`;
    track.appendChild(img);
  });

  let index = 0;
  function update(){ track.style.transform = `translateX(-${index * 100}%)`; }
  const prev = document.querySelector('.slider .prev');
  const next = document.querySelector('.slider .next');
  prev?.addEventListener('click', ()=>{ index = (index - 1 + files.length) % files.length; update(); });
  next?.addEventListener('click', ()=>{ index = (index + 1) % files.length; update(); });

  // Swipe (mobile)
  let startX = 0;
  track.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive:true});
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      index = (index + (dx < 0 ? 1 : -1) + files.length) % files.length;
      update();
    }
  });
})();

// ACTIVE LINK ON SCROLL (simple)
const sections = ['mission','help','donate','stories','gallery','faq','contact'];
const links = new Map(sections.map(id => [id, document.querySelector(`.nav a[href="#${id}"]`)]));
const secObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    const id = e.target.id;
    const link = links.get(id);
    if (!link) return;
    if (e.isIntersecting){ links.forEach(l => l?.classList.remove('active')); link.classList.add('active'); }
  });
},{rootMargin:'-40% 0px -55% 0px', threshold:0});
sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) secObs.observe(el);
});
