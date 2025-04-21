export default function decorate(block) {
  const blog = document.querySelector('.section.blog-main');
  if (blog) {
    const headers = blog.querySelectorAll('.default-content-wrapper h2');
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

      const tocContainer = document.querySelector('.table-of-contents.block > div:nth-child(2)');
      if (tocContainer) {
        tocContainer.appendChild(fragment);
      }
    }
  }

  [...block.children].forEach((row) => {
    const picture = row.querySelector('picture');
    if (picture) {
      const div1 = document.createElement('div');
      div1.classList.add('image');
      div1.append(picture);

      const aTag = row.querySelector('a[href]');
      if (aTag) {
        const div2 = document.createElement('div');
        div2.classList.add('download-button');
        div2.append(aTag);
        div1.append(div2);
      }

      const pTags = row.querySelectorAll('p');
      if (pTags.length > 0) {
        const div3 = document.createElement('div');
        div3.classList.add('image-text');
        pTags.forEach((p) => {
          if (p.innerText.trim()) {
            div3.append(p.cloneNode(true));
          }
        });
        div1.prepend(div3);
      }

      row.replaceWith(div1);
    }

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
}
