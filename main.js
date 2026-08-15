(function () {
  "use strict";

  const data = window.__BRAND__ || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const escHTML = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  /* ---------- Mounts (idempotent) ---------- */

  function mountMenu() {
    const target = $("[data-menu]");
    if (!target || target.children.length > 0 || !data.menu) return;
    target.innerHTML = data.menu.map(m => `
      <article class="card has-tilt" data-reveal>
        <div class="card-img"><img src="${escHTML(m.photo)}" alt="${escHTML(m.name)}" loading="lazy" decoding="async" /></div>
        <span class="card-price">${escHTML(m.price)}€</span>
        <div class="card-meta">
          <h3>${escHTML(m.name)}</h3>
          <p>${escHTML(m.desc)}</p>
        </div>
      </article>
    `).join("");
  }

  function mountMarquee() {
    const target = $("[data-marquee]");
    if (!target || target.children.length > 0 || !data.values) return;
    const items = data.values.map(v => `<span>${escHTML(v.label)}</span><span class="dot">·</span>`);
    target.innerHTML = items.join("").repeat(2);
  }

  function mountValuesList() {
    const target = $("[data-marquee-values]");
    if (!target || target.children.length > 0 || !data.values) return;
    target.innerHTML = data.values.map(v => `<span>${escHTML(v.label)}</span>`).join("");
  }

  function mountGallery() {
    const target = $("[data-gallery]");
    if (!target || target.children.length > 0 || !data.menu) return;
    const photos = [data.menu[2]?.photo, "assets/img/interior.jpg", data.menu[1]?.photo, "assets/img/ingredients.jpg", data.menu[3]?.photo].filter(Boolean);
    target.innerHTML = photos.map(src => `
      <div class="gallery-item"><img src="${escHTML(src)}" alt="" loading="lazy" decoding="async" /></div>
    `).join("");
  }

  function mountTestimonials() {
    const target = $("[data-testimonials]");
    if (!target || target.children.length > 0 || !data.testimonials) return;
    target.innerHTML = data.testimonials.map(t => `
      <div class="testi-card" data-reveal>
        <p class="testi-quote">&ldquo;${escHTML(t.quote)}&rdquo;</p>
        <div class="testi-author">
          <span class="testi-avatar"><img src="${escHTML(t.photo)}" alt="" loading="lazy" /></span>
          <span>${escHTML(t.author)}</span>
        </div>
      </div>
    `).join("");
  }

  function mountHours() {
    const target = $("[data-hours]");
    if (!target || target.children.length > 0 || !data.hours) return;
    target.innerHTML = data.hours.map(h => `
      <li><span class="day">${escHTML(h.day)}</span><span>${escHTML(h.time)}</span></li>
    `).join("");
  }

  function mountFooterSocial() {
    const target = $("[data-social]");
    if (!target || target.children.length > 0 || !data.social) return;
    target.innerHTML = data.social.map(s => `<li><a href="${escHTML(s.url)}">${escHTML(s.label)}</a></li>`).join("");
  }

  /* ---------- Splash-free boot marker ---------- */

  /* ---------- Nav ---------- */

  function initNav() {
    const nav = $(".nav");
    if (!nav) return;
    const onScroll = () => { if (scrollY > 60) nav.classList.add("is-scrolled"); else nav.classList.remove("is-scrolled"); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const burger = $("[data-nav-burger]");
    const mobile = $("[data-nav-mobile]");
    if (burger && mobile) {
      burger.addEventListener("click", () => {
        const open = mobile.getAttribute("aria-hidden") === "false";
        mobile.setAttribute("aria-hidden", open ? "true" : "false");
      });
      $$("a", mobile).forEach(a => a.addEventListener("click", () => mobile.setAttribute("aria-hidden", "true")));
    }
  }

  function initSmoothAnchors() {
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const navOffset = 80;
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth",
      });
    });
  }

  /* ---------- Cursor ---------- */

  function initCursor() {
    const root = $("[data-cursor-root]");
    if (!root || !fineHover) return;
    document.documentElement.classList.add("has-cursor");
    const ring = $(".cursor-ring", root);
    const dot = $(".cursor-dot", root);
    let tx = 0, ty = 0, rx = 0, ry = 0, firstMove = false;

    window.addEventListener("mousemove", e => {
      tx = e.clientX; ty = e.clientY;
      if (dot) dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      if (!firstMove) {
        firstMove = true;
        rx = tx; ry = ty;
        if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        root.classList.add("is-ready");
      }
    }, { passive: true });

    function tick() {
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    const HOVERABLES = "[data-cursor], .card, .btn, a[href]";
    document.addEventListener("mouseover", e => { if (e.target.closest(HOVERABLES)) root.classList.add("is-interactive"); });
    document.addEventListener("mouseout", e => {
      if (e.target.closest(HOVERABLES) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(HOVERABLES)))
        root.classList.remove("is-interactive");
    });
  }

  /* ---------- Reveal on scroll ---------- */

  function initReveals() {
    const els = $$("[data-reveal]");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-revealed"); io.unobserve(e.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(el => io.observe(el));

    setTimeout(() => {
      $$("[data-reveal]:not(.is-revealed)").forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-revealed");
      });
    }, 6000);
  }

  /* ---------- Tilt on cards ---------- */

  function initTilt() {
    if (matchMedia("(hover: none)").matches) return;
    $$(".has-tilt").forEach(card => {
      const MAX = 7;
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      card.addEventListener("mouseover", e => {
        if (!card.contains(e.relatedTarget)) {
          card.dataset.hovering = "1";
          if (!raf) raf = requestAnimationFrame(loop);
        }
      });
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tx = -py * MAX; ty = px * MAX;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseout", e => {
        if (!card.contains(e.relatedTarget)) { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); }
      });
      function loop() {
        cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
        card.style.setProperty("--rx", cx.toFixed(2) + "deg");
        card.style.setProperty("--ry", cy.toFixed(2) + "deg");
        raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  /* ---------- Split text ---------- */

  function splitWords(el) {
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    const wrap = text => text.split(/(\s+)/).map(w =>
      /^\s+$/.test(w) ? w : `<span class="split-word" aria-hidden="true">${escHTML(w)}</span>`
    ).join("");
    const html = Array.from(el.childNodes).map(node => {
      if (node.nodeType === 3) return wrap(node.textContent);
      if (node.nodeName === "BR") return "<br>";
      if (node.nodeType === 1) {
        const tag = node.tagName.toLowerCase();
        return `<${tag}>${wrap(node.textContent)}</${tag}>`;
      }
      return "";
    }).join("");
    el.innerHTML = html;
    return el.querySelectorAll(".split-word");
  }

  function initSplitText() {
    const el = $("[data-split]");
    if (!el) return;
    const parts = splitWords(el);
    if (window.gsap) {
      gsap.set(parts, { y: 24, opacity: 0 });
      gsap.to(parts, { y: 0, opacity: 1, duration: 0.9, stagger: 0.045, ease: "expo.out", delay: 0.15 });
    } else {
      parts.forEach(p => { p.style.opacity = 1; });
    }
  }

  /* ---------- Marquee animation ---------- */

  function initMarqueeAnim() {
    const track = $("[data-marquee]");
    if (!track) return;
    if (!window.gsap) return;
    const distance = track.scrollWidth / 2;
    const speed = 50;
    gsap.to(track, {
      x: -distance, duration: distance / speed, ease: "none", repeat: -1,
      modifiers: { x: gsap.utils.unitize ? gsap.utils.unitize(x => parseFloat(x) % distance) : (x => x) },
    });
  }

  /* ---------- Mesh gradient (reserve section) ---------- */

  function initMesh() {
    const box = $(".reserve-box");
    if (!box || reduced) return;
    // pure CSS animation already handles this — nothing to do in JS.
  }

  /* ---------- Contact form ---------- */

  function initContactForm() {
    const form = $("[data-contact-form]");
    const success = $("[data-contact-success]");
    if (!form || !success) return;
    const submitBtn = $("[type=submit]", form);
    const msg = $("[data-contact-success-msg]");

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (form.classList.contains("is-sending")) return;
      if (!form.reportValidity()) return;

      form.classList.add("is-sending");
      submitBtn.disabled = true;

      await new Promise(r => setTimeout(r, 700 + Math.random() * 500));

      const nameField = form.elements.name;
      const firstName = nameField ? nameField.value.trim().split(/\s+/)[0] : "";
      if (msg) msg.textContent = `${firstName ? firstName + ", " : ""}hemos recibido tu solicitud de reserva. Te confirmamos por email en breve.`;

      form.classList.add("is-sent");
      success.setAttribute("aria-hidden", "false");
      success.classList.add("is-visible");
    });
  }

  /* ---------- Boot ---------- */

  function boot() {
    safe(mountMenu, "mountMenu");
    safe(mountMarquee, "mountMarquee");
    safe(mountValuesList, "mountValuesList");
    safe(mountGallery, "mountGallery");
    safe(mountTestimonials, "mountTestimonials");
    safe(mountHours, "mountHours");
    safe(mountFooterSocial, "mountFooterSocial");

    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initCursor, "initCursor");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initContactForm, "initContactForm");
    safe(initMesh, "initMesh");

    if (window.gsap) {
      safe(initSplitText, "initSplitText");
      safe(initMarqueeAnim, "initMarqueeAnim");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
