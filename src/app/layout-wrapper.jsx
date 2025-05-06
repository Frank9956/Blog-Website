import Sidebar from './components/sidebar';
import Sidenews from './components/Sidenews';

export default function LayoutWrapper({ children, hideSidebar }) {
  return (
    <>
      {/* Conditionally render Sidebar based on hideSidebar prop */}
      {!hideSidebar && (
        <div className="w-full lg:w-[auto] h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
          <Sidebar />
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1 pt-5 h-auto lg:h-[calc(100vh-60px)] overflow-y-auto no-scrollbar">
        {children}
      </main>

      {/* Conditionally render Sidenews */}
      {!hideSidebar && (
        <div className="w-full lg:w-[auto] h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
          <Sidenews limit={4} />
        </div>
      )}
    </>
  );
}

// This function runs on the server-side
export async function getServerSideProps({ req }) {
  const pathname = req.url || '';

  // Check if the current route should hide the sidebar
  const hideSidebar = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up');

  return {
    props: {
      hideSidebar, // Pass this value as a prop to the component
    },
  };
}
