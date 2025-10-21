/* ========= small niceties ========= */
// current year
document.getElementById("year").textContent = new Date().getFullYear();

// smooth scroll for internal links (offset for sticky header)
const header = document.querySelector(".site-header");
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", e=>{
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0) - 8;
      window.scrollTo({ top, behavior:"smooth" });
    }
  });
});

/* ========= Donation widget bootstrap (robust) ========= */
const DONATION_WIDGET_SRC = "https://dalyandog.net/_nuxt/assets/index.js";

let widgetLoaded = new Promise((resolve, reject) => {
  const already = [...document.scripts].some(s => s.src === DONATION_WIDGET_SRC);
  if (already && typeof window.openModal === "function") {
    resolve();
    return;
  }

  if (!already) {
    const s = document.createElement("script");
    s.type = "module";
    s.src = DONATION_WIDGET_SRC;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Donation widget failed to load"));
    document.head.appendChild(s);
  } else {
    // If script tag exists but openModal not ready yet, wait briefly
    const start = Date.now();
    (function waitReady(){
      if (typeof window.openModal === "function") return resolve();
      if (Date.now() - start > 6000) return reject(new Error("Donation widget not ready"));
      requestAnimationFrame(waitReady);
    })();
  }
});

document.getElementById("donateBtn")?.addEventListener("click", async (e)=>{
  e.preventDefault();
  try {
    await widgetLoaded;
    if (typeof window.openModal === "function") {
      window.openModal();
    } else {
      // final fallback (no alerts)
      window.location.href = "mailto:dalyandog@gmail.com?subject=Donate%20to%20Dalyan%20Dog";
    }
  } catch {
    window.location.href = "mailto:dalyandog@gmail.com?subject=Donate%20to%20Dalyan%20Dog";
  }
});

/* ========= Gallery bootstrap =========
   Drop photos inside: assets/gallery/
   (JPG/PNG/WebP). If at least one image exists and you reference it below,
   the grid renders. Until then, the placeholder text remains.
*/

// OPTION A (simple): add file names here when you upload them:
const GALLERY_FILES = [
  // Example names (replace with your real ones after upload):
  // "DSC04150.JPG", "DSC04152.JPG", "DSC04215.JPG"
].map(n => `assets/gallery/${n}`);

// Render if we have any items listed:
(function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  const ph   = document.getElementById("galleryPlaceholder");
  if (!grid) return;

  if (GALLERY_FILES.length === 0) {
    ph?.removeAttribute("hidden");
    grid.setAttribute("aria-busy","false");
    return;
  }

  ph?.remove();
  GALLERY_FILES.forEach(src => {
    const img = new Image();
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = "Shelter photo";
    img.src = src;
    grid.appendChild(img);
  });
  grid.setAttribute("aria-busy","false");
})();
