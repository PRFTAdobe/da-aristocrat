export default function decorate(block) {
  const blog = document.querySelector('.section.blog-main-mobile');
  if (blog) {
    const headers = blog.querySelectorAll('.default-content-wrapper h2');
    console.log('HEADERS: ', headers);
    if (headers.length > 0) {
      // Create a document fragment for efficient DOM manipulation
      const fragment = document.createDocumentFragment();

      const ul = document.createElement('ul');
      headers.forEach((header, index) => {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.textContent = header.textContent;
        anchor.href = `#header-${index}`;
        anchor.addEventListener('click', (event) => {
          event.preventDefault();
          header.scrollIntoView({ behavior: 'smooth' });
        });
        listItem.appendChild(anchor);
        ul.appendChild(listItem);
        fragment.appendChild(ul);
        header.id = `header-${index}`;
      });

      const tocContainer = document.querySelector('.drop-down-menu.block > div');
      if (tocContainer) {
        tocContainer.appendChild(fragment);
      }
    }
  }

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (col.textContent.trim().toLowerCase() === 'title') {
        const nextCol = col.nextElementSibling;
        if (nextCol) {
          nextCol.classList.add('title');
        }
        col.remove();
      }
    });
  });

  // Get the dropdown button and content
  const dropdownBtn = document.querySelector('.drop-down-menu.block .title');
  const dropdownContent = document.querySelector('.drop-down-menu.block ul');
  const caretSpan = dropdownBtn.querySelector('picture');

  // Toggle the dropdown content when the button is clicked
  dropdownBtn.addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
    caretSpan.classList.toggle('show');
    const currentRotation = parseInt(caretSpan.style.transform.replace('rotate(', '').replace('deg)', ''), 10) || 0;
    const newRotation = currentRotation + 180;
    caretSpan.style.transform = `rotate(${newRotation}deg)`;
  });

  // Close the dropdown content if the user clicks outside of it
  window.addEventListener('click', (event) => {
    if (!event.target.matches('.drop-down-menu.block .title')) {
      const dropdowns = document.querySelectorAll('.dropdown-content');
      dropdowns.forEach((dropdown) => {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      });
    }
  });
}
