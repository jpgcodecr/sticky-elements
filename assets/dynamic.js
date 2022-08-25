// Get all fixed top elements and calculate height
let fixedTopEls;
let fixedTopElsHeight;
let fixedBottomEls;
let fixedBottomElsHeight;
const fixedBottomElsContainer = document.querySelectorAll('.aem-wrap--bottom');
const bottomStickyContainer = document.createElement('div');

/**
 * @method fixScrollPositioning
 * Fixes scroll positioning using scroll padding top
 */
const fixScrollPositioning = () => {
    // Get top elements height
    fixedTopEls = document.querySelectorAll('.fixed-top');
    fixedTopElsHeight = [...fixedTopEls].map(el => el.offsetHeight).reduce((prev, cur) => prev += cur, 0);

    // Assign scroll padding top to fix positioning
    document.documentElement.style.scrollPaddingTop = `${fixedTopElsHeight}px`;
}

/**
 * @method observeHeaderMutationChanges
 * Observe changes to header children elements and readjust the scroll positioning
 * Needed for when a element is removed from the DOM (like notification banner)
 */
const observeHeaderMutationChanges = () => {
    // Observe header changes to updated the scroll positioning
    const observer = new MutationObserver((mutations_list) => mutations_list.forEach(() => { fixScrollPositioning()}));
    observer.observe(document.querySelector('.header'), { subtree: false, childList: true });

    // Observer bottom container changes to fix bottom padding
    const bottomObserver = new MutationObserver((mutations_list) => mutations_list.forEach(() => {fixBottomPadding()}));
    bottomObserver.observe(document.querySelector('.fixed-bottom-container'), { subtree: false, childList: true });
}

/**
 * @method fixBottomPadding
 * When sticky is bottom an extra margin at the bottom needs to be added
 */
const fixBottomPadding = () => {
    fixedBottomEls = document.querySelectorAll('.fixed-bottom');
    fixedBottomElsHeight = [...fixedBottomEls].map(el => el.offsetHeight).reduce((prev, cur) => prev += cur, 0);

    document.documentElement.style.paddingBottom = `${fixedBottomElsHeight}px`;
}

/**
 * @method setBottomFixedElements
 * Dynamically appending elements to the bottom fixed container
 */
const setBottomFixedElements = () => {
    const str = [...fixedBottomElsContainer].reduce((prev, cur) => prev += cur.innerHTML, '');
    [...fixedBottomElsContainer].forEach(el => el.remove());
    bottomStickyContainer.classList.add('fixed-bottom-container');
    bottomStickyContainer.innerHTML = str;
    document.body.appendChild(bottomStickyContainer);
    fixBottomPadding();
};

// Calls
fixScrollPositioning();
setBottomFixedElements();
observeHeaderMutationChanges();

// This is a callback handler which detects when a element with CSS position:sticky became sticky
// Position of the element can be updated to make sure it is placed in the right place
document.querySelectorAll('.sticky').forEach(el => {
    const instance = new StickyEventListener(el);
    el.addEventListener('sticky', event => {
        if (event.detail.stuck) { el.style.top = `${fixedTopElsHeight}px` }
    });
});