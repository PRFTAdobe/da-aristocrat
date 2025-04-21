import {
  fetchPlaceholders, getMetadata, readBlockConfig, decorateIcons,
} from '../../scripts/lib-franklin.js';
// import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  const navTools = document.getElementsByClassName('nav-tools');
  if (navTools && button.getAttribute('aria-label') === 'Open navigation') {
    if (navTools[0]) {
      const navChildren = navTools[0].children;
      for (let i = 0; i < navChildren.length; i++) {
        navChildren[i].classList.remove("open");
      }
    }
   
  }
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function openNavTools(children, classToShow, navTools) {
  for (let i = 0; i < children.length; i++) {
    children[i].classList.remove('open');
  }
  navTools.classList.remove('open');

  classToShow.forEach((item) => {
    item.classList.toggle('open');
  });
  navTools.classList.toggle('open');
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const cfg = readBlockConfig(block);
  block.textContent = '';
  // const fragment =  loadFragment(navPath);
  const navPath = cfg.nav || '/aristocratdemo/nav';
  const resp = await fetch(`${navPath}.plain.html`, window.location.pathname.endsWith('/nav') ? { cache: 'reload' } : {});

  if (resp.ok) {
    // decorate nav DOM
    const html = await resp.text();
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const subHeader = document.createElement('div');
    subHeader.className = 'sub-header';

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    const navBrand = nav.querySelector('.nav-brand');
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      brandLink.closest('.button-container').className = '';
    }

    await decorateIcons(navBrand);

    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      var navTools = nav.querySelector('.nav-tools');
      // Add event listener to each list item
      navSections.querySelectorAll('ul > li').forEach((navSection) => {
        navSection.addEventListener('mouseenter', () => {
          // Get the index of the hovered list item
          const hoveredIndex = Array.from(navSection.parentElement.children).indexOf(navSection);
          const index = hoveredIndex + 1;
          const showClass = `list-item-${index}`;
          const classToShow = navTools.querySelectorAll(`.${showClass}`);
          if (classToShow) {
            const { children } = navTools;
            openNavTools(children, classToShow, navTools);
          }
        });
      });
    }

    // eslint-disable-next-line block-scoped-var
    navTools.addEventListener('mouseleave', () => {
      // eslint-disable-next-line block-scoped-var
      const { children } = navTools;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < children.length; i++) {
        children[i].classList.remove('open');
      }
      // eslint-disable-next-line block-scoped-var
      navTools.classList.remove('open');
    });

    navSections.addEventListener('mouseleave', (e) => {
      if (e.relatedTarget.nodeName === 'NAV') {
        // eslint-disable-next-line block-scoped-var
        const { children } = navTools;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < children.length; i++) {
          children[i].classList.remove('open');
        }
        // eslint-disable-next-line block-scoped-var
        navTools.classList.remove('open');
      }
    });

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    //   navWrapper.append(subHeader);
    block.append(navWrapper);

    if (getMetadata('breadcrumb').toLowerCase() === 'true') {
      // eslint-disable-next-line no-use-before-define
      block.append(await buildBreadcrumbs());
    }
  }
}

function getDirectTextContent(menuItem) {
  const menuLink = menuItem.querySelector(':scope > a');
  if (menuLink) {
    return menuLink.textContent.trim();
  }
  return Array.from(menuItem.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join(' ');
}

async function buildBreadcrumbsFromNavTree(nav, currentUrl) {
  const crumbs = [];

  const homeUrl = 'https://plarium.com/';

  let menuItem = Array.from(nav.querySelectorAll('a')).find((a) => a.href === currentUrl);
  if (menuItem) {
    do {
      const link = menuItem.querySelector(':scope > a');
      crumbs.unshift({ title: getDirectTextContent(menuItem), url: link ? link.href : null });
      menuItem = menuItem.closest('ul')?.closest('li');
    } while (menuItem);
  } else if (currentUrl !== homeUrl) {
    crumbs.unshift({ title: getMetadata('og:title'), url: currentUrl });
  }

  let placeholders;
  try {
    placeholders = await fetchPlaceholders();
  } catch (error) {
    // Handle the error from fetchPlaceholders if needed
    console.error('Error fetching placeholders:', error);
  }
  const homePlaceholder = placeholders ? placeholders.breadcrumbsHomeLabel || 'Home' : 'Home';

  crumbs.unshift({ title: homePlaceholder, url: homeUrl });

  // last link is current page and should not be linked
  if (crumbs.length > 1) {
    crumbs[crumbs.length - 1].url = null;
  }
  crumbs[crumbs.length - 1]['aria-current'] = 'page';
  return crumbs;
}

async function buildBreadcrumbs() {
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';

  const crumbs = await buildBreadcrumbsFromNavTree(document.querySelector('.nav-sections'), document.location.href);

  const ol = document.createElement('ol');
  ol.append(...crumbs.map((item) => {
    const li = document.createElement('li');
    if (item['aria-current']) li.setAttribute('aria-current', item['aria-current']);
    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      li.append(a);
    } else {
      li.textContent = item.title;
    }
    return li;
  }));

  breadcrumbs.append(ol);
  return breadcrumbs;
}
