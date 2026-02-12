  (function () {
    const btn = document.querySelector('.btn-whatsapp');
    if (!btn) return;

    const threshold = 40; // aparece quando descer 40px
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      btn.classList.toggle('is-visible', y > threshold);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();