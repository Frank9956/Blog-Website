// import { headers } from 'next/headers';
// import Sidebar from './components/sidebar';
// import Sidenews from './components/Sidenews';

// export default async function LayoutWrapper({ children }) {
//   // Get the pathname from the custom 'x-pathname' header
//   const headersList = await headers();
//   const pathname = headersList.get('x-pathname') || '';

//   // Determine whether to hide the sidebar based on the pathname
//   const hideSidebar =
//     pathname.startsWith('/dashboard') ||
//     pathname.startsWith('/sign-in') ||
//     pathname.startsWith('/sign-up');

//   return (
//     <div className="flex">
//       {/* Conditionally render Sidebar based on hideSidebar */}
//       {!hideSidebar && (
//         <div className="w-full lg:w-auto h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-b lg:border-b-0 lg:border-r border-border no-scrollbar">
//           <Sidebar />
//         </div>
//       )}

//       {/* Main Page Content */}
//       <main className="max-w-5xl flex-1 pt-5 h-auto lg:h-[calc(100vh-60px)] overflow-y-auto no-scrollbar">
//         {children}
//       </main>

//       {/* Conditionally render Sidenews */}
//       {!hideSidebar && (
//         <div className="w-full lg:w-[auto] r-0 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto border-t lg:border-t-0 lg:border-l border-border no-scrollbar">
//           <Sidenews limit={4} />
//         </div>
//       )}
//     </div>
//   );
// }
