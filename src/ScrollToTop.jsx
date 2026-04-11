import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scroll to the top of the document on every pathname change.
// Deliberately keyed on `pathname` only (not the whole location object) so
// that URL search-param changes (e.g. ?page=2 from Pagination) do NOT trigger
// a scroll-to-top — those navigations use a manual scroll-to-anchor instead.
//
// Uses instant scroll (default behavior) rather than smooth, because smooth
// animated scrolls after a page transition produce a visible "jump-then-slide"
// jank as the new page renders at a random scroll offset first.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
