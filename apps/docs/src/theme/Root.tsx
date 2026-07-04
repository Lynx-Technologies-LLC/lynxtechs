import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

// Adds `lxmaster-section` to <html> whenever the visitor is on an /lxmaster/ page.
// The version dropdown in the navbar is hidden via CSS when this class is absent.
export default function Root({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const isLxmaster = pathname === '/lxmaster' || pathname.startsWith('/lxmaster/');
    document.documentElement.classList.toggle('lxmaster-section', isLxmaster);
  }, [pathname]);

  return <>{children}</>;
}
