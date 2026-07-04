import React from 'react';
import { useLocation } from '@docusaurus/router';

/**
 * Hides the LXMASTER version dropdown on every page except /lxmaster/*.
 *
 * A React-managed <style> tag is the only reliable approach: direct DOM
 * manipulation gets overwritten by Docusaurus's navbar re-renders, and a
 * plain CSS class toggle can lose the race against hydration.
 */
export default function Root({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isLxmaster = pathname === '/lxmaster' || pathname.startsWith('/lxmaster/');

  return (
    <>
      {!isLxmaster && (
        <style>{`
          .navbar__items--right .navbar__item.dropdown { display: none !important; }
        `}</style>
      )}
      {children}
    </>
  );
}
