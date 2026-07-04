import React from 'react';
import DocsVersionDropdownNavbarItem from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem';
import type DocsVersionDropdownNavbarItemType from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';

type Props = WrapperProps<typeof DocsVersionDropdownNavbarItemType>;

export default function DocsVersionDropdownNavbarItemWrapper(props: Props): React.JSX.Element | null {
  const {pathname} = useLocation();

  // Only render the version dropdown when browsing LXMASTER pages.
  // The lxmaster plugin serves all routes under /lxmaster/.
  if (props.docsPluginId === 'lxmaster' && !pathname.startsWith('/lxmaster/')) {
    return null;
  }

  return <DocsVersionDropdownNavbarItem {...props} />;
}
