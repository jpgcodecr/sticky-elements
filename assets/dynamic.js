// Get all fixed top elements and calculate height
let fixedTopEls;
let fixedTopElsHeight;
const fixedBottomEls = document.querySelectorAll('.fixed-bottom');
const fixedBottomElsContainer = document.querySelectorAll('.aem-wrap--bottom');
const fixedBottomElsHeight = [...fixedBottomEls].map(el => el.offsetHeight).reduce((prev, cur) => prev += cur, 0);
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
    const observer = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            mutation.removedNodes.forEach(function(removed_node) {
                fixScrollPositioning();
            });
        });
    });
    
    observer.observe(document.querySelector(".header"), { subtree: false, childList: true });
}

/**
 * @method fixBottomPadding
 * When sticky is bottom an extra margin at the bottom needs to be added
 */
const fixBottomPadding = () => {
    document.documentElement.style.paddingBottom = `${fixedBottomElsHeight}px`;
}

const setBottomFixedElements = () => {
    const str = [...fixedBottomElsContainer].reduce((prev, cur) => prev += cur.innerHTML, '');
    [...fixedBottomElsContainer].forEach(el => el.remove());
    bottomStickyContainer.classList.add('fixed-bottom-container');
    bottomStickyContainer.innerHTML = str;
    document.documentElement.appendChild(bottomStickyContainer);
};

// Calls
fixBottomPadding();
fixScrollPositioning();
setBottomFixedElements();
observeHeaderMutationChanges();


// This is a callback handler which detects when a element with CSS position:sticky became sticky
// Position of the element can be updated to make sure it is placed in the right place
document.querySelectorAll('.sticky').forEach(el => {
    const instance = new StickyEventListener(el);
    el.addEventListener('sticky', event => {
        if (event.detail.stuck) {
            el.style.top = `${fixedTopElsHeight}px`;
        }
    });
});