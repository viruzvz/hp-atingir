(() => {
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const modalEl = document.getElementById("galleryModal");

  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalCounter = document.getElementById("modalCounter");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!modalEl || !modalImage || items.length === 0) return;

  let currentIndex = 0;

  // garante data-index automático se não tiver
  items.forEach((it, i) => {
    if (!it.dataset.index) it.dataset.index = String(i);
  });

  function clampIndex(i) {
    if (!Number.isFinite(i)) return 0;
    if (i < 0) return items.length - 1;
    if (i >= items.length) return 0;
    return i;
  }

  function updateModal(index) {
    const i = clampIndex(index);
    const item = items[i];
    if (!item) return;

    const src = item.dataset.src || item.getAttribute("href") || "";
    const title = item.dataset.title || "";

    if (src) modalImage.src = src;
    if (modalTitle) modalTitle.textContent = title;
    if (modalCounter) modalCounter.textContent = `${i + 1} / ${items.length}`;

    currentIndex = i;
  }

  // Clique no thumb (fallback se relatedTarget falhar)
  items.forEach((it) => {
    it.addEventListener("click", () => {
      const i = Number(it.dataset.index);
      updateModal(i);
    });
  });

  modalEl.addEventListener("show.bs.modal", (event) => {
    const trigger = event.relatedTarget;
    const idx = trigger ? Number(trigger.dataset.index) : currentIndex;
    updateModal(idx);
  });

  prevBtn?.addEventListener("click", () => updateModal(currentIndex - 1));
  nextBtn?.addEventListener("click", () => updateModal(currentIndex + 1));

  modalEl.addEventListener("hidden.bs.modal", () => {
    modalImage.src = "";
  });
})();
