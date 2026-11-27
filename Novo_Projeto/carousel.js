const carouselButtons = document.querySelectorAll(".carousel-button");
const carousels = document.querySelectorAll(".aulas-carousel, .relatorios-carousel");

function updateCarouselState(carousel) {
  const section = carousel.closest("section");
  const progress = section?.querySelector(".carousel-progress span");
  const maxScroll = carousel.scrollWidth - carousel.clientWidth;
  const progressPercent = maxScroll > 0 ? (carousel.scrollLeft / maxScroll) * 100 : 100;
  const cards = carousel.querySelectorAll(".aula-card, .relatorio-card");
  const carouselCenter = carousel.getBoundingClientRect().left + carousel.clientLeft + carousel.clientWidth / 2;
  let centeredCard = null;
  let smallestDistance = Infinity;

  cards.forEach((card) => {
    const cardCenter = card.getBoundingClientRect().left + card.getBoundingClientRect().width / 2;
    const distance = Math.abs(carouselCenter - cardCenter);

    if (distance < smallestDistance) {
      centeredCard = card;
      smallestDistance = distance;
    }

    card.classList.remove("is-centered");
  });

  centeredCard?.classList.add("is-centered");

  if (progress) {
    progress.style.width = `${progressPercent}%`;
  }

  const buttons = section?.querySelectorAll(".carousel-button");
  const isAtStart = carousel.scrollLeft <= 1;
  const isAtEnd = maxScroll <= 1 || carousel.scrollLeft >= maxScroll - 1;

  buttons?.forEach((button) => {
    const direction = Number(button.dataset.direction);
    const isDisabled = direction < 0 ? isAtStart : isAtEnd;
    button.disabled = isDisabled;
    button.classList.toggle("is-disabled", isDisabled);
  });
}

carousels.forEach((carousel) => {
  carousel.addEventListener("scroll", () => updateCarouselState(carousel), { passive: true });
  updateCarouselState(carousel);
});

window.addEventListener("resize", () => {
  carousels.forEach(updateCarouselState);
});

document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("nav summary")) {
    return;
  }

  document.querySelectorAll("nav details[open]").forEach((details) => {
    details.open = false;
  });
});

carouselButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const section = button.closest("section");
    const carousel = section?.querySelector(".aulas-carousel, .relatorios-carousel");

    if (!carousel) {
      return;
    }

    const direction = Number(button.dataset.direction);
    const card = carousel.querySelector(".aula-card, .relatorio-card");
    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const distance = card ? card.getBoundingClientRect().width + gap : carousel.clientWidth;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";

    carousel.scrollBy({ left: direction * distance, behavior });
  });
});
