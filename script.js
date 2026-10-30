(function () {
  "use strict";
/* =========================================================
   IMAGE CONFIG — every image on the page lives here.
   Swap `src` for any other Saya artwork (local path or URL).
   ========================================================= */
var IMAGES = {
  opening: { src: "images/saya-official-cover.jpg", pos: "center 18%", alt: "Saya from Saya no Uta in her white dress with ribbon, official cover artwork", source: "https://vndb.org/v97" },
  world:   { src: "images/saya-fanart-crimson.jpg", pos: "35% 25%", alt: "Saya with long green hair and a white slip dress against a deep crimson background", source: "https://safebooru.org/index.php?page=post&s=view&id=7015166" },
  reveal:  { src: "images/saya-fanart-dark.jpg", pos: "center 15%", alt: "Saya seated in shadow, hand resting near her chest, gazing down", source: "https://safebooru.org/index.php?page=post&s=view&id=7261966" },
  final:   { src: "images/saya-fanart-flower.jpg", pos: "72% 30%", alt: "Saya smiling beside a blooming red flower in a world of crimson", source: "https://safebooru.org/index.php?page=post&s=view&id=7076793" }
};
var GALLERY = [
  { src: "images/saya-official-cover.jpg", pos: "center 20%", caption: "i. the cover, as she first appeared", alt: "Official Saya no Uta cover art of Saya with wings of light", source: "https://vndb.org/v97" },
  { src: "images/saya-fanart-seated.jpg", pos: "center 15%", caption: "ii. waiting", alt: "Saya sitting with her very long hair spilling around her", source: "https://safebooru.org/index.php?page=post&s=view&id=7007017" },
  { src: "images/saya-official-cg-1.jpg", pos: "center 40%", caption: "iii. the world he saw", alt: "In-game scene of Saya standing in the flesh-covered world", source: "https://vndb.org/v97" },
  { src: "images/saya-fanart-wings.jpg", pos: "center 30%", caption: "iv. small wings", alt: "Watercolour Saya with pale wings among drawn vines", source: "https://safebooru.org/index.php?page=post&s=view&id=7101494" },
  { src: "images/saya-official-cg-2.jpg", pos: "center 50%", caption: "v. coming home", alt: "In-game scene of Saya in the corridor", source: "https://vndb.org/v97" },
  { src: "images/saya-fanart-angel.jpg", pos: "center 25%", caption: "vi. a song for her", alt: "Saya crouching with feathered wings beside the title 沙耶の唄", source: "https://safebooru.org/index.php?page=post&s=view&id=7231715" }
];

  document.querySelectorAll("img[data-img]").forEach(function (img) {
    var c = IMAGES[img.dataset.img]; if (!c) return;
    img.src = c.src; img.alt = c.alt; img.style.objectPosition = c.pos;
  });
  var gal = document.getElementById("gallery");
  GALLERY.forEach(function (g, i) {
    var f = document.createElement("figure"); f.className = "g g" + (i + 1) + " reveal-up";
    f.innerHTML = '<img loading="lazy"><figcaption></figcaption>';
    var im = f.querySelector("img"); im.src = g.src; im.alt = g.alt; im.style.objectPosition = g.pos;
    f.querySelector("figcaption").textContent = g.caption;
    gal.appendChild(f);
  });
  var seen = {}, links = [];
  [].concat(Object.keys(IMAGES).map(function (k) { return IMAGES[k]; }), GALLERY).forEach(function (c) {
    if (seen[c.source]) return; seen[c.source] = 1;
    links.push('<a href="' + c.source + '" target="_blank" rel="noopener">' + (links.length + 1) + '</a>');
  });
  document.getElementById("sourceLinks").innerHTML = "sources " + links.join(" · ");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;

  /* ---------- Opening sequence ---------- */
  var enterBtn = document.getElementById("enterBtn");
  var curtain = document.getElementById("curtain");
  var opening = document.getElementById("opening");
  var story = document.getElementById("story");

  enterBtn.addEventListener("click", function () {
    burst(window.innerWidth / 2, window.innerHeight / 2, 40);
    opening.classList.add("leaving");
    curtain.classList.add("on");
    setTimeout(function () {
      body.classList.remove("locked");
      body.classList.add("entered");
      story.removeAttribute("aria-hidden");
      window.scrollTo(0, 0);
      curtain.classList.remove("on");
      observeAll();
    }, reduce ? 50 : 1400);
  });

  /* ---------- Scroll reveals ---------- */
  var letterStarted = false;
  function observeAll() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        if (e.target.id === "reveal") { e.target.classList.add("open"); burst(window.innerWidth * 0.7, window.innerHeight * 0.4, 30); }
        if (e.target.id === "letter" && !letterStarted) { letterStarted = true; typeLetter(); }
        io.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    document.querySelectorAll(".reveal-up, #reveal, #letter").forEach(function (el) { io.observe(el); });

    var navLinks = document.querySelectorAll(".nav a");
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { threshold: 0.5 });
    document.querySelectorAll("main section").forEach(function (s) { navIo.observe(s); });
  }

  /* ---------- Typing letter ---------- */
  var letter = [
    "Dear Zin,",
    "Today the garden blooms a little brighter, because it is yours. This small world was made with care, one petal at a time, simply to say: you are worth celebrating.",
    "I hope this year brings you quiet mornings, honest laughter, and people who see you clearly — the strange, gentle, wonderful parts of you, all at once.",
    "May you keep finding beauty where others forget to look. May your days be soft when you need them to be, and bold when you want them to be.",
    "Happy birthday. Thank you for existing exactly as you are."
  ];
  function typeLetter() {
    var el = document.getElementById("letterBody");
    if (reduce) { el.innerHTML = letter.map(function (t) { return "<p>" + t + "</p>"; }).join(""); return; }
    var pi = 0, ci = 0, p = null;
    var caret = document.createElement("span"); caret.className = "caret";
    function step() {
      if (pi >= letter.length) { return; }
      if (!p) { p = document.createElement("p"); el.appendChild(p); }
      var text = letter[pi];
      ci++;
      p.textContent = text.slice(0, ci);
      p.appendChild(caret);
      if (ci >= text.length) { pi++; ci = 0; p = null; setTimeout(step, 520); return; }
      var ch = text[ci - 1];
      setTimeout(step, /[.,—]/.test(ch) ? 220 : 26 + Math.random() * 28);
    }
    step();
  }

  /* ---------- Parallax ---------- */
  var layers = document.querySelectorAll("[data-parallax]");
  var ticking = false;
  function parallax() {
    var vh = window.innerHeight;
    layers.forEach(function (l) {
      var r = l.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var speed = parseFloat(l.dataset.parallax);
      var off = (r.top + r.height / 2 - vh / 2) * speed;
      l.querySelector("img").style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
    });
    ticking = false;
  }
  if (!reduce) window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });

  /* ---------- Lightbox ---------- */
  var lb = document.createElement("div"); lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-label", "Image preview");
  var lbImg = document.createElement("img"); lb.appendChild(lbImg); body.appendChild(lb);
  document.querySelectorAll(".g").forEach(function (f) {
    f.tabIndex = 0;
    function open() { var i = f.querySelector("img"); lbImg.src = i.src; lbImg.alt = i.alt; lb.classList.add("on"); }
    f.addEventListener("click", open);
    f.addEventListener("keydown", function (e) { if (e.key === "Enter") open(); });
  });
  lb.addEventListener("click", function () { lb.classList.remove("on"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.classList.remove("on"); });

  /* ---------- Music (off by default) ---------- */
  var btn = document.getElementById("musicBtn"), audio = document.getElementById("bgm"), label = btn.querySelector(".music-label");
  btn.addEventListener("click", function () {
    if (audio.paused) {
      audio.volume = 0.5;
      audio.play().then(function () { btn.setAttribute("aria-pressed", "true"); label.textContent = "sound on"; })
        .catch(function () { label.textContent = "add music.mp3"; });
    } else {
      audio.pause(); btn.setAttribute("aria-pressed", "false"); label.textContent = "sound off";
    }
  });

  /* ---------- Petals ---------- */
  var canvas = document.getElementById("petals"), ctx = canvas.getContext("2d");
  var petals = [], W, H, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var colors = ["155,27,42", "201,154,160", "228,196,196", "110,20,32"];
  function resize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function make(x, y, fast) {
    return { x: x != null ? x : Math.random() * W, y: y != null ? y : -20 - Math.random() * H,
      s: 5 + Math.random() * 8, vy: fast ? -1 - Math.random() * 3 : 0.3 + Math.random() * 0.7,
      vx: fast ? (Math.random() - 0.5) * 6 : -0.2 + Math.random() * 0.5, r: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.03, sw: Math.random() * 6.28, c: colors[(Math.random() * colors.length) | 0],
      a: 0.35 + Math.random() * 0.45, life: fast ? 1 : 0 };
  }
  function burst(x, y, n) { if (reduce) return; for (var i = 0; i < n; i++) petals.push(make(x, y, true)); }
  function draw(p) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, Math.abs(Math.cos(p.sw)) * 0.6 + 0.4);
    ctx.fillStyle = "rgba(" + p.c + "," + p.a + ")";
    ctx.beginPath(); ctx.moveTo(0, -p.s); ctx.bezierCurveTo(p.s, -p.s * 0.4, p.s * 0.6, p.s, 0, p.s);
    ctx.bezierCurveTo(-p.s * 0.6, p.s, -p.s, -p.s * 0.4, 0, -p.s); ctx.fill(); ctx.restore();
  }
  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (var i = petals.length - 1; i >= 0; i--) {
      var p = petals[i];
      if (p.life) { p.vy += 0.04; p.vx *= 0.98; p.a *= 0.992; }
      p.sw += 0.02; p.x += p.vx + Math.sin(p.sw) * 0.4; p.y += p.vy; p.r += p.vr;
      if (p.y > H + 30 || p.a < 0.03) { if (p.life) { petals.splice(i, 1); continue; } petals[i] = make(null, -20); continue; }
      draw(p);
    }
    requestAnimationFrame(loop);
  }
  if (!reduce) {
    resize(); window.addEventListener("resize", resize);
    var count = W < 700 ? 14 : 26;
    for (var i = 0; i < count; i++) petals.push(make());
    loop();
  }
})();
