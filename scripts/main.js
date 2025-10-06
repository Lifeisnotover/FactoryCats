const catalogToggle = document.querySelector('.catalog-toggle');
const header = document.querySelector('.site-header');

if (catalogToggle) {
  const toggleButton = catalogToggle.querySelector('button');
  const menuLinks = catalogToggle.querySelectorAll('.catalog-menu a');
  toggleButton?.addEventListener('click', () => {
    catalogToggle.classList.toggle('open');
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      catalogToggle.classList.remove('open');
    });
  });

  document.addEventListener('click', (event) => {
    if (!catalogToggle.contains(event.target)) {
      catalogToggle.classList.remove('open');
    }
  });
}

const navLinks = document.querySelectorAll('[data-scroll-to]');
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('data-scroll-to');
    const target = targetId ? document.querySelector(targetId) : null;
    if (target) {
      event.preventDefault();
      const offset = header ? header.offsetHeight + 12 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

const carousel = document.querySelector('.showcase-slider');
if (carousel) {
  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('is-grabbing');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('is-grabbing');
  });

  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('is-grabbing');
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.4;
    carousel.scrollLeft = scrollLeft - walk;
  });
}

const otpInputs = document.querySelectorAll('.otp-inputs input');
otpInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' && !input.value && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
});

const tabs = document.querySelectorAll('[data-tab-target]');
const tabPanels = document.querySelectorAll('[data-tab-panel]');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const targetId = tab.getAttribute('data-tab-target');

    tabs.forEach((btn) => btn.classList.remove('active'));
    tabPanels.forEach((panel) => {
      if (panel.getAttribute('data-tab-panel') === targetId) {
        panel.style.display = 'grid';
      } else {
        panel.style.display = 'none';
      }
    });

    tab.classList.add('active');
  });
});

if (tabPanels.length > 0) {
  tabPanels.forEach((panel, index) => {
    panel.style.display = index === 0 ? 'grid' : 'none';
  });
}
