const highlightColor = '#ff650066';

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

const removeLinkNumberClasses = (anchor) => {
  const numberClass = [...anchor.classList].find((className) =>
    className.startsWith('hnkn__link-')
  );
  if (numberClass) {
    anchor.classList.remove('hnkn__numbered-link');
    anchor.classList.remove(numberClass);
    anchor.textContent = anchor.textContent.slice(3);
  }
};
const removeAllLinkNumberClasses = () => {
  [...document.querySelectorAll('.hnkn__numbered-link')].map(removeLinkNumberClasses);
};

const registerHomepageHandlers = () => {
  const itemTRs = [...document.querySelectorAll('.athing')];
  let selectedTR = null;

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
        const anchor = [...selectedTR.nextSibling.querySelectorAll('a')].find(
          (anchor) =>
            anchor.textContent.endsWith('comments') || anchor.textContent.includes('add comment')
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
};

const registerItemPageHandlers = () => {
  const commentTRs = [...document.querySelectorAll('.athing')];
  let selectedTR = null;

  document.addEventListener('keydown', (event) => {
    if (['j', 'k'].includes(event.key)) {
      removeAllLinkNumberClasses();

      if (!!selectedTR) {
        deselectTR(selectedTR);
      }
      const uncollapsedTRs = [
        ...document.querySelectorAll('table.comment-tree > tbody > tr:not(.noshow)'),
      ];
      const currentTRIndex = uncollapsedTRs.findIndex((tr) => tr === selectedTR);

      if (event.key === 'j') {
        if (currentTRIndex === -1) {
          selectedTR = first(uncollapsedTRs);
        } else {
          if (currentTRIndex + 1 < uncollapsedTRs.length) {
            selectedTR = uncollapsedTRs[currentTRIndex + 1];
          }
        }
      } else if (event.key === 'k') {
        if (currentTRIndex === -1) {
          selectedTR = last(uncollapsedTRs);
        } else {
          if (currentTRIndex - 1 >= 0) {
            selectedTR = uncollapsedTRs[currentTRIndex - 1];
          }
        }
      }

      if (selectedTR) {
        selectTR(selectedTR);
      }
    } else if (event.key === 'h') {
      removeAllLinkNumberClasses();

      if (!selectedTR) {
        return;
      }

      const toggleElement = selectedTR.querySelector('a.togg.clicky');
      if (!toggleElement) {
        return;
      }

      toggleElement.click();
    } else if (event.key === 'o') {
      removeAllLinkNumberClasses();

      if (!selectedTR) {
        return;
      }

      const links = [...selectedTR.querySelectorAll('div.comment a')].filter(
        (link) => link.textContent !== 'reply'
      );

      if (links.length === 0) {
        return;
      } else if (links.length === 1) {
        window.open(first(links).href, '_blank');
      } else {
        const firstTenLinks = links.slice(0, 9);
        firstTenLinks.forEach((link, index) => {
          link.textContent = `{${index + 1}}` + link.textContent;
          link.classList.add('hnkn__numbered-link');
          link.classList.add(`hnkn__link-${index + 1}`);
        });
      }
    } else if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) {
      const link = document.querySelector(`.hnkn__link-${event.key}`);
      if (!link) {
        return;
      }
      removeAllLinkNumberClasses();
      window.open(link.href, '_blank');
    }
  });
};

if (['/', ''].includes(window.location.pathname)) {
  registerHomepageHandlers();
} else if (window.location.pathname === '/item') {
  registerItemPageHandlers();
}
