const catalogToggle = document.querySelector('.catalog-toggle');
const header = document.querySelector('.site-header');

if (catalogToggle) {
  const toggleButton = catalogToggle.querySelector('button');
  toggleButton?.addEventListener('click', () => {
    catalogToggle.classList.toggle('open');
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
    event.preventDefault();
    const targetId = link.getAttribute('data-scroll-to');
    const target = document.querySelector(targetId);
    if (target) {
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

const tabs = Array.from(document.querySelectorAll('[data-tab-target]'));
const tabPanels = Array.from(document.querySelectorAll('[data-tab-panel]'));

const tabsByGroup = new Map();
const panelsByGroup = new Map();

tabs.forEach((tab) => {
  const group = tab.dataset.tabGroup || 'default';
  const groupTabs = tabsByGroup.get(group) || [];
  groupTabs.push(tab);
  tabsByGroup.set(group, groupTabs);
});

tabPanels.forEach((panel) => {
  const group = panel.dataset.tabGroup || 'default';
  const groupPanels = panelsByGroup.get(group) || [];
  groupPanels.push(panel);
  panelsByGroup.set(group, groupPanels);
});

const activateTab = (group, targetId, updateHash = false) => {
  const groupTabs = tabsByGroup.get(group) || [];
  const groupPanels = panelsByGroup.get(group) || [];
  if (groupTabs.length === 0 || groupPanels.length === 0) {
    return;
  }

  const fallbackTarget = groupTabs[0].dataset.tabTarget;
  const hasTarget = groupPanels.some((panel) => panel.dataset.tabPanel === targetId);
  const resolvedTarget = hasTarget ? targetId : fallbackTarget;

  groupPanels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === resolvedTarget;
    const displayValue = panel.dataset.tabDisplay || 'block';
    panel.style.display = isActive ? displayValue : 'none';
    panel.classList.toggle('active', isActive);
    panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });

  groupTabs.forEach((tab) => {
    const isActive = tab.dataset.tabTarget === resolvedTarget;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  if (updateHash && resolvedTarget) {
    history.replaceState(null, '', `#${resolvedTarget}`);
  }
};

tabs.forEach((tab) => {
  const group = tab.dataset.tabGroup || 'default';
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.tabTarget;
    const shouldUpdateHash = group === 'workspace';
    activateTab(group, targetId, shouldUpdateHash);
  });
});

tabsByGroup.forEach((groupTabs, group) => {
  const initialFromHash = group === 'workspace' ? window.location.hash.replace('#', '') : '';
  const initialTarget = initialFromHash || groupTabs[0].dataset.tabTarget;
  const updateHash = group === 'workspace' && !!initialFromHash;
  activateTab(group, initialTarget, updateHash);
});

window.addEventListener('hashchange', () => {
  const target = window.location.hash.replace('#', '');
  if (!target) {
    return;
  }

  if (tabsByGroup.has('workspace')) {
    activateTab('workspace', target);
  }
});
