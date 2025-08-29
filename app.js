// Theme toggle (dark <-> light)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeToggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
  });
}

// Mobile nav toggle
const menuBtn = document.querySelector('.menu-btn');
const navList = document.getElementById('navList');
if (menuBtn && navList) {
  menuBtn.addEventListener('click', () => navList.classList.toggle('open'));
  navList.querySelectorAll('a').forEach(a => a.addEventListener('click',()=> navList.classList.remove('open')));
}

// Smooth scroll for internal links (enhancement)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
    }
  });
});

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
},{threshold:.12});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Year in footer
document.getElementById('year').textContent = `© ${new Date().getFullYear()}`;

// Decorative AI nodes in hero SVG
(function drawNodes(){
  const svg = document.querySelector('.ai-visual');
  if(!svg) return;
  const g = svg.querySelector('.nodes');
  const w = 600, h = 380; // match viewBox
  const N = 28;
  for(let i=0;i<N;i++){
    const cx = Math.random()* (w-60) + 30;
    const cy = Math.random()* (h-60) + 30;
    const r = Math.random()*5 + 3;
    const node = document.createElementNS('http://www.w3.org/2000/svg','circle');
    node.setAttribute('cx', cx);
    node.setAttribute('cy', cy);
    node.setAttribute('r', r);
    node.setAttribute('fill', 'url(#g1)');
    node.setAttribute('opacity','0.9');
    g.appendChild(node);
  }
  // simple connecting lines
  for(let i=0;i<N;i++){
    const a = g.children[i];
    const j = Math.floor(Math.random()*N);
    const b = g.children[j];
    if(!a || !b || a===b) continue;
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', a.getAttribute('cx'));
    line.setAttribute('y1', a.getAttribute('cy'));
    line.setAttribute('x2', b.getAttribute('cx'));
    line.setAttribute('y2', b.getAttribute('cy'));
    line.setAttribute('stroke','url(#g1)');
    line.setAttribute('opacity','.25');
    g.appendChild(line);
  }
})();

// Export Pros & Cons section as PNG using html2canvas (no external deps, tiny fallback)
// Lightweight fallback renderer (very basic) if html2canvas isn't available
function basicExportPNG(node){
  const scale = window.devicePixelRatio || 2;
  const rect = node.getBoundingClientRect();
  const canvas = document.createElement('canvas');
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg');
  ctx.fillRect(0,0,rect.width,rect.height);
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text');
  ctx.font = '16px Inter, sans-serif';
  ctx.fillText('Screenshot export is simplified in this demo.', 20, 40);
  return canvas.toDataURL('image/png');
}

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
  exportBtn.addEventListener('click', async () => {
    const node = document.getElementById('proscons');
    let dataUrl;
    if (window.html2canvas) {
      const canvas = await window.html2canvas(node);
      dataUrl = canvas.toDataURL('image/png');
    } else {
      dataUrl = basicExportPNG(node);
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'pros-cons.png';
    link.click();
  });
}
