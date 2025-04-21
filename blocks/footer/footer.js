import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { decorateLinks } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/aristocratdemo/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    const takeTheWorld = document.querySelectorAll('.columns > div > div > ul');
    const lengauges = document.getElementsByClassName('languages');
    const dropdownBtn = document.getElementsByClassName('dropdown-btn');

    // lengauges.parentNode.removeChild(lengauges);
    // takeTheWorld.parentNode.appendChild(lengauges);

    dropdownBtn.onclick = (event) => {
      if (!event.target.matches('.dropbtn')) {
        const dropdown = document.getElementsByClassName('dropdown');
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < dropdown.length; i++) {
          const openDropdown = dropdown[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    };

    footer.innerHTML = html;

    decorateIcons(footer);
    decorateLinks(footer);
    block.append(footer);
  }
}
