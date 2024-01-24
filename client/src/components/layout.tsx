import React, { ReactNode } from 'react';
import Navbar from './navbar';

interface LayoutProps {
  children: ReactNode;
  // Add other props as needed
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <><Navbar /><div>{children}</div></>

  );
};

export default Layout;
