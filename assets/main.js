const stickyElement = document.querySelector('.notification-banner');
const stickyContainer = document.querySelector('.stickyContainer');

// All sticky elements are in the same wrapper to avoid extra validations
// Only wrapper will have position sticky
const fixScrollPositioning = () => {
    const stickyNavHeight = new ResizeObserver(function (entries) {
        const rect = entries[0].contentRect;
        const height = rect.height;
        document.documentElement.style.scrollPaddingTop = `${height}px`;
    });

    stickyNavHeight.observe(document.querySelector('.stickyContainer.top'));
}

const fixBottomPadding = () => {
    const stickyNavHeight = new ResizeObserver(function (entries) {
        const rect = entries[0].contentRect;
        const height = rect.height;
        document.documentElement.style.paddingBottom = `${height}px`;
    });

    stickyNavHeight.observe(document.querySelector('.stickyContainer.bottom'));
}

fixScrollPositioning();
fixBottomPadding();



// This is a handler which detects when a element with CSS position:sticky became sticky
// Position of the element can be updated to make sure it is placed in the right place
document.querySelectorAll('.sticky').forEach(el => {
    const instance = new StickyEventListener(el);
    el.addEventListener('sticky', event => {
        if (event.detail.stuck) {
            el.style.top = `${stickyContainer.offsetHeight}px`;
        }
    });
});