const NAV_OFFSET = 80;

export function scrollToHash(hash?: string, behavior: ScrollBehavior = 'smooth'): boolean {
  const id = (hash ?? window.location.hash).replace(/^#/, '');
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior });
  return true;
}

/** Scroll to the current URL hash on load (SPA) and when the hash changes. */
export function watchHashScroll(): () => void {
  let attempts = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const tryScroll = (behavior: ScrollBehavior) => {
    if (!window.location.hash) return;
    if (scrollToHash(undefined, behavior)) return;

    if (attempts < 40) {
      attempts += 1;
      timer = setTimeout(() => tryScroll(behavior), 50);
    }
  };

  const onHashChange = () => {
    attempts = 0;
    if (timer) clearTimeout(timer);
    tryScroll('smooth');
  };

  tryScroll('auto');
  window.addEventListener('hashchange', onHashChange);

  return () => {
    if (timer) clearTimeout(timer);
    window.removeEventListener('hashchange', onHashChange);
  };
}
