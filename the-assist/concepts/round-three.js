// Shared behaviour for round-three demos (07–09). Every section renders without this file;
// it only adds the mobile menu, reveals, the brand-animation player and the inactive demo form.
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // Mobile menu: <button data-nav-toggle aria-controls="id"> + <nav id="id">
  document.querySelectorAll('[data-nav-toggle]').forEach((btn) => {
    const nav = document.getElementById(btn.getAttribute('aria-controls'));
    if (!nav) return;
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      nav.dataset.open = String(open);
      document.body.classList.toggle('nav-open', open);
    };
    set(false);
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.dataset.open === 'true') { set(false); btn.focus(); } });
  });

  // Reveal on scroll: [data-reveal]
  const revealables = document.querySelectorAll('[data-reveal]');
  if (reduced.matches || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealables.forEach((el) => io.observe(el));
  }

  // Brand animation: [data-motion] containing <video>, <img data-still>, [data-motion-status],
  // [data-motion-pause], [data-motion-replay]. Plays once when seen; reduced motion shows the still.
  document.querySelectorAll('[data-motion]').forEach((box) => {
    const video = box.querySelector('video');
    const status = box.querySelector('[data-motion-status]');
    const pause = box.querySelector('[data-motion-pause]');
    const replay = box.querySelector('[data-motion-replay]');
    if (!video) return;
    let started = false;
    let token = 0;
    const say = (t) => { if (status) status.textContent = t; };
    const still = (t) => { video.pause(); box.classList.remove('is-playing'); if (pause) pause.hidden = true; say(t); };
    const play = async () => {
      const mine = ++token;
      video.currentTime = 0;
      video.muted = true;
      try {
        await video.play();
        if (mine !== token) return;
        box.classList.add('is-playing');
        if (pause) { pause.hidden = false; pause.textContent = 'Pause'; }
        say('Playing — six seconds, no sound.');
      } catch { if (mine === token) still('Select Replay to play the animation.'); }
    };
    replay?.addEventListener('click', () => { started = true; play(); });
    pause?.addEventListener('click', async () => {
      if (video.paused) {
        try { await video.play(); pause.textContent = 'Pause'; say('Playing.'); } catch { still('Select Replay to play the animation.'); }
      } else { video.pause(); pause.textContent = 'Resume'; say('Paused.'); }
    });
    video.addEventListener('ended', () => still('The Assist. Confidence through personal style.'));
    video.addEventListener('error', () => still('Showing the still logo.'));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          if (reduced.matches) still('Reduced motion is on — showing the still logo.'); else play();
        } else if (!entry.isIntersecting && !video.paused) {
          still('Select Replay to watch again.');
        }
      }, { threshold: 0.35 }).observe(box);
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden) { token++; still('Select Replay to watch again.'); } });
  });

  // Demo form: form[data-demo-form]. Validates, never sends.
  document.querySelectorAll('form[data-demo-form]').forEach((form) => {
    const out = form.querySelector('[data-form-status]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
      form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
      if (invalid.length) {
        invalid.forEach((el) => el.setAttribute('aria-invalid', 'true'));
        invalid[0].focus();
        if (out) out.textContent = 'Please fill in your first name, last name and a valid email.';
        return;
      }
      const first = form.elements.namedItem('first')?.value.trim();
      if (out) out.textContent = `Thanks${first ? ', ' + first : ''}. This is a design demo, so nothing was sent. The live site will connect to Marcus's booking.`;
    });
  });

  // Prefill: <a data-prefill="message text" href="#consultation">
  document.querySelectorAll('[data-prefill]').forEach((a) => a.addEventListener('click', () => {
    const msg = document.querySelector('#consultation textarea');
    if (msg && !msg.value.trim()) msg.value = a.dataset.prefill;
  }));

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
