import { createOptimizedPicture } from "../../scripts/lib-franklin.js";
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`blogs-${cols.length}-cols`);

  // setup image blogs
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector("picture");
      if (pic) {
        const picWrapper = pic.closest("div");
        const pTag = pic.closest('p');
        if(pTag) {
          pTag.remove();
          picWrapper.append(pic);
        }
        if(picWrapper) {
          picWrapper.classList.add("blogs-img-col");
        }
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add("blogs-img-col");
          picWrapper.querySelectorAll("img").forEach((img) => {
            img.setAttribute("width", "300");
            img.setAttribute("height", "200");
          });
        }
      } else {
        col.classList.add("blogs-txt-col");
        var pTags = col.querySelectorAll('p');
        var date = document.createElement('div');
        date.classList.add('date');
        if(pTags[0]) {
          date.append(pTags[0].innerHTML);
          pTags[0].remove();
          col.append(date);
        }
        var description = document.createElement('div');
        description.classList.add('description');
        if(pTags[1]) {
          description.append(pTags[1].innerHTML);
          pTags[1].remove();
          col.append(description);
        }
      }
    });
  });
  Array.from(block.children).forEach(parentDiv => {
    const aTag = parentDiv.querySelector('a');
    if(aTag) {
      const href = aTag.getAttribute('href');
      const newATag = document.createElement('a');
      newATag.href = href;
      parentDiv.parentNode.insertBefore(newATag, parentDiv);
      newATag.appendChild(parentDiv);
      aTag.remove();
      var emptyPTag = parentDiv.querySelector('p');
      if(!emptyPTag.innerText) emptyPTag.remove();
    }
  });
}

const gameSlider = document.querySelector('.games');
const GameArrowsContainer = document.createElement('div');
const slideRight = document.createElement('div');
const slideLeft = document.createElement('div');
const gamesHeader = document.querySelector('.games-header');
const gameCard = document.querySelectorAll('.games > div');
const buttonLearnMore = document.createElement('button');
buttonLearnMore.classList.add('button-learn-more');
buttonLearnMore.innerHTML = 'Learn More';

gameCard.forEach((v) => {
  v.appendChild(buttonLearnMore.cloneNode(true));
});

GameArrowsContainer.classList.add('game-arrows-container');
slideRight.classList.add('slide-right');
slideRight.innerHTML = '>';
slideLeft.classList.add('slide-left');
slideLeft.innerHTML = '<';

if (GameArrowsContainer) {
  GameArrowsContainer.appendChild(slideLeft);
  GameArrowsContainer.appendChild(slideRight);
  if (gamesHeader) {
    gamesHeader.appendChild(GameArrowsContainer);
  }
}

slideRight.addEventListener('click', () => {
  gameSlider.scrollLeft += 252;
});

slideLeft.addEventListener('click', () => {
  gameSlider.scrollLeft -= 252;
});
