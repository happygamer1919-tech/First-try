/* Smooth scroll for nav links */
document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* Year in footer */
document.getElementById('year').textContent = new Date().getFullYear();

/* Wallet donate integration
   - We call the host's openModal() when it exists.
   - If their script isn't ready yet, we show a friendly message. */
function donateNow(){
  if (typeof window.openModal === 'function') {
    try { window.openModal(); }
    catch (e) { alert('Donation widget not available right now. Please try again shortly.'); }
  } else {
    alert('Donation widget is still loading. Please try again in a moment.');
  }
}
window.donateNow = donateNow; // make callable from inline onclick

/* ----- Gallery loader -----
   Priority:
   1) Try assets/gallery/manifest.json (JSON array of filenames)
   2) Fallback to data-files attribute on #galleryGrid
-------------------------------- */
async function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  let files = [];

  // Try manifest.json
  try {
    const res = await fetch('assets/gallery/manifest.json', { cache: 'no-store' });
    if (res.ok) {
      const arr = await res.json();
      if (Array.isArray(arr)) files = arr.map(String);
    }
  } catch (_) { /* ignore */ }

  // Fallback: data-files
  if (!files.length) {
    const attr = (grid.dataset.files || '').trim();
    if (attr) files = attr.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Render
  grid.innerHTML = '';
  if (!files.length) {
    grid.innerHTML = `<p class="hint">No images listed yet.</p>`;
    return;
  }

  for (const name of files) {
    // Be exact with filename case; files live in assets/gallery/
    const href = `assets/gallery/${name}`;
    const a = document.createElement('a');
    a.href = href;
    a.className = 'gallery-item';
    a.target = '_blank';
    a.rel = 'noopener';

    const img = document.createElement('img');
    img.src = href;
    img.alt = 'Shelter photo';
    img.loading = 'lazy';

    a.appendChild(img);
    grid.appendChild(a);
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);
