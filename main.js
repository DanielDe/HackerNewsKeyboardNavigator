const highlightColor = '#ff6500a3';

const itemTRs = [...document.querySelectorAll('.athing')];
let selectedTR = null;

const isInViewport = (element) => {
  var bounding = element.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const first = (list) => list[0];
const last = (list) => list[list.length - 1];

const deselectTR = (tr) => {
  tr.style.backgroundColor = 'transparent';
};

const selectTR = (tr) => {
  tr.style.backgroundColor = highlightColor;

  if (!isInViewport(tr)) {
    tr.scrollIntoView();
  }
};

document.addEventListener('keydown', (event) => {
  if (['j', 'k'].includes(event.key)) {
    if (!!selectedTR) {
      deselectTR(selectedTR);
    }
    const currentTRIndex = itemTRs.findIndex((tr) => tr === selectedTR);

    if (event.key === 'j') {
      if (currentTRIndex === -1) {
        selectedTR = first(itemTRs);
      } else {
        if (currentTRIndex + 1 < itemTRs.length) {
          selectedTR = itemTRs[currentTRIndex + 1];
        }
      }
    } else if (event.key === 'k') {
      if (currentTRIndex === -1) {
        selectedTR = last(itemTRs);
      } else {
        if (currentTRIndex - 1 >= 0) {
          selectedTR = itemTRs[currentTRIndex - 1];
        }
      }
    }

    selectTR(selectedTR);
  } else if (event.key === 'Enter') {
    if (!!selectedTR) {
      const anchor = selectedTR.querySelector('.titlelink');
      if (event.ctrlKey) {
        window.open(anchor.href, '_blank');
      } else {
        anchor.click();
      }
    }
  } else if (event.key === 'c') {
    if (!!selectedTR) {
      const anchor = [...selectedTR.nextSibling.querySelectorAll('a')].find((anchor) =>
        anchor.textContent.endsWith('comments')
      );
      if (event.ctrlKey) {
        window.open(anchor.href, '_blank');
      } else {
        anchor.click();
      }
    }
  } else if (event.key === 's') {
    if (!!selectedTR) {
      const anchor = [...selectedTR.nextSibling.querySelectorAll('a')].find((anchor) =>
        anchor.href.startsWith('https://news.ycombinator.com/user')
      );
      if (event.ctrlKey) {
        window.open(anchor.href, '_blank');
      } else {
        anchor.click();
      }
    }
  }
});
