import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

/**
 * Hides the LXMASTER version dropdown when not on an /lxmaster/ page.
 *
 * The CSS rule (custom.css) hides it by default (html:not(.lxmaster-section)).
 * This component adds/removes `lxmaster-section` on <html> after every route
 * change so the CSS responds immediately to client-side navigation.
 */
export default function Root({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const isLxmaster = pathname === '/lxmaster' || pathname.startsWith('/lxmaster/');
    document.documentElement.classList.toggle('lxmaster-section', isLxmaster);

    // Belt-and-suspenders: also set visibility directly on the dropdown element
    // in case the CSS rule hasn't applied yet (e.g. very first paint).
    const dropdowns = document.querySelectorAll<HTMLElement>(
      '.navbar__items--right .navbar__item.dropdown',
    );
    dropdowns.forEach((el) => {
      el.style.display = isLxmaster ? '' : 'none';
    });
  }, [pathname]);

  return <>{children}</>;
}
