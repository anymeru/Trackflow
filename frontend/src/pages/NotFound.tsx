import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="p-[1px] rounded-[2.5rem] bg-black/[0.03] max-w-md w-full">
        <div className="rounded-[calc(2.5rem-1px)] bg-white p-10 text-center shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
          <p className="text-6xl font-semibold tracking-tight text-gray-200 mb-4">404</p>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Page not found</h1>
          <p className="text-sm text-gray-500 mb-8">This page doesn't exist or has been moved.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-sm font-medium transition-all duration-500 ease-out-expo hover:bg-black/90 active:scale-[0.98]"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
