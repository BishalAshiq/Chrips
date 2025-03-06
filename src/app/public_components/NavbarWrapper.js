import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the navbar components with SSR disabled
const Navbar = dynamic(() => import('./Navbar'), {
  ssr: false,
  loading: () => <div className="h-16"></div> // Placeholder height to prevent layout shift
});

const AuthenticatedNavbar = dynamic(() => import('./AuthenticatedNavbar'), {
  ssr: false,
  loading: () => <div className="h-16"></div>
});

// This component will handle the loading state and navbar switching
export default function NavbarWrapper() {
  return (
    <Suspense fallback={<div className="h-16"></div>}>
      <ClientNavbarWrapper />
    </Suspense>
  );
}

// Client-side component to handle authentication logic
const ClientNavbarWrapper = dynamic(() => import('./ClientNavbarWrapper'), {
  ssr: false
});
